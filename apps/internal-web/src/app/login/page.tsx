import { redirect } from "next/navigation";
import Link from "next/link";

import { Button } from "@acme/ui/button";
import { Input } from "@acme/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@acme/ui";
import { Label } from "@acme/ui";
import { Separator } from "@acme/ui";

import { getSession } from "~/auth/server";
import { auth } from "~/auth/server";

export default async function LoginPage() {
  const session = await getSession();

  // If user is already logged in, redirect to appropriate dashboard
  if (session?.user) {
    switch (session.user.role) {
      case "admin":
        redirect("/admin/dashboard");
      case "supplier":
        redirect("/supplier/dashboard");
      default:
        redirect("/dashboard");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Sign In</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              formAction={async (formData: FormData) => {
                "use server";
                const email = formData.get("email") as string;
                const password = formData.get("password") as string;

                try {
                  const result = await auth.api.signInEmail({
                    body: { email, password, callbackURL: "/dashboard" },
                  });

                  console.log(result);
                  if (!result.url) {
                    // Success but no redirect URL - go to dashboard
                    redirect("/dashboard");
                  } else if (result.url) {
                    // Redirect to URL (likely for email verification)
                    redirect(result.url);
                  }
                } catch (error) {
                  console.error("Login error:", error);

                  // Handle specific database errors
                  if (error instanceof Error) {
                    if (error.message.includes("Failed query") || error.message.includes("insert into")) {
                      throw new Error("Failed to create session. Please try again.");
                    }
                    if (error.message.includes("duplicate key") || error.message.includes("unique constraint")) {
                      throw new Error("Session already exists. Please try logging out and logging in again.");
                    }
                    if (error.message.includes("connection") || error.message.includes("database")) {
                      throw new Error("Database connection error. Please try again later.");
                    }
                  }

                  throw error;
                }
              }}
            >
              Sign In
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <form>
            <Button
              variant="outline"
              className="w-full"
              formAction={async () => {
                "use server";
                const res = await auth.api.signInSocial({
                  body: {
                    provider: "discord",
                    callbackURL: "/dashboard",
                  },
                });
                if (!res.url) {
                  throw new Error("No URL returned from signInSocial");
                }
                redirect(res.url);
              }}
            >
              Sign in with Discord
            </Button>
          </form>

          <div className="text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-primary hover:underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}