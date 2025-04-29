import { type PropsWithChildren } from "react";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useColorScheme } from "@/hooks/useColorScheme";
import { AuthProvider } from "./context/AuthContext";
import { ClassroomProvider } from "./context/ClassroomContext";
import { SessionProvider } from "./context/SessionContext";
import { SemesterProvider } from "./context/SemesterContext";

export const RootProvider = ({ children }: PropsWithChildren) => {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <SemesterProvider>
          <ClassroomProvider>
            <SessionProvider>{children}</SessionProvider>
          </ClassroomProvider>
        </SemesterProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};
