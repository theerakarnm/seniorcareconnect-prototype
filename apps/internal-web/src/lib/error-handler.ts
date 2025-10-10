export class AppError extends Error {
  constructor(
    message: string,
    public code?: string,
    public statusCode: number = 500,
    public isOperational: boolean = true
  ) {
    super(message);
    this.name = "AppError";

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }
  }
}

export class ValidationError extends AppError {
  constructor(message: string, public field?: string) {
    super(message, "VALIDATION_ERROR", 400);
    this.name = "ValidationError";
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = "Authentication required") {
    super(message, "AUTHENTICATION_ERROR", 401);
    this.name = "AuthenticationError";
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = "Access denied") {
    super(message, "AUTHORIZATION_ERROR", 403);
    this.name = "AuthorizationError";
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = "Resource not found") {
    super(message, "NOT_FOUND_ERROR", 404);
    this.name = "NotFoundError";
  }
}

export class ConflictError extends AppError {
  constructor(message: string = "Resource already exists") {
    super(message, "CONFLICT_ERROR", 409);
    this.name = "ConflictError";
  }
}

export class NetworkError extends AppError {
  constructor(message: string = "Network error occurred") {
    super(message, "NETWORK_ERROR", 0);
    this.name = "NetworkError";
  }
}

/**
 * Error handler utility functions
 */
export const ErrorHandler = {
  /**
   * Handle async errors in a consistent way
   */
  async handleAsync<T>(
    asyncFn: () => Promise<T>,
    onError?: (error: Error) => void
  ): Promise<{ data?: T; error?: Error }> {
    try {
      const data = await asyncFn();
      return { data };
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      onError?.(err);
      return { error: err };
    }
  },

  /**
   * Create a user-friendly error message
   */
  getUserMessage(error: Error): string {
    if (error instanceof AppError && error.isOperational) {
      return error.message;
    }

    // Handle common error patterns
    if (error.message.includes("Network Error") || error.message.includes("fetch")) {
      return "Network connection failed. Please check your internet connection.";
    }

    if (error.message.includes("timeout")) {
      return "Request timed out. Please try again.";
    }

    if (error.message.includes("Unauthorized") || error.message.includes("401")) {
      return "Please log in to continue.";
    }

    if (error.message.includes("Forbidden") || error.message.includes("403")) {
      return "You don't have permission to perform this action.";
    }

    if (error.message.includes("Not Found") || error.message.includes("404")) {
      return "The requested resource was not found.";
    }

    // Default message
    return process.env.NODE_ENV === "production"
      ? "An unexpected error occurred. Please try again."
      : error.message;
  },

  /**
   * Get error code for logging/analytics
   */
  getErrorCode(error: Error): string {
    if (error instanceof AppError) {
      return error.code || "UNKNOWN_ERROR";
    }

    if (error.name === "ZodError") {
      return "VALIDATION_ERROR";
    }

    if (error.message.includes("Prisma")) {
      return "DATABASE_ERROR";
    }

    if (error.message.includes("Network") || error.message.includes("fetch")) {
      return "NETWORK_ERROR";
    }

    return "UNKNOWN_ERROR";
  },

  /**
   * Check if error is recoverable (can be retried)
   */
  isRecoverable(error: Error): boolean {
    if (error instanceof NetworkError) {
      return true;
    }

    if (error.message.includes("timeout") || error.message.includes("ECONNRESET")) {
      return true;
    }

    if (error.message.includes("503") || error.message.includes("502") || error.message.includes("504")) {
      return true;
    }

    return false;
  },

  /**
   * Log error for monitoring
   */
  log(error: Error, context?: Record<string, any>) {
    const errorData = {
      message: error.message,
      name: error.name,
      stack: error.stack,
      code: this.getErrorCode(error),
      timestamp: new Date().toISOString(),
      context,
      userAgent: typeof window !== "undefined" ? window.navigator.userAgent : undefined,
      url: typeof window !== "undefined" ? window.location.href : undefined,
    };

    // In production, you might want to send this to a logging service
    console.error("Application Error:", errorData);

    // You could also send to Sentry, LogRocket, etc.
    // if (typeof window !== "undefined" && window.Sentry) {
    //   window.Sentry.captureException(error, { extra: context });
    // }
  },
};

/**
 * Higher-order function for handling errors in async functions
 */
export function withErrorHandling<T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  options?: {
    onError?: (error: Error) => void;
    rethrow?: boolean;
  }
) {
  return async (...args: T): Promise<R> => {
    try {
      return await fn(...args);
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));

      ErrorHandler.log(err);
      options?.onError?.(err);

      if (options?.rethrow) {
        throw err;
      }

      throw err;
    }
  };
}