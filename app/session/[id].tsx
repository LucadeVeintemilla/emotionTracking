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
import { useRouter } from "expo-router";

const SessionDetailScreen = () => {
  const { students, user } = useAuth();
  const { sessions, getSessionStats } = useSession();
  const { classrooms } = useClassroom();
  const router = useRouter();

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

  const handleViewStatistics = async () => {
    if (!session) return;
    try {
      const stats = await getSessionStats(session.id);
      const emotion_types = ['happy', 'sad', 'angry', 'surprised', 'neutral'];
      const table = stats.map(stat => {
        const row: Record<string, any> = {
          student: students.find(s => s.id === stat.student_id)?.name ?? stat.student_id,
        };
        for (const emotion of emotion_types) {
          row[emotion] = stat.after[emotion] || 0;
        }
        return row;
      });
      console.log("Tabla de emociones AFTER por estudiante:");
      console.table(table);
    } catch (e) {
      console.error("Error fetching stats for table:", e);
    }
    router.push(`/session/stats/${session.id}`);
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
      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 140 }]}
      >
        <ThemedText style={styles.sessionName}>{session.name}</ThemedText>
        <ThemedText style={{ marginBottom: 20 }}>{formattedDate}</ThemedText>
        <ThemedText style={styles.teacherName}>
          Professor: {user!.name} {user!.last_name}
        </ThemedText>

        <ThemedText style={styles.teacherName}>
          Classroom: {sessionClassroom!.name}
        </ThemedText>

        <ThemedText style={styles.teacherName}>Students:</ThemedText>

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

      {!isRecording && (
        <View style={styles.footer}>
          <Button title="Start Recording" onPress={handleOpen} color="#0a7ea4" />
          <View style={styles.buttonSpacerVertical} />
          <Button 
            title="View Statistics" 
            onPress={handleViewStatistics}
            color="#0a7ea4"
          />
        </View>
      )}

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
    backgroundColor: "white", // Asegura fondo opaco
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 10,
    paddingBottom: 120, // Asegura espacio para los botones
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
    padding: 20,
    backgroundColor: 'transparent',
    width: '100%',
    position: 'absolute',
    bottom: 0,
  },
  footer: {
    width: '100%',
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    elevation: 10, // Para que esté por encima del tab bar en Android
    shadowColor: "#000", // Para iOS
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    position: 'absolute', 
    bottom: 150,           
    left: 0, 
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  buttonSpacer: {
    width: 20,
  },
  buttonSpacerVertical: {
    height: 12,
  },
});

export default SessionDetailScreen;
