import React, { useEffect } from "react";
import { Image, ScrollView, StyleSheet, View } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { Link } from "expo-router";
import { Classroom, useClassroom } from "@/context/ClassroomContext";
import { useAuth } from "@/context/AuthContext";

const ClassroomsScreen = () => {
  const { loadClassrooms, classrooms } = useClassroom();
  const { loadStudents } = useAuth();

  useEffect(() => {
    loadStudents();
    loadClassrooms();
  }, []);

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 80 }}
    keyboardShouldPersistTaps="handled"
  >
      <View style={{ margin: 5 }}>
        <ThemedText>Classrooms</ThemedText>
        {classrooms.map((classroom, index) => (
          <ClassroomCard classroom={classroom} key={index} />
        ))}
      </View>
    </ScrollView>
  );
};

const ClassroomCard = ({ classroom }: { classroom: Classroom }) => {
  return (
    <Link href={`/classroom/${classroom.id}`} style={{ margin: 5 }}>
      <ThemedView style={styles.card}>
        <View style={styles.row}>
          <View style={styles.containerText}>
            <ThemedText style={styles.classroomName}>{classroom.name}</ThemedText>
          </View>
        </View>
      </ThemedView>
    </Link>
  );
};

export default ClassroomsScreen;

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
  classroomName: {
    fontSize: 18,
    fontWeight: "600",
  },
});
