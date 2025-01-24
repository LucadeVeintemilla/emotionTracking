import React, { createContext, useState, useContext, ReactNode } from "react";
import { useAuth } from "./AuthContext";

export interface Classroom {
  id: string;
  name: string;
  professor_id: string;
  students: string[]; // Array of student IDs
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
        const classroomsData: Classroom[] = await response.json();
        const data: Classroom[] = classroomsData.map((classroomData: any) => {
          const classroom: Classroom = {
            id: classroomData._id,
            name: classroomData.name,
            professor_id: classroomData.professor_id,
            students: classroomData.students,
          };

          return classroom;
        });

        setClassrooms(data);
      } else {
        throw new Error("Failed to fetch classrooms");
      }
    } catch (error) {
      console.error("Error loading classrooms:", error);
    }
  };

  const addClassroom = async (classroomData: {
    name: string;
    students: string[];
  }) => {
    try {
      const classroomDataJson = JSON.stringify(classroomData);
      console.log("classroomDataJson", classroomDataJson);
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/classroom/create_classroom`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: classroomDataJson,
        }
      );

      if (response.ok) {
        const createdClassroom: Classroom = await response.json();
        setClassrooms((prevClassrooms) => [
          ...prevClassrooms,
          createdClassroom,
        ]);
      } else {
        throw new Error("Failed to add classroom");
      }
    } catch (error) {
      console.error("Error adding classroom:", error);
    }
  };

  const removeClassroom = async (classroomId: string) => {
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/classrooms/${classroomId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
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
    }
  };

  const updateClassroom = async (
    classroomId: string,
    updatedClassroom: Partial<Classroom>
  ) => {
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/classrooms/${classroomId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedClassroom),
        }
      );

      if (response.ok) {
        const updatedData: Classroom = await response.json();
        setClassrooms((prevClassrooms) =>
          prevClassrooms.map((classroom) =>
            classroom.id === classroomId ? updatedData : classroom
          )
        );
      } else {
        throw new Error("Failed to update classroom");
      }
    } catch (error) {
      console.error("Error updating classroom:", error);
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
