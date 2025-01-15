import { type PropsWithChildren } from "react";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useColorScheme } from "@/hooks/useColorScheme";
import { AuthProvider } from "./context/AuthContext";

export const RootProvider = ({ children }: PropsWithChildren) => {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <AuthProvider>{children}</AuthProvider>
    </ThemeProvider>
  );
};
