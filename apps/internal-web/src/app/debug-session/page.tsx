import { getSession } from "~/auth/server";
import { authClient } from "~/auth/client";

export default async function DebugSessionPage() {
  // Server-side session
  const serverSession = await getSession();

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Session Debug Information</h1>

      <div className="space-y-6">
        <div className="bg-gray-100 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Server-Side Session</h2>
          {serverSession ? (
            <div className="space-y-2">
              <p><strong>User ID:</strong> {serverSession.user?.id}</p>
              <p><strong>Name:</strong> {serverSession.user?.name}</p>
              <p><strong>Email:</strong> {serverSession.user?.email}</p>
              <p><strong>Role:</strong> {serverSession.user?.role}</p>
              <p><strong>Email Verified:</strong> {serverSession.user?.emailVerified ? 'Yes' : 'No'}</p>
              <p><strong>Session ID:</strong> {serverSession.session?.id}</p>
              <p><strong>Expires At:</strong> {serverSession.session?.expiresAt?.toISOString()}</p>
            </div>
          ) : (
            <p className="text-red-600">No server session found</p>
          )}
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Cookie Information</h2>
          <p className="text-sm text-gray-600">
            Check browser developer tools → Application → Cookies to see if authentication cookies are set.
          </p>
          <p className="text-sm mt-2">
            Look for cookies named: <code className="bg-gray-200 px-2 py-1">better-auth.session_token</code>
          </p>
        </div>

        <div className="bg-yellow-50 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Next Steps</h2>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>If no server session: Check if cookies are being set in browser</li>
            <li>If cookies exist but no session: Check cookie domain/path settings</li>
            <li>If session exists but no role: Check database query in auth/server.ts</li>
          </ul>
        </div>
      </div>
    </div>
  );
}