import React, { createContext, useState, useContext } from "react";
import { useAuth } from "./AuthContext";

export interface Semester {
  id: string;
  name: string;
  description: string;
  created_at: string;
  students: string[];
  is_active: boolean;
}

interface SemesterContextType {
  semesters: Semester[];
  loadSemesters: () => Promise<void>;
  addSemester: (semesterData: { name: string; description: string }) => Promise<void>;
}

const SemesterContext = createContext<SemesterContextType | undefined>(undefined);

export const SemesterProvider = ({ children }: { children: React.ReactNode }) => {
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const { token } = useAuth();

  const loadSemesters = async () => {
    if (!token) return;

    try {
      console.log("Loading semesters...");
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/semester/all`, // Updated endpoint
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const semestersData = await response.json();
        console.log("Raw semesters data:", semestersData);

        const formattedSemesters: Semester[] = semestersData.map((semester: any) => ({
          id: semester._id.toString(),
          name: semester.name,
          description: semester.description || "",
          created_at: semester.created_at,
          students: semester.students?.map((id: any) => id.toString()) || [],
          is_active: semester.is_active ?? true
        }));

        console.log("Formatted semesters:", formattedSemesters);
        setSemesters(formattedSemesters);
      } else {
        const errorData = await response.text();
        console.error("Failed to fetch semesters:", response.status, errorData);
      }
    } catch (error) {
      console.error("Error in loadSemesters:", error);
    }
  };

  const addSemester = async (semesterData: { name: string; description: string }) => {
    if (!token) {
      console.error("No token available");
      return;
    }

    try {
      console.log("Creating semester:", semesterData);
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/semester/create`, // Updated endpoint
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify(semesterData),
        }
      );

      if (response.ok) {
        console.log("Semester created successfully");
        await loadSemesters(); // Reload semesters after adding
      } else {
        const errorText = await response.text();
        console.error("Failed to create semester:", response.status, errorText);
      }
    } catch (error) {
      console.error("Error in addSemester:", error);
      throw error;
    }
  };

  return (
    <SemesterContext.Provider
      value={{
        semesters,
        loadSemesters,
        addSemester,
      }}
    >
      {children}
    </SemesterContext.Provider>
  );
};

export const useSemester = () => {
  const context = useContext(SemesterContext);
  if (!context) {
    throw new Error("useSemester must be used within a SemesterProvider");
  }
  return context;
};
