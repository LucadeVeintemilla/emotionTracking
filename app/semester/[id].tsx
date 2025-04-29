import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useAuth, User } from "@/context/AuthContext";
import { useLocalSearchParams } from "expo-router";
import { Semester, useSemester } from "@/context/SemesterContext";
import { StudentCard } from "../(tabs)/students";

const SemesterDetailScreen = () => {
  const { students, user } = useAuth();
  const { semesters } = useSemester();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [semester, setSemester] = useState<Semester | null>(null);
  const [semesterStudents, setSemesterStudents] = useState<User[]>([]);

  useEffect(() => {
    if (id && semesters) {
      const foundSemester = semesters.find((semester) => semester.id === id);
      setSemester(foundSemester || null);

      if (foundSemester) {
        const filteredStudents = students.filter((student) =>
          foundSemester.students.includes(student.id)
        );
        setSemesterStudents(filteredStudents);
      }
    }
  }, [id, semesters, students]);

  if (!semester) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Semester not found</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <View style={styles.headerCard}>
        <ThemedText style={styles.semesterName}>{semester.name}</ThemedText>
        <View style={styles.descriptionContainer}>
          <ThemedText style={styles.descriptionLabel}>Descripción</ThemedText>
          <ThemedText style={styles.description}>{semester.description}</ThemedText>
        </View>
      </View>

      <ThemedText style={styles.studentsTitle}>Estudiantes</ThemedText>
      <ScrollView>
        {semesterStudents.map((student) => (
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
  semesterName: {
    fontSize: 25,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: 'center',
    color: '#2c3e50',
  },
  descriptionContainer: {
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  descriptionLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  description: {
    fontSize: 16,
    color: '#2c3e50',
    textAlign: 'center',
  },
  studentsTitle: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 16,
    color: '#2c3e50',
    paddingHorizontal: 4,
  }
});

export default SemesterDetailScreen;
