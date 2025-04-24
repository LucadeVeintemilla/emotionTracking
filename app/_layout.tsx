import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
import { RootProvider } from "@/RootProvider";
import { Pressable } from "react-native";
import { router } from "expo-router";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/Colors";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
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
  const colorScheme = useColorScheme() ?? "light";

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" />
      <Stack.Screen
        name="login"
        options={{
          title: "Iniciar Sesión",
          headerShown: true,
          presentation: "card",
        }}
      />
      <Stack.Screen
        name="register"
        options={{
          title: "Registrarse",
          headerShown: true,
          presentation: "card",
        }}
      />
      <Stack.Screen
        name="create-classroom"
        options={{
          title: "Crear Clase",
          headerShown: true,
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="create-session"
        options={{
          title: "Crear Sesión",
          headerShown: true,
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="create-student"
        options={{
          title: "Crear Estudiante",
          headerShown: true,
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="student/[id]"
        options={{
          title: "Estudiante",
          headerShown: true,
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="classroom/[id]"
        options={{
          title: "Clase",
          headerShown: true,
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="session/[id]"
        options={{
          title: "Sesión",
          headerShown: true,
          presentation: "card",
        }}
      />
      <Stack.Screen
        name="session/stats/[id]"
        options={{
          title: "Estadísticas de Emociones",
          headerShown: true,
          presentation: "modal",
        }}
      />
    </Stack>
  );
}
