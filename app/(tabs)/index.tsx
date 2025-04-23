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
    <View style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 80 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ margin: 5 }}>
          <ThemedText>Sessions</ThemedText>
          {sessions.map((session, index) => (
            <SessionCard session={session} key={index} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const SessionCard = ({ session }: { session: Session }) => {
  const formattedDate = new Date(session.created_at).toLocaleDateString();

  return (
    <Link href={`/session/${session.id}`} style={{ margin: 5 }}>
      <ThemedView style={styles.card}>
        <View style={styles.row}>
          <View style={styles.containerText}>
            <ThemedText style={styles.sessionName}>{session.name}</ThemedText>
            <ThemedText style={styles.date}>{formattedDate}</ThemedText>
          </View>
        </View>
      </ThemedView>
    </Link>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  card: {
    padding: 15,
    borderRadius: 10,
    marginVertical: 5,
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
  sessionName: {
    fontSize: 18,
    fontWeight: "600",
  },
  date: {
    fontSize: 14,
    opacity: 0.7,
  },
});
