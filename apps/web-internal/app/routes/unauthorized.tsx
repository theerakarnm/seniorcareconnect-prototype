import { Link, useLocation } from "react-router";
import { useRole } from "~/hooks/useRole";

export default function UnauthorizedRoute() {
  const location = useLocation();
  const { user, role } = useRole();
  const from = location.state?.from?.pathname || "/";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-red-600 mb-4">403</h1>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-8">
            You don't have permission to access this page.
          </p>

          {user && (
            <div className="mb-6 p-4 bg-gray-100 rounded-lg">
              <p className="text-sm text-gray-600">
                You are logged in as <span className="font-semibold">{user.name}</span> with role{" "}
                <span className="font-semibold capitalize">{role}</span>
              </p>
            </div>
          )}

          <div className="space-y-4">
            <Link
              to={from}
              className="block w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Go Back
            </Link>

            <div className="text-sm text-gray-500">
              Or navigate to:
            </div>

            <div className="space-y-2">
              <Link
                to="/"
                className="block text-blue-600 hover:text-blue-800 underline"
              >
                Home
              </Link>
              {role === "admin" && (
                <Link
                  to="/admin"
                  className="block text-blue-600 hover:text-blue-800 underline"
                >
                  Admin Dashboard
                </Link>
              )}
              {role === "supplier" && (
                <Link
                  to="/supplier"
                  className="block text-blue-600 hover:text-blue-800 underline"
                >
                  Supplier Dashboard
                </Link>
              )}
              {role === "customer" && (
                <Link
                  to="/customer"
                  className="block text-blue-600 hover:text-blue-800 underline"
                >
                  Customer Dashboard
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}