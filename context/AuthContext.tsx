import React, { createContext, useState, useContext, ReactNode } from "react";
import * as ImagePicker from "expo-image-picker";

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
  register: (formData: FormData) => Promise<void>;
  logout: () => void;
  students: User[];
  loadStudents: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const [students, setStudents] = useState<User[]>([]);

  const getImageUrl = (path: string) => {
    if (!path) return "";
    const normalizedPath = path.replace(/\\/g, '/');
    return `${process.env.EXPO_PUBLIC_API_URL}/user/${normalizedPath}`;
  };

  const loadStudents = async (): Promise<void> => {
    try {
      if (!user || !token) return;

      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/user/students`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        console.error("Failed to load students:", response.status);
        return;
      }

      const rawData = await response.json();
      const formattedStudents: User[] = rawData.map((student: any) => ({
        id: student._id,
        name: student.name,
        last_name: student.last_name,
        age: parseInt(student.age),
        gender: student.gender,
        email: student.email,
        role: student.role,
        images: student.images.map((img: string) => img.replace(/\\/g, '/')),
      }));
      
      setStudents(formattedStudents);
    } catch (error) {
      console.error("Error in loadStudents:", error);
    }
  };

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

  const register = async (formData: FormData): Promise<void> => {
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/student/register`, // Changed from auth/register
        {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Registration failed");
      }

      // Load students after successful registration
      await loadStudents();
      
    } catch (error) {
      console.error("Register error:", error);
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
        students,
        loadStudents,
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
