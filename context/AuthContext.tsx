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
  register: (
    userData: Omit<User, "id" | "images"> & {
      password: string;
      images: ImagePicker.ImagePickerAsset[];
    }
  ) => Promise<void>;
  logout: () => void;
  students: User[];
  loadStudents: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const [students, setStudents] = useState<User[]>([]);

  const loadStudents = async (): Promise<void> => {
    try {
      if (!token) {
        throw new Error("No authentication token found");
      }

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

      if (response.ok) {
        const rawData = await response.json();
        const formattedStudents: User[] = rawData.map((student: any) => ({
          id: student._id,
          name: student.name,
          last_name: student.last_name,
          age: parseInt(student.age),
          gender: student.gender,
          email: student.email,
          role: student.role,
          images: student.images,
        }));
        setStudents(formattedStudents);
      } else {
        console.error("Failed to load students:", response.status);
      }
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

  const register = async (
    userData: Omit<User, "id" | "images"> & {
      password: string;
      images: ImagePicker.ImagePickerAsset[];
    }
  ): Promise<void> => {
    try {
      const formData = new FormData();
      formData.append("name", userData.name);
      formData.append("last_name", userData.last_name);
      formData.append("age", userData.age.toString());
      formData.append("gender", userData.gender);
      formData.append("email", userData.email);
      formData.append("role", userData.role);

      if (userData.role === "professor") {
        formData.append("password", userData.password);
        if (userData.images.length === 1) {
          const image = userData.images[0];
          formData.append("image", {
            uri: image.uri.replace("file://", ""),
            type: image.mimeType || "image/jpeg",
            name: "profile_picture.jpg"
          } as any);
        }
      } else {
        // Para estudiantes, adjuntar múltiples imágenes
        userData.images.forEach((image, index) => {
          formData.append(`image_${index}`, {
            uri: image.uri.replace("file://", ""),
            type: image.mimeType || "image/jpeg",
            name: `student_image_${index}.jpg`
          } as any);
        });
      }

      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/user/register`,
        {
          method: "POST",
          body: formData,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.ok) {
        const data = await response.json();

        const userResponse = await fetch(
          `${process.env.EXPO_PUBLIC_API_URL}/user/me`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${data.token}`,
            },
          }
        );

        if (userData.role === "professor") {
          setToken(data.token);

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
        } else if (userData.role === "student") {
          await loadStudents();
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
