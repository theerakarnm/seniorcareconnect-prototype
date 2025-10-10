"use client";

import { Button } from "@acme/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@acme/ui";
import { useErrorHandler, useAPIErrorHandler } from "~/hooks/use-error-handler";
import { ErrorHandler } from "~/lib/error-handler";

export default function TestErrorsPage() {
  const { handleError, handleSuccess, handleInfo, handleWarning } = useErrorHandler();
  const { handleAPIError } = useAPIErrorHandler();

  const testBasicError = () => {
    handleError("This is a basic error message");
  };

  const testErrorWithDetails = () => {
    handleError({
      message: "This error has more details",
      code: "TEST_ERROR",
      field: "username",
      details: { userId: 123, action: "update_profile" },
    });
  };

  const testAsyncError = async () => {
    await ErrorHandler.handleAsync(async () => {
      throw new Error("This is an async error");
    }, handleError);
  };

  const testNetworkError = () => {
    const fakeNetworkError = new Error("Network request failed");
    (fakeNetworkError as any).code = "NETWORK_ERROR";
    handleAPIError(fakeNetworkError);
  };

  const testValidationError = () => {
    handleError({
      message: "Email is required",
      field: "email",
      code: "VALIDATION_ERROR",
    });
  };

  const testServerError = () => {
    const serverError = new Error("Internal server error");
    handleAPIError({
      response: {
        status: 500,
        data: { error: { message: "Internal server error", code: "INTERNAL_ERROR" } },
      },
    });
  };

  const test404Error = () => {
    handleAPIError({
      response: {
        status: 404,
        data: { error: { message: "Resource not found", code: "NOT_FOUND_ERROR" } },
      },
    });
  };

  const testAuthError = () => {
    handleAPIError({
      response: {
        status: 401,
        data: { error: { message: "Authentication required", code: "AUTHENTICATION_ERROR" } },
      },
    });
  };

  const testPromiseRejection = () => {
    Promise.reject(new Error("Unhandled promise rejection"))
      .catch((error) => handleError(error));
  };

  const testSuccessToast = () => {
    handleSuccess("Operation completed successfully!", {
      description: "Your changes have been saved.",
    });
  };

  const testInfoToast = () => {
    handleInfo("Information message", {
      description: "Here's some useful information.",
    });
  };

  const testWarningToast = () => {
    handleWarning("Warning message", {
      description: "Please be careful with this action.",
    });
  };

  const triggerJavaScriptError = () => {
    // This will be caught by the ErrorBoundary
    throw new Error("This is a deliberate JavaScript error to test the ErrorBoundary");
  };

  return (
    <div className="container mx-auto p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Error Handling Test Page</h1>
          <p className="text-muted-foreground">
            Test different types of errors and see how they're handled with toast notifications.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Basic Error Tests</CardTitle>
              <CardDescription>
                Test basic error handling functionality
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button onClick={testBasicError} variant="outline" className="w-full">
                Basic Error Message
              </Button>
              <Button onClick={testErrorWithDetails} variant="outline" className="w-full">
                Error with Details
              </Button>
              <Button onClick={testAsyncError} variant="outline" className="w-full">
                Async Error
              </Button>
              <Button onClick={testPromiseRejection} variant="outline" className="w-full">
                Promise Rejection
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Validation Errors</CardTitle>
              <CardDescription>
                Test form validation error handling
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button onClick={testValidationError} variant="outline" className="w-full">
                Validation Error
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>API Errors</CardTitle>
              <CardDescription>
                Test API error handling with different HTTP status codes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button onClick={testNetworkError} variant="outline" className="w-full">
                Network Error
              </Button>
              <Button onClick={test404Error} variant="outline" className="w-full">
                404 Not Found
              </Button>
              <Button onClick={testAuthError} variant="outline" className="w-full">
                401 Unauthorized
              </Button>
              <Button onClick={testServerError} variant="outline" className="w-full">
                500 Server Error
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Success & Info Messages</CardTitle>
              <CardDescription>
                Test non-error toast notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button onClick={testSuccessToast} className="w-full">
                Success Message
              </Button>
              <Button onClick={testInfoToast} variant="outline" className="w-full">
                Info Message
              </Button>
              <Button onClick={testWarningToast} variant="outline" className="w-full">
                Warning Message
              </Button>
            </CardContent>
          </Card>

          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="text-red-600">Error Boundary Test</CardTitle>
              <CardDescription>
                ⚠️ This will trigger a JavaScript error and show the ErrorBoundary
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={triggerJavaScriptError}
                variant="destructive"
                className="w-full"
              >
                Trigger Error Boundary
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Error Handling Features</CardTitle>
            <CardDescription>
              What this error handling system provides
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 text-sm">
              <div>
                <h4 className="font-semibold mb-2">✅ Features</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Toast notifications for all errors</li>
                  <li>• Error boundary for React errors</li>
                  <li>• Server action error handling</li>
                  <li>• API error middleware</li>
                  <li>• Form validation error handling</li>
                  <li>• Network error handling</li>
                  <li>• Error logging and tracking</li>
                  <li>• User-friendly error messages</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">🔧 Error Types</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Validation errors</li>
                  <li>• Authentication errors</li>
                  <li>• Authorization errors</li>
                  <li>• Not found errors</li>
                  <li>• Network errors</li>
                  <li>• Server errors</li>
                  <li>• Database errors</li>
                  <li>• Unexpected errors</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}