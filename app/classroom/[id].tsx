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
      <View style={styles.headerCard}>
        <ThemedText style={styles.classroomName}>{classroom.name}</ThemedText>
        <View style={styles.teacherContainer}>
          <ThemedText style={styles.teacherLabel}>Docente</ThemedText>
          <ThemedText style={styles.teacherName}>
            {user!.name} {user!.last_name}
          </ThemedText>
        </View>
      </View>

      <ThemedText style={styles.studentsTitle}>Estudiantes</ThemedText>
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
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  headerCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  classroomName: {
    fontSize: 25,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: 'center',
    color: '#2c3e50',
  },
  teacherContainer: {
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  teacherLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  teacherName: {
    fontSize: 20,
    fontWeight: "600",
    color: '#2c3e50',
  },
  studentsTitle: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 16,
    color: '#2c3e50',
    paddingHorizontal: 4,
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
