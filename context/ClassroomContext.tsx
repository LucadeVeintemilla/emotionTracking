import React, { createContext, useState, useContext, ReactNode } from "react";
import { useAuth } from "./AuthContext";

export interface Classroom {
  id: string;
  name: string;
  professor_id: string;
  students: string[]; 
}

interface ClassroomContextType {
  classrooms: Classroom[];
  loadClassrooms: () => Promise<void>;
  addClassroom: (classroomData: {
    name: string;
    students: string[];
  }) => Promise<void>;
  removeClassroom: (classroomId: string) => Promise<void>;
  updateClassroom: (
    classroomId: string,
    updatedClassroom: Partial<Classroom>
  ) => Promise<void>;
  addStudentToClassroom: (
    classroomId: string,
    studentId: string
  ) => Promise<void>;
  removeStudentFromClassroom: (
    classroomId: string,
    studentId: string
  ) => Promise<void>;
}

const ClassroomContext = createContext<ClassroomContextType | undefined>(
  undefined
);

export const ClassroomProvider = ({ children }: { children: ReactNode }) => {
  const { token } = useAuth();
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);

  const loadClassrooms = async () => {
    try {
      console.log("Loading classrooms...");
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/classroom/get_classrooms`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const classroomsData = await response.json();
        console.log("Raw classrooms data:", classroomsData);
        
        const formattedClassrooms: Classroom[] = classroomsData.map((classroom: any) => ({
          id: classroom._id.toString(),
          name: classroom.name,
          professor_id: classroom.professor_id.toString(),
          students: classroom.students.map((id: any) => id.toString())
        }));

        console.log("Formatted classrooms:", formattedClassrooms);
        setClassrooms(formattedClassrooms);
      }
    } catch (error) {
      console.error("Error in loadClassrooms:", error);
    }
  };

  const addClassroom = async (classroomData: {
    name: string;
    students: string[];
  }) => {
    try {
      if (!token) {
        throw new Error("No authentication token found");
      }
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/classroom/create_classroom`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(classroomData),
        }
      );

      if (response.ok) {
        await loadClassrooms();
      }
    } catch (error) {
      console.error("Error in addClassroom:", error);
    }
  };

  const removeClassroom = async (classroomId: string) => {
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/classroom/${classroomId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setClassrooms((prevClassrooms) =>
          prevClassrooms.filter((classroom) => classroom.id !== classroomId)
        );
      } else {
        throw new Error("Failed to remove classroom");
      }
    } catch (error) {
      console.error("Error removing classroom:", error);
      throw error;
    }
  };

  const updateClassroom = async (
    classroomId: string,
    updatedClassroom: Partial<Classroom>
  ) => {
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/classroom/${classroomId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify(updatedClassroom),
        }
      );

      if (response.ok) {
        const responseData = await response.json();
        
        if (responseData && responseData._id) {
          const updatedData: Classroom = {
            id: responseData._id,
            name: responseData.name,
            professor_id: responseData.professor_id,
            students: Array.isArray(responseData.students) ? responseData.students : []
          };
          
          setClassrooms((prevClassrooms) =>
            prevClassrooms.map((classroom) =>
              classroom.id === classroomId ? updatedData : classroom
            )
          );
        } else {
          await loadClassrooms();
        }
      } else {
        throw new Error("Failed to update classroom");
      }
    } catch (error) {
      console.error("Error updating classroom:", error);
      throw error;
    }
  };

  const addStudentToClassroom = async (
    classroomId: string,
    studentId: string
  ) => {
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/classrooms/${classroomId}/students`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ studentId }),
        }
      );

      if (response.ok) {
        const updatedClassroom: Classroom = await response.json();
        setClassrooms((prevClassrooms) =>
          prevClassrooms.map((classroom) =>
            classroom.id === classroomId ? updatedClassroom : classroom
          )
        );
      } else {
        throw new Error("Failed to add student to classroom");
      }
    } catch (error) {
      console.error("Error adding student to classroom:", error);
    }
  };

  const removeStudentFromClassroom = async (
    classroomId: string,
    studentId: string
  ) => {
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/classrooms/${classroomId}/students/${studentId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const updatedClassroom: Classroom = await response.json();
        setClassrooms((prevClassrooms) =>
          prevClassrooms.map((classroom) =>
            classroom.id === classroomId ? updatedClassroom : classroom
          )
        );
      } else {
        throw new Error("Failed to remove student from classroom");
      }
    } catch (error) {
      console.error("Error removing student from classroom:", error);
    }
  };

  return (
    <ClassroomContext.Provider
      value={{
        classrooms,
        loadClassrooms,
        addClassroom,
        removeClassroom,
        updateClassroom,
        addStudentToClassroom,
        removeStudentFromClassroom,
      }}
    >
      {children}
    </ClassroomContext.Provider>
  );
};

export const useClassroom = () => {
  const context = useContext(ClassroomContext);
  if (!context) {
    throw new Error("useClassroom must be used within a ClassroomProvider");
  }
  return context;
};
