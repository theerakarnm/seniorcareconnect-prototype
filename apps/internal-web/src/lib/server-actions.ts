"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

export class ServerActionError extends Error {
  constructor(
    message: string,
    public statusCode = 500,
    public code?: string
  ) {
    super(message);
    this.name = "ServerActionError";
  }
}

export class ValidationError extends ServerActionError {
  constructor(message: string, public field?: string) {
    super(message, 400, "VALIDATION_ERROR");
    this.name = "ValidationError";
  }
}

export class AuthenticationError extends ServerActionError {
  constructor(message = "Authentication required") {
    super(message, 401, "AUTHENTICATION_ERROR");
    this.name = "AuthenticationError";
  }
}

export class AuthorizationError extends ServerActionError {
  constructor(message = "Access denied") {
    super(message, 403, "AUTHORIZATION_ERROR");
    this.name = "AuthorizationError";
  }
}

export class NotFoundError extends ServerActionError {
  constructor(message = "Resource not found") {
    super(message, 404, "NOT_FOUND_ERROR");
    this.name = "NotFoundError";
  }
}

type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: { message: string; code?: string; field?: string } };

/**
 * Wraps server actions with consistent error handling
 */
export function withErrorHandling<T extends any[], R>(
  action: (...args: T) => Promise<R>,
  options?: {
    redirectOnSuccess?: string;
    redirectOnError?: string;
    successMessage?: string;
  }
) {
  return async (...args: T): Promise<ActionResult<R>> => {
    try {
      const result = await action(...args);

      if (options?.redirectOnSuccess) {
        redirect(options.redirectOnSuccess);
      }

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      console.error("Server action error:", error);

      // Handle different error types
      if (error instanceof ServerActionError) {
        if (options?.redirectOnError) {
          redirect(`${options.redirectOnError}?error=${encodeURIComponent(error.message)}&code=${error.code || ""}`);
        }

        return {
          success: false,
          error: {
            message: error.message,
            code: error.code,
            field: error instanceof ValidationError ? error.field : undefined,
          },
        };
      }

      // Handle Zod validation errors
      if (error instanceof z.ZodError) {
        const fieldErrors = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
        }));

        if (options?.redirectOnError) {
          const errorParams = new URLSearchParams({
            error: "Validation failed",
            details: JSON.stringify(fieldErrors),
          });
          redirect(`${options.redirectOnError}?${errorParams}`);
        }

        return {
          success: false,
          error: {
            message: "Validation failed",
            code: "VALIDATION_ERROR",
            field: fieldErrors[0]?.field,
          },
        };
      }

      // Handle Next.js redirect errors (these are expected)
      if (error instanceof Error && error.message.includes("NEXT_REDIRECT")) {
        throw error; // Re-throw redirect errors
      }

      // Handle unknown errors
      if (options?.redirectOnError) {
        redirect(`${options.redirectOnError}?error=${encodeURIComponent("An unexpected error occurred")}`);
      }

      return {
        success: false,
        error: {
          message: "An unexpected error occurred",
          code: "INTERNAL_ERROR",
        },
      };
    }
  };
}

/**
 * Creates a server action with built-in error handling
 */
export function createServerAction<T extends any[], R>(
  action: (...args: T) => Promise<R>,
  options?: {
    requireAuth?: boolean;
    requireRole?: ("customer" | "supplier" | "admin")[];
    successMessage?: string;
    redirectOnSuccess?: string;
    redirectOnError?: string;
  }
) {
  return async (...args: T): Promise<ActionResult<R>> => {
    return withErrorHandling(
      async (...innerArgs: T) => {
        // Check authentication if required
        if (options?.requireAuth) {
          const { getSession } = await import("~/auth/server");
          const session = await getSession();

          if (!session?.user) {
            throw new AuthenticationError();
          }

          // Check role authorization if required
          if (options?.requireRole && options.requireRole.length > 0) {
            if (!options.requireRole.includes(session.user.role as any)) {
              throw new AuthorizationError();
            }
          }
        }

        return await action(...innerArgs);
      },
      {
        redirectOnSuccess: options?.redirectOnSuccess,
        redirectOnError: options?.redirectOnError,
      }
    )(...args);
  };
}

/**
 * Validates data with Zod schema and throws ValidationError if invalid
 */
export function validateAction<T>(schema: z.ZodSchema<T>, data: unknown): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.errors[0];
      throw new ValidationError(
        firstError.message,
        firstError.path.join('.')
      );
    }
    throw new ValidationError("Invalid data provided");
  }
}