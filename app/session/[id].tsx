import React, { useEffect, useState } from "react";
import {
  Button,
  ScrollView,
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useAuth, User } from "@/context/AuthContext";
import { useLocalSearchParams } from "expo-router";
import { Classroom, useClassroom } from "@/context/ClassroomContext";
import { StudentCard } from "../(tabs)/students";
import { Session, useSession } from "@/context/SessionContext";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";

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
    setShowVideoModal(true);
    // Aquí puedes agregar la lógica para iniciar la grabación en tiempo real.
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    setShowVideoModal(false);
    // Aquí puedes agregar la lógica para detener la grabación y guardar el video.
  };

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

      <View style={styles.buttonContainer}>
        {!isRecording ? (
          <Button title="Start Recording" onPress={handleStartRecording} />
        ) : (
          <></>
        )}
      </View>

      <CameraModal
        showVideoModal={showVideoModal}
        handleStopRecording={handleStopRecording}
      />
    </ThemedView>
  );
};

const CameraModal = ({
  showVideoModal,
  handleStopRecording,
}: {
  showVideoModal: boolean;
  handleStopRecording: () => void;
}) => {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  return (
    <Modal visible={showVideoModal} transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.videoContainer}>
          <CameraView style={styles.camera} facing={facing} />
        </View>
        <Button title="Flip Camera" onPress={toggleCameraFacing} />
        <Button title="Stop Recording" onPress={handleStopRecording} />
      </View>
    </Modal>
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
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  videoContainer: {
    width: "100%",
    height: "50%",
    backgroundColor: "white",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  videoText: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    width: "100%",
    height: "100%",
  },
  button: {
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
});

export default SessionDetailScreen;
