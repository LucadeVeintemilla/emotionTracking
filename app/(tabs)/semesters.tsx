import React, { useEffect } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { Link } from "expo-router";
import { useSemester } from "@/context/SemesterContext";
import { useAuth } from "@/context/AuthContext";

const SemestersScreen = () => {
  const { loadSemesters, semesters } = useSemester();
  const { loadStudents } = useAuth();

  useEffect(() => {
    loadStudents();
    loadSemesters();
  }, []);

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 80 }}
      keyboardShouldPersistTaps="handled"
    >
      <View style={{ margin: 5 }}>
        <ThemedText>Semestres ({semesters.length})</ThemedText>
        {semesters.map((semester, index) => (
          <SemesterCard semester={semester} key={index} />
        ))}
      </View>
    </ScrollView>
  );
};

interface Semester {
  id: string;
  name: string;
  description: string;
}

const SemesterCard = ({ semester }: { semester: Semester }) => {
  return (
    <Link href={`/semester/${semester.id}`} style={{ margin: 5 }}>
      <ThemedView style={styles.card}>
        <View style={styles.row}>
          <View style={styles.containerText}>
            <ThemedText style={styles.semesterName}>{semester.name}</ThemedText>
            <ThemedText style={styles.description}>{semester.description}</ThemedText>
          </View>
        </View>
      </ThemedView>
    </Link>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 15,
    borderRadius: 10,
    marginVertical: 0.1,
    width: "100%",
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  containerText: {
    flex: 1,
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
  },
  semesterName: {
    fontSize: 18,
    fontWeight: "600",
    color: '#2c3e50',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#666',
  }
});

export default SemestersScreen;
