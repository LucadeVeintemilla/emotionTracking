import React, { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, View } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useAuth, User } from "@/context/AuthContext";
import { useLocalSearchParams } from "expo-router";
import { Classroom, useClassroom } from "@/context/ClassroomContext";
import { Link } from "expo-router";
import { StudentCard } from "../(tabs)/students";

const ClassroomDetailScreen = () => {
  const { students, user } = useAuth();
  const { classrooms } = useClassroom();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [classroom, setClassroom] = useState<Classroom | null>(null);
  const [classroomStudents, setClassroomStudents] = useState<User[]>([]);

  useEffect(() => {
    if (id && classrooms) {
      const foundClassroom = classrooms.find(
        (classroom) => classroom.id === id
      );
      setClassroom(foundClassroom || null);

      if (foundClassroom) {
        const filteredStudents = students.filter((student) =>
          foundClassroom.students.includes(student.id)
        );
        setClassroomStudents(filteredStudents);
      }
    }
  }, [id, classrooms, students]);

  if (!classroom) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Classroom not found</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.classroomName}>{classroom.name}</ThemedText>

      <ThemedText style={styles.teacherName}>
        Professor: {user!.name} {user!.last_name}
      </ThemedText>

      <ThemedText style={styles.teacherName}>Students:</ThemedText>
      <ScrollView>
        {classroomStudents.map((student) => (
          <StudentCard student={student} key={student.id} />
        ))}
      </ScrollView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  classroomName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  teacherName: {
    fontSize: 18,
    marginBottom: 20,
  },
  studentCard: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
    borderRadius: 10,
    marginBottom: 10,
  },
  containerText: {
    flex: 1,
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
  },
  containerImages: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "center",
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 50,
    marginLeft: -15,
  },
});

export default ClassroomDetailScreen;
