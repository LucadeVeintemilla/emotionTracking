import React, { createContext, useState, useContext, ReactNode } from "react";
import { useAuth } from "./AuthContext";
import * as ImagePicker from "expo-image-picker";

export interface Session {
  id: string;
  name: string;
  professor_id: string;
  classroom_id: string;
  created_at: string;
  student_scores: any[];
  student_emotions: any[];
}

interface SessionContextType {
  sessions: Session[];
  loadSessions: () => Promise<void>;
  addSession: (sessionData: {
    classroom_id: string;
    name: string;
  }) => Promise<void>;
  processFrame: ({
    image_url,
    session_id,
  }: {
    image_url: string;
    session_id: string;
  }) => any;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider = ({ children }: { children: ReactNode }) => {
  const { token } = useAuth();
  const [sessions, setSessions] = useState<Session[]>([]);

  const loadSessions = async () => {
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/session/get_sessions`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const sessionsData: any[] = await response.json();
        const data: Session[] = sessionsData.map((sessionData: any) => {
          const session: Session = {
            id: sessionData["_id"],
            name: sessionData["name"],
            professor_id: sessionData["professor_id"],
            classroom_id: sessionData["classroom_id"],
            created_at: sessionData["created_at"],
            student_scores: sessionData["student_scores"],
            student_emotions: sessionData["student_emotions"],
          };

          return session;
        });

        setSessions(data);
      } else {
        throw new Error("Failed to fetch sessions");
      }
    } catch (error) {
      console.log("Error loading sessions:", error);
    }
  };

  const addSession = async (sessionData: {
    classroom_id: string;
    name: string;
  }) => {
    try {
      const sessionDataJson = JSON.stringify(sessionData);
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/session/create_session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: sessionDataJson,
        }
      );

      if (response.ok) {
        const createdSession: Session = await response.json();
        setSessions((prevSessions) => [...prevSessions, createdSession]);
      } else {
        throw new Error("Failed to add session");
      }
    } catch (error) {
      console.log("Error adding session:", error);
    }
  };

  const processFrame = async ({
    image_url,
    session_id,
  }: {
    image_url: string;
    session_id: string;
  }) => {
    try {
      const formData = new FormData();
      formData.append("session_id", session_id);
      formData.append("detector_backend", "mtcnn");
      formData.append("image", {
        uri: image_url,
        type: "image/jpeg",
        name: "image_to_process",
      } as any);

      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/emotion/process_frame`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        // throw new Error("Failed to process frame");
        console.log("Failed to process frame");
      }

      const result = await response.json();

      // Verificar si la respuesta contiene una imagen procesada
      if (result.processed_image) {
        // Convertir la imagen base64 en una URL para mostrarla
        const processedImageUrl = `data:image/jpeg;base64,${result.processed_image}`;
        return processedImageUrl;
      } else {
        throw new Error("Processed image not found in response");
      }
    } catch (error) {
      console.log("Error processing frame:", error);
      throw error;
    }
  };

  return (
    <SessionContext.Provider
      value={{
        sessions,
        loadSessions,
        addSession,
        processFrame,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
};
