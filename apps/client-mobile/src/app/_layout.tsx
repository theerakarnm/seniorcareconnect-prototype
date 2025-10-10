import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { QueryClientProvider } from "@tanstack/react-query";
import { useColorScheme } from "nativewind";
import { useEffect } from "react";

import { queryClient } from "~/utils/api";
import { useConsent } from "~/hooks/useConsent";
import { PDPAConsentModal } from "~/components/ui";

import "../styles.css";

// App wrapper to handle consent
function AppWrapper({ children }: { children: React.ReactNode }) {
  const {
    isModalVisible,
    hideModal,
    acceptConsent,
    declineConsent,
    isLoading,
  } = useConsent();

  // Prevent app from being usable while consent is loading
  if (isLoading) {
    return null;
  }

  return (
    <>
      {children}
      <PDPAConsentModal
        visible={isModalVisible}
        onAccept={(preferences) => acceptConsent(preferences)}
        onDecline={declineConsent}
      />
    </>
  );
}

// This is the main layout of the app
// It wraps your pages with the providers they need
export default function RootLayout() {
  const { colorScheme } = useColorScheme();

  return (
    <QueryClientProvider client={queryClient}>
      <AppWrapper>
        {/*
            The Stack component displays the current page.
            It also allows you to configure your screens
          */}
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: colorScheme === "dark" ? "#09090B" : "#FFFFFF",
            },
            headerTintColor: colorScheme === "dark" ? "#FFFFFF" : "#000000",
            contentStyle: {
              backgroundColor: colorScheme === "dark" ? "#09090B" : "#FFFFFF",
            },
          }}
          linking={{
            prefixes: ['seniorcareconnect://', 'https://seniorcareconnect.com'],
            config: {
              screens: {
                '(tabs)': {
                  screens: {
                    home: '',
                    search: 'search',
                    'my-bookings': 'bookings',
                    profile: 'profile',
                  },
                },
                details: 'details/:id',
                booking: 'booking/:id?',
                listing: 'listing',
              },
            },
          }}
        />
        <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
      </AppWrapper>
    </QueryClientProvider>
  );
}
