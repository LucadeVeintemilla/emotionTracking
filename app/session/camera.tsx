import { useSession } from "@/context/SessionContext";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import {
  Button,
  Modal,
  Text,
  View,
  StyleSheet,
  Image,
  Pressable,
  ScrollView,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from "react-native";
import * as ImageManipulator from "expo-image-manipulator";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Dropdown } from "react-native-element-dropdown";
import { AntDesign } from "@expo/vector-icons";
import { User } from "@/context/AuthContext";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import Slider from "@react-native-community/slider";

type Score = {
  student: User;
  score: string;
  timestamp: string;
};

const CameraModal = ({
  classroomStudents,
  showVideoModal,
  handleStopRecording,
  handleClose,
  handleStartRecording,
  isRecording,
  session_id,
}: {
  classroomStudents: User[];
  showVideoModal: boolean;
  handleStopRecording: () => void;
  handleClose: () => void;
  handleStartRecording: () => void;
  isRecording: boolean;
  session_id: string;
}) => {
  const { processFrame } = useSession();
  const [facing, setFacing] = useState<CameraType>("front");
  const [permission, requestPermission] = useCameraPermissions();
  const [currentPicture, setCurrentPicture] = useState<string | null>(null);
  const [cameraRef, setCameraRef] = useState<any>(null);

  const [score, setScore] = useState<string>("");
  const [scoresList, setScoresList] = useState<Score[]>([]);

  const [selectedStudent, setSelectedStudent] = useState<User | null>(null);

  const colorScheme = useColorScheme() ?? "light";

  const handleTakePicture = async () => {
    if (cameraRef) {
      const photo = await cameraRef.takePictureAsync();

      const manipulatedPhoto = await ImageManipulator.manipulateAsync(
        photo.uri,
        [{ rotate: 0 }],
        { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
      );

      const processedImageUrl = await processFrame({
        image_url: manipulatedPhoto.uri.replace("file://", ""),
        session_id,
      });
      if (processedImageUrl) setCurrentPicture(processedImageUrl);
    }
  };

  useEffect(() => {
    if (cameraRef && isRecording) {
      const interval = setInterval(() => {
        handleTakePicture();
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [cameraRef, session_id, isRecording]);

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  const handleSetScore = () => {
    if (selectedStudent && score) {
      setScoresList((prev) => [
        ...prev,
        {
          student: selectedStudent,
          score: score,
          timestamp: new Date().toISOString(),
        },
      ]);
      setSelectedStudent(null);
      setScore("");
    }
  };

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

  return (
    <Modal visible={showVideoModal} transparent={true}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.modalContainer}>
          <Pressable onPress={handleClose} style={styles.closeButton}>
            <IconSymbol
              size={45}
              name="xmark.square.fill"
              color={Colors[colorScheme].tabIconSelected}
            />
          </Pressable>
          <Pressable onPress={toggleCameraFacing} style={styles.flipButton}>
            <IconSymbol
              size={45}
              name="camera.rotate.fill"
              color={Colors[colorScheme].tabIconSelected}
            />
          </Pressable>
          <View style={styles.videoContainer}>
            <View style={styles.cameraContainer}>
              <CameraView
                ref={(ref) => setCameraRef(ref)}
                facing={facing}
                style={styles.camera}
              />
            </View>
            <View style={styles.pictureContainer}>
              <Image
                source={{ uri: currentPicture ?? "" }}
                style={styles.picture}
              />
            </View>
            <Pressable
              onPress={isRecording ? handleStopRecording : handleStartRecording}
            >
              <IconSymbol
                size={40}
                name={isRecording ? "stop" : "play"}
                color={isRecording ? "red" : "green"}
              />
            </Pressable>
            <View style={styles.setScoreContainer}>
              <Dropdown
                style={styles.dropdown}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={classroomStudents}
                search
                maxHeight={200}
                labelField="name"
                valueField="id"
                placeholder="Select item"
                searchPlaceholder="Search..."
                value={selectedStudent}
                onChange={(item) => {
                  setSelectedStudent(item);
                }}
                renderLeftIcon={() => (
                  <AntDesign
                    style={styles.icon}
                    color="black"
                    name="Safety"
                    size={20}
                  />
                )}
                dropdownPosition="top"
              />
              <View style={{ flex: 1, alignItems: "center" }}>
                <Text>Score: {score}</Text>
                <Slider
                  minimumValue={0}
                  maximumValue={5}
                  step={1}
                  value={Number(score)}
                  onValueChange={(value) => setScore(value.toString())}
                  minimumTrackTintColor="blue"
                  maximumTrackTintColor="gray"
                  thumbTintColor="blue"
                />
              </View>
              <Pressable onPress={handleSetScore}>
                <IconSymbol size={40} name="plus.app" color="green" />
              </Pressable>
            </View>
            <ScrollView style={styles.textListContainer}>
              {scoresList.map((item, i) => (
                <StudentCard score={item} key={i} />
              ))}
            </ScrollView>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  closeButton: {
    position: "absolute",
    top: 40,
    right: 12,
    zIndex: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  flipButton: {
    position: "absolute",
    top: 40,
    left: 12,
    zIndex: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  container: {
    flex: 1,
    padding: 10,
  },
  picture: {
    width: "100%",
    height: "100%",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  modalContainer: {
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  videoContainer: {
    marginTop: 20,
    width: "99.5%",
    height: "94%",
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  cameraContainer: {
    width: "100%",
    height: "30%",
    borderWidth: 1,
    borderColor: "gray",
    backgroundColor: "lightgray",
  },
  pictureContainer: {
    width: "100%",
    height: "30%",
    borderWidth: 1,
    borderColor: "gray",
    backgroundColor: "lightgray",
    marginTop: 2,
  },
  camera: {
    width: "100%",
    height: "100%",
  },
  setScoreContainer: {
    height: "auto",
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  textListContainer: {
    flex: 1,
    width: "100%",
    backgroundColor: "lightgray",
    paddingHorizontal: 10,
  },
  listItem: {
    fontSize: 16,
    color: "red",
    paddingVertical: 5,
  },
  input: {
    padding: 5,
    borderWidth: 1,
    borderColor: "gray",
    textAlign: "center",
  },
  dropdown: {
    width: "45%",
    borderBottomColor: "gray",
    borderBottomWidth: 0.5,
  },
  icon: {
    marginRight: 5,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 10,
  },
  containerText: {
    flex: 1,
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
  },
  studentName: {
    fontWeight: "bold",
    fontSize: 16,
    color: "black",
  },
  score: {
    fontWeight: "600",
    fontSize: 14,
    color: "green",
  },
  timestamp: {
    fontSize: 12,
    color: "gray",
  },
});

const StudentCard = ({ score }: { score: Score }) => {
  const getImageUrl = (path: string) => {
    return `${process.env.EXPO_PUBLIC_API_URL}/user/${path}`;
  };

  return (
    <TouchableOpacity
      style={{
        backgroundColor: "white",
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        padding: 4,
        borderRadius: 10,
        gap: 10,
        marginVertical: 5,
      }}
    >
      <Image
        source={{
          uri: score.student ? getImageUrl(score.student.images[0]) : "",
        }}
        style={styles.profileImage}
      />
      <View style={styles.containerText}>
        <ThemedText style={styles.studentName}>
          {score.student.name} {score.student.last_name}
        </ThemedText>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            width: "100%",
            justifyContent: "space-between",
          }}
        >
          <ThemedText style={styles.score}>Score: {score.score}</ThemedText>
          <ThemedText style={styles.timestamp}>
            {format(new Date(score.timestamp), "dd/MM/yyyy HH:mm:ss")}
          </ThemedText>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default CameraModal;
