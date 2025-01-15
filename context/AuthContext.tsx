import React, { createContext, useState, useContext, ReactNode } from "react";
import * as ImagePicker from "expo-image-picker";
import { Platform } from "react-native";

export interface User {
  id: string;
  name: string;
  last_name: string;
  age: number;
  gender: string;
  email: string;
  role: string;
  images: string[];
}

interface AuthContextType {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    userData: Omit<User, "id" | "images"> & {
      password: string;
      image: ImagePicker.ImagePickerAsset | null;
    }
  ) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);

      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/user/login`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        const data = await response.json();
        setToken(data.token);

        const userResponse = await fetch(
          `${process.env.EXPO_PUBLIC_API_URL}/user/me`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${data.token}`,
            },
          }
        );

        if (userResponse.ok) {
          const userData = await userResponse.json();
          setUser({
            id: userData._id,
            name: userData.name,
            last_name: userData.last_name,
            age: parseInt(userData.age, 10),
            gender: userData.gender,
            email: userData.email,
            role: userData.role,
            images: userData.images,
          });
        } else {
          throw new Error("Failed to fetch user data");
        }
      } else {
        throw new Error("Login failed");
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const register = async (
    userData: Omit<User, "id" | "images"> & {
      password: string;
      image: ImagePicker.ImagePickerAsset | null;
    }
  ) => {
    try {
      const formData = new FormData();
      formData.append("name", userData.name);
      formData.append("last_name", userData.last_name);
      formData.append("age", userData.age.toString());
      formData.append("gender", userData.gender);
      formData.append("email", userData.email);
      formData.append("role", userData.role);
      formData.append("password", userData.password);

      if (userData.image) {
        formData.append("images", {
          uri:
            Platform.OS === "ios"
              ? userData.image.uri.replace("file://", "")
              : userData.image.uri,
          type: userData.image.type,
          name: "profile_picture",
        });
      }

      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/user/register`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        const data = await response.json();
        setToken(data.token);

        const userResponse = await fetch(
          `${process.env.EXPO_PUBLIC_API_URL}/user/me`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${data.token}`,
            },
          }
        );

        if (userResponse.ok) {
          const user = await userResponse.json();
          setUser({
            id: user._id,
            name: user.name,
            last_name: user.last_name,
            age: parseInt(user.age, 10),
            gender: user.gender,
            email: user.email,
            role: user.role,
            images: user.images,
          });
        } else {
          throw new Error("Failed to fetch user data");
        }
      } else {
        throw new Error("Registration failed");
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated: !!token,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
