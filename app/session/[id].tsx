import React, { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, View } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useAuth, User } from "@/context/AuthContext";
import { useLocalSearchParams } from "expo-router";
import { Classroom, useClassroom } from "@/context/ClassroomContext";
import { Link } from "expo-router";
import { StudentCard } from "../(tabs)/students";
import { Session, useSession } from "@/context/SessionContext";

const SessionDetailScreen = () => {
  const { students, user } = useAuth();
  const { sessions } = useSession();
  const { classrooms } = useClassroom();

  const { id } = useLocalSearchParams<{ id: string }>();

  const [session, setSession] = useState<Session | null>(null);
  const [sessionClassroom, setSessionClassroom] = useState<Classroom | null>(
    null
  );
  const [classroomStudents, setClassroomStudents] = useState<User[]>([]);

  useEffect(() => {
    if (id && sessions) {
      const foundSession = sessions.find((session) => session.id === id);
      setSession(foundSession || null);

      if (foundSession) {
        const foundClassroom = classrooms.find(
          (classroom) => classroom.id === foundSession.classroom_id
        );
        setSessionClassroom(foundClassroom || null);
        const filteredStudents = students.filter((student) =>
          foundClassroom!.students.includes(student.id)
        );
        setClassroomStudents(filteredStudents);
      }
    }
  }, [id, sessions, classrooms, students]);

  if (!session) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Session not found</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.sessionName}>{session.name}</ThemedText>

      <ThemedText style={styles.teacherName}>
        Professor: {user!.name} {user!.last_name}
      </ThemedText>

      <ThemedText style={styles.teacherName}>
        Classroom: {sessionClassroom!.name}
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
  sessionName: {
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

export default SessionDetailScreen;
