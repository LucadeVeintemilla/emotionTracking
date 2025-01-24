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
    <ScrollView>
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
      <ThemedView style={styles.container}>
        <View style={styles.containerText}>
          <ThemedText>{classroom.name}</ThemedText>
        </View>
      </ThemedView>
      //{" "}
    </Link>
  );
};

export default ClassroomsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
    borderRadius: 10,
  },
  containerText: {
    flex: 1,
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
  },
});
