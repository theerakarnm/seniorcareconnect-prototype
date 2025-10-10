import { SupplierOrAdminRoute } from "~/components/ProtectedRoute";
import { useRole } from "~/hooks/useRole";

export default function SupplierRouteComponent() {
  const { user, isSupplier, isAdmin } = useRole();

  return (
    <SupplierOrAdminRoute>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow rounded-lg p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">
              {isAdmin ? "Supplier Management (Admin View)" : "Supplier Dashboard"}
            </h1>

            <div className="mb-6 p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-green-800">
                Welcome, <span className="font-semibold">{user?.name}</span>!
                {isAdmin
                  ? " You are viewing this page with admin privileges."
                  : " You have supplier privileges."
                }
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">My Properties</h2>
                <p className="text-gray-600 mb-4">Manage your nursing home properties</p>
                <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                  View Properties
                </button>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Bookings</h2>
                <p className="text-gray-600 mb-4">View and manage booking requests</p>
                <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                  Manage Bookings
                </button>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Analytics</h2>
                <p className="text-gray-600 mb-4">View performance analytics</p>
                <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                  View Analytics
                </button>
              </div>
            </div>

            {isAdmin && (
              <div className="mt-8 p-4 bg-yellow-50 rounded-lg">
                <h3 className="text-lg font-semibold text-yellow-800 mb-2">Admin Actions</h3>
                <p className="text-yellow-700">
                  As an admin, you can manage supplier accounts and view all supplier data.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </SupplierOrAdminRoute>
  );
}