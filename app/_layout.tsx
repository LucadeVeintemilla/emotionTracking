import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
import { RootProvider } from "@/RootProvider";
import { Pressable, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/Colors";
import { Ionicons } from '@expo/vector-icons';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      setTimeout(() => {
        SplashScreen.hideAsync();
      }, 2000); 
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
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors[colorScheme].header,
        },
        headerTintColor: '#fff',
        contentStyle: {
          backgroundColor: Colors[colorScheme].appBackground,
        },
        headerBackTitle: '',
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" />
      <Stack.Screen
        name="(semester)/[id]"
        options={{
          title: "Semestre",
          headerShown: true,
          presentation: "card",
          headerBackTitle: " ",
        }}
      />
      <Stack.Screen
        name="login"
        options={{
          title: "Iniciar Sesión",
          headerShown: true,
          presentation: "card",
          headerBackTitle: " ",
        }}
      />
      <Stack.Screen
        name="register"
        options={{
          title: "Registrarse",
          headerShown: true,
          presentation: "card",
          headerBackTitle: " ",
        }}
      />
      <Stack.Screen
        name="create-classroom"
        options={{
          title: "Crear Materia",
          headerShown: true,
          presentation: "modal",
          headerBackTitle: " ",
        }}
      />
      <Stack.Screen
        name="create-session"
        options={{
          title: "Crear Clase",
          headerShown: true,
          presentation: "modal",
          headerBackTitle: " ",
        }}
      />
      <Stack.Screen
        name="create-student"
        options={{
          title: "Crear Estudiante",
          headerShown: true,
          presentation: "modal",
          headerBackTitle: " ",
        }}
      />
      <Stack.Screen
        name="student/[id]"
        options={{
          title: "Estudiante",
          headerShown: true,
          presentation: "modal",
          headerBackTitle: " ",
        }}
      />
      <Stack.Screen
        name="classroom/[id]"
        options={{
          title: "Materia",
          headerShown: true,
          presentation: "modal",
          headerBackTitle: " ",
        }}
      />
      <Stack.Screen
        name="session/[id]"
        options={{
          title: "Sesión",
          headerShown: true,
          presentation: "card",
          headerBackTitle: "",
          headerLeft: (props) => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={{ marginLeft: 10 }}
            >
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="session/stats/[id]"
        options={{
          title: "Estadísticas de Emociones",
          headerShown: true,
          presentation: "modal",
          headerBackTitle: " ",
        }}
      />
      <Stack.Screen
        name="semester/[id]"
        options={{
          title: "Semestre",
          headerShown: true,
          presentation: "card",
          headerBackTitle: "",
          headerLeft: (props) => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={{ marginLeft: 10 }}
            >
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="create-semester"
        options={{
          title: "Crear Semestre",
          headerShown: true,
          presentation: "modal",
          headerBackTitle: " ",
        }}
      />
    </Stack>
  );
}
