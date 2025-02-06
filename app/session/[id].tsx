import React, { useEffect, useState } from "react";
import { Button, ScrollView, StyleSheet, View } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useAuth, User } from "@/context/AuthContext";
import { useLocalSearchParams } from "expo-router";
import { Classroom, useClassroom } from "@/context/ClassroomContext";
import { StudentCard } from "../(tabs)/students";
import { Session, useSession } from "@/context/SessionContext";
import CameraModal from "./camera";

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
  const [isRecording, setIsRecording] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);

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

  const handleStartRecording = () => {
    setIsRecording(true);
  };

  const handleOpen = () => {
    setShowVideoModal(true);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
  };

  const handleClose = () => {
    setIsRecording(false);
    setShowVideoModal(false);
  };

  if (!session) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Session not found</ThemedText>
      </ThemedView>
    );
  }

  const formattedDate = new Date(session.created_at).toLocaleDateString();

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.sessionName}>{session.name}</ThemedText>
      <ThemedText style={{ marginBottom: 20 }}>{formattedDate}</ThemedText>
      <ThemedText style={styles.teacherName}>
        Professor: {user!.name} {user!.last_name}
      </ThemedText>

      <ThemedText style={styles.teacherName}>
        Classroom: {sessionClassroom!.name}
      </ThemedText>

      <ThemedText style={styles.teacherName}>Students:</ThemedText>

      <ScrollView>
        {classroomStudents.map((student, index) => (
          <View key={`session-student-${student.id}`}>
            <StudentCard student={student} key={index} />
            {index != classroomStudents.length - 1 && (
              <View
                style={{
                  width: "80%",
                  height: 1,
                  backgroundColor: "white",
                  alignSelf: "center",
                }}
              />
            )}
          </View>
        ))}
      </ScrollView>

      <View style={styles.buttonContainer}>
        {!isRecording ? (
          <Button title="Start Recording" onPress={handleOpen} />
        ) : (
          <></>
        )}
      </View>

      <CameraModal
        session_id={session.id}
        classroomStudents={classroomStudents}
        showVideoModal={showVideoModal}
        handleStopRecording={handleStopRecording}
        handleClose={handleClose}
        handleStartRecording={handleStartRecording}
        isRecording={isRecording}
      />
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
  buttonContainer: {
    marginBottom: 40,
    alignItems: "center",
  },
});

export default SessionDetailScreen;
