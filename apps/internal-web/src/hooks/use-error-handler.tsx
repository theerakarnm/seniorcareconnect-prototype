"use client";

import { useCallback } from "react";
import { toast } from "sonner";

export interface ErrorInfo {
  message: string;
  code?: string;
  field?: string;
  details?: any;
}

export function useErrorHandler() {
  const handleError = useCallback((error: Error | ErrorInfo | string, options?: {
    showToast?: boolean;
    toastMessage?: string;
    logToConsole?: boolean;
  }) => {
    const {
      showToast = true,
      toastMessage,
      logToConsole = true,
    } = options || {};

    let errorInfo: ErrorInfo;

    if (typeof error === "string") {
      errorInfo = { message: error };
    } else if (error instanceof Error) {
      errorInfo = {
        message: error.message,
        code: (error as any).code,
      };
    } else {
      errorInfo = error;
    }

    // Log to console if enabled
    if (logToConsole) {
      console.error("Error handled:", errorInfo);
    }

    // Show toast notification if enabled
    if (showToast) {
      toast.error(toastMessage || "Error occurred", {
        description: errorInfo.message,
        duration: 5000,
        action: errorInfo.code ? {
          label: "Code",
          onClick: () => navigator.clipboard.writeText(errorInfo.code!),
        } : undefined,
      });
    }

    return errorInfo;
  }, []);

  const handleSuccess = useCallback((message: string, options?: {
    description?: string;
    duration?: number;
  }) => {
    toast.success(message, {
      description: options?.description,
      duration: options?.duration || 3000,
    });
  }, []);

  const handleInfo = useCallback((message: string, options?: {
    description?: string;
    duration?: number;
  }) => {
    toast.info(message, {
      description: options?.description,
      duration: options?.duration || 4000,
    });
  }, []);

  const handleWarning = useCallback((message: string, options?: {
    description?: string;
    duration?: number;
  }) => {
    toast.warning(message, {
      description: options?.description,
      duration: options?.duration || 4000,
    });
  }, []);

  return {
    handleError,
    handleSuccess,
    handleInfo,
    handleWarning,
  };
}

/**
 * Hook for handling API errors with retry functionality
 */
export function useAPIErrorHandler() {
  const { handleError } = useErrorHandler();

  const handleAPIError = useCallback(async (
    error: any,
    retryFn?: () => Promise<any>,
    options?: {
      maxRetries?: number;
      retryDelay?: number;
    }
  ) => {
    const { maxRetries = 3, retryDelay = 1000 } = options || {};

    // Handle network errors
    if (!navigator.onLine) {
      return handleError("You are offline. Please check your internet connection.");
    }

    // Handle HTTP status errors
    if (error.response) {
      const { status, data } = error.response;
      const errorInfo = data?.error || { message: "Request failed" };

      switch (status) {
        case 401:
          handleError("Authentication required", {
            toastMessage: "Please log in to continue",
          });
          // Redirect to login page
          window.location.href = "/login";
          break;

        case 403:
          handleError("Access denied", {
            toastMessage: "You don't have permission to perform this action",
          });
          break;

        case 404:
          handleError("Resource not found");
          break;

        case 422:
          handleError(errorInfo.message || "Validation failed");
          break;

        case 429:
          handleError("Too many requests", {
            toastMessage: "Please wait before trying again",
          });
          break;

        case 500:
          handleError("Server error", {
            toastMessage: "Something went wrong on our end",
          });
          break;

        default:
          handleError(errorInfo.message || "Request failed");
      }

      // Retry on server errors if retry function provided
      if (status >= 500 && retryFn && maxRetries > 0) {
        setTimeout(() => {
          retryFn().catch((retryError: any) =>
            handleAPIError(retryError, retryFn, { maxRetries: maxRetries - 1 })
          );
        }, retryDelay);
      }

      return;
    }

    // Handle network timeout errors
    if (error.code === "ECONNABORTED" || error.message?.includes("timeout")) {
      handleError("Request timed out", {
        toastMessage: "Please try again",
      });

      if (retryFn && maxRetries > 0) {
        setTimeout(() => {
          retryFn().catch((retryError: any) =>
            handleAPIError(retryError, retryFn, { maxRetries: maxRetries - 1 })
          );
        }, retryDelay);
      }
      return;
    }

    // Handle other errors
    handleError(error.message || "An unexpected error occurred");
  }, [handleError]);

  return { handleAPIError };
}

/**
 * Hook for handling form submission errors
 */
export function useFormErrorHandler() {
  const { handleError } = useErrorHandler();

  const handleFormError = useCallback((error: any, setFieldError?: (field: string, message: string) => void) => {
    // Handle server action errors
    if (error?.error) {
      const { message, field } = error.error;

      if (field && setFieldError) {
        setFieldError(field, message);
      } else {
        handleError(message);
      }
      return;
    }

    // Handle validation errors with field information
    if (error?.field && setFieldError) {
      setFieldError(error.field, error.message);
    } else {
      handleError(error?.message || error || "Form submission failed");
    }
  }, [handleError]);

  return { handleFormError };
}