import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
import { RootProvider } from "@/RootProvider";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <RootProvider>
      <RootLayoutNav />
      <StatusBar style="auto" />
    </RootProvider>
  );
}

function RootLayoutNav() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" />
      <Stack.Screen
        name="login"
        options={{
          title: "Sign In",
          headerShown: true,
          presentation: "card",
        }}
      />
      <Stack.Screen
        name="register"
        options={{
          title: "Sign Up",
          headerShown: true,
          presentation: "card",
        }}
      />
      <Stack.Screen
        name="create-classroom"
        options={{
          title: "Create Classroom",
          headerShown: true,
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="create-session"
        options={{
          title: "Create Session",
          headerShown: true,
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="create-student"
        options={{
          title: "Create Student",
          headerShown: true,
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="student/[id]"
        options={{
          title: "student",
          headerShown: true,
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="classroom/[id]"
        options={{
          title: "classroom",
          headerShown: true,
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="session/[id]"
        options={{
          title: "session",
          headerShown: true,
          presentation: "card",
        }}
      />
    </Stack>
  );
}
