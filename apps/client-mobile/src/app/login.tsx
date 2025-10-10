import { useState } from "react";
import { Button, Pressable, Text, TextInput, View, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useRouter } from "expo-router";

import { authClient } from "~/utils/auth";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      const result = await authClient.signIn.email({
        email,
        password,
        callbackURL: "/",
      });

      if (result.error) {
        Alert.alert("Error", result.error.message || "Login failed");
      } else {
        router.replace("/");
      }
    } catch (error) {
      Alert.alert("Error", "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignIn = async (provider: "discord") => {
    try {
      await authClient.signIn.social({
        provider,
        callbackURL: "/",
      });
    } catch (error) {
      Alert.alert("Error", "Social login failed");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background p-4">
      <Stack.Screen options={{ title: "Login" }} />

      <View className="flex-1 justify-center">
        <Text className="mb-8 text-center text-3xl font-bold text-foreground">
          Welcome Back
        </Text>

        <View className="mb-6 space-y-4">
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
            autoComplete="password"
          />
        </View>

        <Button
          onPress={handleSignIn}
          title={isLoading ? "Signing In..." : "Sign In"}
          disabled={isLoading}
          color="#5B65E9"
        />

        <View className="my-6 items-center">
          <Text className="text-muted-foreground">Or continue with</Text>
        </View>

        <Button
          onPress={() => handleSocialSignIn("discord")}
          title="Sign In with Discord"
          color="#5865F2"
        />

        <View className="mt-8 flex-row justify-center">
          <Text className="text-muted-foreground">Don't have an account? </Text>
          <Pressable onPress={() => router.push("/signup")}>
            <Text className="text-primary font-semibold">Sign Up</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}