import React, { useEffect } from "react";
import { Image, ScrollView, StyleSheet, View } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { Link } from "expo-router";
import { Classroom, useClassroom } from "@/context/ClassroomContext";
import { useAuth } from "@/context/AuthContext";
import { Session, useSession } from "@/context/SessionContext";

const HomeScreen = () => {
  const { loadSessions, sessions } = useSession();
  const { loadStudents } = useAuth();
  const { loadClassrooms } = useClassroom();

  useEffect(() => {
    loadSessions();
    loadStudents();
    loadClassrooms();
  }, []);

  return (
    <ScrollView>
      <View style={{ margin: 5 }}>
        <ThemedText>Sessions</ThemedText>
        {sessions.map((session, index) => (
          <SessionCard session={session} key={index} />
        ))}
      </View>
    </ScrollView>
  );
};

const SessionCard = ({ session }: { session: Session }) => {
  return (
    <Link href={`/session/${session.id}`} style={{ margin: 5 }}>
      <ThemedView style={styles.container}>
        <View style={styles.containerText}>
          <ThemedText>{session.name}</ThemedText>
        </View>
      </ThemedView>
      //{" "}
    </Link>
  );
};

export default HomeScreen;

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
