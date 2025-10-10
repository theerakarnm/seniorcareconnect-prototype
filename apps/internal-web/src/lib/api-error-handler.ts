import { NextRequest, NextResponse } from "next/server";

export class APIError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message);
    this.name = "APIError";
  }
}

export class ValidationError extends APIError {
  constructor(message: string, public field?: string) {
    super(message, 400, "VALIDATION_ERROR");
    this.name = "ValidationError";
  }
}

export class AuthenticationError extends APIError {
  constructor(message: string = "Authentication required") {
    super(message, 401, "AUTHENTICATION_ERROR");
    this.name = "AuthenticationError";
  }
}

export class AuthorizationError extends APIError {
  constructor(message: string = "Access denied") {
    super(message, 403, "AUTHORIZATION_ERROR");
    this.name = "AuthorizationError";
  }
}

export class NotFoundError extends APIError {
  constructor(message: string = "Resource not found") {
    super(message, 404, "NOT_FOUND_ERROR");
    this.name = "NotFoundError";
  }
}

export interface ErrorResponse {
  success: false;
  error: {
    message: string;
    code?: string;
    field?: string;
    details?: any;
  };
  timestamp: string;
  requestId?: string;
}

/**
 * Handles API errors and returns consistent error responses
 */
export function handleAPIError(error: unknown, requestId?: string): NextResponse<ErrorResponse> {
  console.error("API Error:", {
    error,
    requestId,
    timestamp: new Date().toISOString(),
  });

  // Handle known API errors
  if (error instanceof APIError) {
    return NextResponse.json(
      {
        success: false,
        error: {
          message: error.message,
          code: error.code,
          field: error instanceof ValidationError ? error.field : undefined,
        },
        timestamp: new Date().toISOString(),
        requestId,
      },
      { status: error.statusCode }
    );
  }

  // Handle Zod validation errors
  if (error instanceof Error && error.name === "ZodError") {
    const zodError = error as any;
    const fieldErrors = zodError.errors?.map((err: any) => ({
      field: err.path?.join('.'),
      message: err.message,
    }));

    return NextResponse.json(
      {
        success: false,
        error: {
          message: "Validation failed",
          code: "VALIDATION_ERROR",
          details: fieldErrors,
        },
        timestamp: new Date().toISOString(),
        requestId,
      },
      { status: 400 }
    );
  }

  // Handle Prisma errors
  if (error instanceof Error && error.name === "PrismaClientKnownRequestError") {
    const prismaError = error as any;

    switch (prismaError.code) {
      case "P2002":
        return NextResponse.json(
          {
            success: false,
            error: {
              message: "Resource already exists",
              code: "DUPLICATE_ERROR",
            },
            timestamp: new Date().toISOString(),
            requestId,
          },
          { status: 409 }
        );
      case "P2025":
        return NextResponse.json(
          {
            success: false,
            error: {
              message: "Resource not found",
              code: "NOT_FOUND_ERROR",
            },
            timestamp: new Date().toISOString(),
            requestId,
          },
          { status: 404 }
        );
      default:
        return NextResponse.json(
          {
            success: false,
            error: {
              message: "Database operation failed",
              code: "DATABASE_ERROR",
            },
            timestamp: new Date().toISOString(),
            requestId,
          },
          { status: 500 }
        );
    }
  }

  // Handle unknown errors
  return NextResponse.json(
    {
      success: false,
      error: {
        message: process.env.NODE_ENV === "production"
          ? "An unexpected error occurred"
          : error instanceof Error ? error.message : "Unknown error",
        code: "INTERNAL_ERROR",
      },
      timestamp: new Date().toISOString(),
      requestId,
    },
    { status: 500 }
  );
}

/**
 * Wrapper for API route handlers with consistent error handling
 */
export function withAPIHandler(
  handler: (req: NextRequest, context?: any) => Promise<NextResponse>
) {
  return async (req: NextRequest, context?: any): Promise<NextResponse> => {
    // Generate a unique request ID for tracing
    const requestId = '';

    try {
      const response = await handler(req, context);

      // Add request ID to response headers
      response.headers.set('X-Request-ID', requestId);

      return response;
    } catch (error) {
      return handleAPIError(error, requestId);
    }
  };
}

/**
 * Validates request body with Zod schema
 */
export function validateRequestBody<T>(
  schema: any,
  body: unknown
): { success: true; data: T } | { success: false; error: ValidationError } {
  try {
    const data = schema.parse(body);
    return { success: true, data };
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      const zodError = error as any;
      const firstError = zodError.errors?.[0];
      throw new ValidationError(
        firstError?.message || "Invalid request body",
        firstError?.path?.join('.')
      );
    }
    throw new ValidationError("Invalid request body");
  }
}