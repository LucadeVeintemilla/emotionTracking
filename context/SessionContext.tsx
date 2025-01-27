import React, { createContext, useState, useContext, ReactNode } from "react";
import { useAuth } from "./AuthContext";

export interface Session {
  id: string;
  name: string;
  professor_id: string;
  classroom_id: string;
}

interface SessionContextType {
  sessions: Session[];
  loadSessions: () => Promise<void>;
  addSession: (sessionData: {
    classroom_id: string;
    name: string;
  }) => Promise<void>;
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
          };

          return session;
        });

        setSessions(data);
      } else {
        throw new Error("Failed to fetch sessions");
      }
    } catch (error) {
      console.error("Error loading sessions:", error);
    }
  };

  const addSession = async (sessionData: {
    classroom_id: string;
    name: string;
  }) => {
    try {
      const sessionDataJson = JSON.stringify(sessionData);
      console.log("sessionDataJson", sessionDataJson);
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
      console.error("Error adding session:", error);
    }
  };

  return (
    <SessionContext.Provider
      value={{
        sessions,
        loadSessions,
        addSession,
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
