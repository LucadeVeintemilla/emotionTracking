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
  updateSemester: (semesterId: string, semesterData: { name: string; description: string }) => Promise<void>;
  deleteSemester: (semesterId: string) => Promise<void>;
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
        `${process.env.EXPO_PUBLIC_API_URL}/semester/all`,
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
        `${process.env.EXPO_PUBLIC_API_URL}/semester/create`,
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
        await loadSemesters();
      } else {
        const errorText = await response.text();
        console.error("Failed to create semester:", response.status, errorText);
      }
    } catch (error) {
      console.error("Error in addSemester:", error);
      throw error;
    }
  };

  const updateSemester = async (semesterId: string, semesterData: { name: string; description: string }) => {
    if (!token) {
      console.error("No token available");
      return;
    }

    try {
      console.log("Updating semester:", semesterId, semesterData);
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/semester/${semesterId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify(semesterData),
        }
      );

      if (response.ok) {
        console.log("Semester updated successfully");
        // Update local state
        setSemesters(prevSemesters => 
          prevSemesters.map(semester => 
            semester.id === semesterId 
              ? { ...semester, ...semesterData } 
              : semester
          )
        );
      } else {
        const errorText = await response.text();
        console.error("Failed to update semester:", response.status, errorText);
        throw new Error(errorText || "Failed to update semester");
      }
    } catch (error) {
      console.error("Error in updateSemester:", error);
      throw error;
    }
  };

  const deleteSemester = async (semesterId: string) => {
    if (!token) {
      console.error("No token available");
      return;
    }

    try {
      console.log("Deleting semester:", semesterId);
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/semester/${semesterId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        console.log("Semester deleted successfully");
        // Update local state
        setSemesters(prevSemesters => 
          prevSemesters.filter(semester => semester.id !== semesterId)
        );
      } else {
        const errorText = await response.text();
        console.error("Failed to delete semester:", response.status, errorText);
        throw new Error(errorText || "Failed to delete semester");
      }
    } catch (error) {
      console.error("Error in deleteSemester:", error);
      throw error;
    }
  };

  return (
    <SemesterContext.Provider
      value={{
        semesters,
        loadSemesters,
        addSemester,
        updateSemester,
        deleteSemester,
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
