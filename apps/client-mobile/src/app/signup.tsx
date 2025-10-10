import { useState } from "react";
import { Button, Pressable, Text, TextInput, View, Alert, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useRouter } from "expo-router";

import { authClient } from "~/utils/auth";

export default function SignupScreen() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState<"customer" | "supplier">("customer");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    if (password.length < 8) {
      Alert.alert("Error", "Password must be at least 8 characters");
      return;
    }

    setIsLoading(true);
    try {
      const result = await authClient.signUp.email({
        name,
        email,
        password,
        // Role will be set based on selection during signup
        // This might need custom implementation depending on Better Auth's capabilities
      });

      if (result.error) {
        Alert.alert("Error", result.error.message || "Signup failed");
      } else {
        Alert.alert(
          "Success",
          "Account created! Please check your email to verify your account.",
          [{ text: "OK", onPress: () => router.replace("/login") }]
        );
      }
    } catch (error) {
      Alert.alert("Error", "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignUp = async (provider: "discord") => {
    try {
      await authClient.signIn.social({
        provider,
        callbackURL: "/",
        // This will create an account if it doesn't exist
      });
    } catch (error) {
      Alert.alert("Error", "Social signup failed");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <Stack.Screen options={{ title: "Sign Up" }} />

      <ScrollView className="flex-1 p-4">
        <View className="flex-1 justify-center py-8">
          <Text className="mb-8 text-center text-3xl font-bold text-foreground">
            Create Account
          </Text>

          <View className="mb-6 space-y-4">
            <TextInput
              className="rounded-md border border-input bg-background px-4 py-3 text-foreground"
              placeholder="Full Name"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              autoComplete="name"
            />

            <TextInput
              className="rounded-md border border-input bg-background px-4 py-3 text-foreground"
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />

            <TextInput
              className="rounded-md border border-input bg-background px-4 py-3 text-foreground"
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoComplete="password-new"
            />

            <TextInput
              className="rounded-md border border-input bg-background px-4 py-3 text-foreground"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              autoComplete="password-new"
            />

            <View className="space-y-2">
              <Text className="text-lg font-semibold text-foreground">Account Type</Text>
              <View className="flex-row space-x-4">
                <Pressable
                  onPress={() => setSelectedRole("customer")}
                  className={`flex-1 rounded-md border p-3 ${
                    selectedRole === "customer"
                      ? "border-primary bg-primary/10"
                      : "border-input bg-background"
                  }`}
                >
                  <Text
                    className={`text-center font-semibold ${
                      selectedRole === "customer" ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    Customer
                  </Text>
                  <Text className="mt-1 text-center text-sm text-muted-foreground">
                    Book nursing homes
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() => setSelectedRole("supplier")}
                  className={`flex-1 rounded-md border p-3 ${
                    selectedRole === "supplier"
                      ? "border-primary bg-primary/10"
                      : "border-input bg-background"
                  }`}
                >
                  <Text
                    className={`text-center font-semibold ${
                      selectedRole === "supplier" ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    Supplier
                  </Text>
                  <Text className="mt-1 text-center text-sm text-muted-foreground">
                    List nursing homes
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>

          <Button
            onPress={handleSignUp}
            title={isLoading ? "Creating Account..." : "Create Account"}
            disabled={isLoading}
            color="#5B65E9"
          />

          <View className="my-6 items-center">
            <Text className="text-muted-foreground">Or sign up with</Text>
          </View>

          <Button
            onPress={() => handleSocialSignUp("discord")}
            title="Sign Up with Discord"
            color="#5865F2"
          />

          <View className="mt-8 flex-row justify-center">
            <Text className="text-muted-foreground">Already have an account? </Text>
            <Pressable onPress={() => router.push("/login")}>
              <Text className="text-primary font-semibold">Sign In</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}