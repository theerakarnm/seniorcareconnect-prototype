import Link from "next/link";

import { Button } from "@acme/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@acme/ui";

import { getSession } from "~/auth/server";

export default async function UnauthorizedPage() {
  const session = await getSession();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-red-600">Access Denied</CardTitle>
          <CardDescription>
            You don&apos;t have permission to access this page.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {session ? (
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                You are logged in as <span className="font-semibold">{session.user.name}</span> with role{" "}
                <span className="font-semibold">{session.user.role}</span>
              </p>
              <p className="text-sm text-muted-foreground">
                This page requires different permissions. Please contact an administrator if you believe this is an error.
              </p>
            </div>
          ) : (
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                You need to be logged in to access this page.
              </p>
            </div>
          )}

          <div className="flex flex-col gap-2">
            {session ? (
              <>
                <Button asChild className="w-full">
                  <Link href="/dashboard">Go to Dashboard</Link>
                </Button>
                <Button variant="outline" asChild className="w-full">
                  <Link href="/">Go Home</Link>
                </Button>
              </>
            ) : (
              <>
                <Button asChild className="w-full">
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button variant="outline" asChild className="w-full">
                  <Link href="/">Go Home</Link>
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}