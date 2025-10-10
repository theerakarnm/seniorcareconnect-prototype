import { AdminRoute } from "~/components/ProtectedRoute";
import { useRole } from "~/hooks/useRole";

export default function AdminRouteComponent() {
  const { user, isAdmin } = useRole();

  return (
    <AdminRoute>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow rounded-lg p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>

            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                Welcome, <span className="font-semibold">{user?.name}</span>!
                You have admin privileges.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">User Management</h2>
                <p className="text-gray-600 mb-4">Manage all users in the system</p>
                <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                  Manage Users
                </button>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Supplier Management</h2>
                <p className="text-gray-600 mb-4">Review and approve suppliers</p>
                <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                  Manage Suppliers
                </button>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">System Settings</h2>
                <p className="text-gray-600 mb-4">Configure system settings</p>
                <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                  Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminRoute>
  );
}