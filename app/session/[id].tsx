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
        contentContainerStyle={[styles.scrollContent]}
      >
        <View style={styles.headerCard}>
          <ThemedText style={styles.sessionName}>{session.name}</ThemedText>
          <ThemedText style={styles.dateText}>{formattedDate}</ThemedText>
          <View style={styles.teacherContainer}>
            <ThemedText style={styles.teacherLabel}>Docente</ThemedText>
            <ThemedText style={styles.teacherName}>
              {user!.name} {user!.last_name}
            </ThemedText>
          </View>
          <View style={styles.classContainer}>
            <ThemedText style={styles.classLabel}>Materia</ThemedText>
            <ThemedText style={styles.className}>
              {sessionClassroom!.name}
            </ThemedText>
          </View>
        </View>

        <ThemedText style={styles.studentsTitle}>Estudiantes</ThemedText>
        {classroomStudents.map((student, index) => (
          <View key={`session-student-${student.id}`}>
            <StudentCard student={student} key={index} />
            {index !== classroomStudents.length - 1 && (
              <View style={styles.separator} />
            )}
          </View>
        ))}
      </ScrollView>

      {!isRecording && (
        <View style={styles.footer}>
          <Button title="Empezar Grabación" onPress={handleOpen} color="#0a7ea4" />
          <View style={styles.buttonSpacerVertical} />
          <Button 
            title="Ver Estadísticas" 
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
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 140,
  },
  headerCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 40,
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
  sessionName: {
    fontSize: 25,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: 'center',
    color: '#2c3e50',
  },
  dateText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  teacherContainer: {
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    marginBottom: 16,
  },
  teacherLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  teacherName: {
    fontSize: 15,
    fontWeight: "600",
    color: '#2c3e50',
  },
  classContainer: {
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  classLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  className: {
    fontSize: 15,
    fontWeight: "600",
    color: '#2c3e50',
  },
  studentsTitle: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 20,
    color: '#2c3e50',
    paddingHorizontal: 4,
  },
  separator: {
    width: "90%",
    height: 1,
    backgroundColor: "#eee",
    alignSelf: "center",
    marginVertical: 8,
  },
  footer: {
    width: '100%',
    backgroundColor: 'white',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    position: 'absolute',
    bottom: 10,
    left: 0,
    zIndex: 1000,
  },
  buttonSpacerVertical: {
    height: 10
  },
});

export default SessionDetailScreen;
