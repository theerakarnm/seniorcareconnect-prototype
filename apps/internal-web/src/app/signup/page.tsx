import { redirect } from "next/navigation";
import Link from "next/link";

import { Button } from "@acme/ui/button";
import { Input } from "@acme/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@acme/ui";
import { Label } from "@acme/ui";
import { RadioGroup, RadioGroupItem } from "@acme/ui";
import { Separator } from "@acme/ui";

import { getSession } from "~/auth/server";
import { auth } from "~/auth/server";

export default async function SignupPage() {
  const session = await getSession();

  // If user is already logged in, redirect to appropriate dashboard
  if (session?.user) {
    switch (session.user.role) {
      case "admin":
        redirect("/admin/dashboard");
        break;
      case "supplier":
        redirect("/supplier/dashboard");
        break;
      default:
        redirect("/dashboard");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Create Account</CardTitle>
          <CardDescription className="text-center">
            Enter your information to get started
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Enter your full name"
                required
              />
            </div>
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
                placeholder="Create a password"
                required
                minLength={8}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                required
                minLength={8}
              />
            </div>
            <div className="space-y-2">
              <Label>Account Type</Label>
              <RadioGroup name="role" defaultValue="customer" className="flex flex-col space-y-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="customer" id="customer" />
                  <Label htmlFor="customer">Customer - Book nursing homes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="supplier" id="supplier" />
                  <Label htmlFor="supplier">Supplier - List nursing homes</Label>
                </div>
              </RadioGroup>
            </div>
            <Button
              type="submit"
              className="w-full"
              formAction={async (formData: FormData) => {
                "use server";
                const name = formData.get("name") as string;
                const email = formData.get("email") as string;
                const password = formData.get("password") as string;
                const confirmPassword = formData.get("confirmPassword") as string;
                const role = formData.get("role") as string;

                // Validate passwords match
                if (password !== confirmPassword) {
                  redirect("/signup?error=Passwords do not match");
                }

                // Validate password length
                if (password.length < 8) {
                  redirect("/signup?error=Password must be at least 8 characters");
                }

                await auth.api.signUpEmail({
                  body: {
                    name,
                    email,
                    password,
                    role,
                  },
                });

                // Success - redirect to login with success message
                redirect("/login?message=Account created successfully");
              }}
            >
              Create Account
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
              Sign up with Discord
            </Button>
          </form>

          <div className="text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}