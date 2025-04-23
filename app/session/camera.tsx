import { useSession } from "@/context/SessionContext";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { useState, useEffect } from "react";
import {
  Button,
  Modal,
  Text,
  View,
  StyleSheet,
  Image,
  Pressable,
  Keyboard,
  TouchableWithoutFeedback,
  Platform,
} from "react-native";
import * as ImageManipulator from "expo-image-manipulator";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Dropdown } from "react-native-element-dropdown";
import { User } from "@/context/AuthContext";

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
  const [imageLoadError, setImageLoadError] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<User | null>(null);

  const colorScheme = useColorScheme() ?? "light";

  const normalizeImagePath = (path: string) => {
    if (!path) return "";
    // Solución fue arreglar el path 
    return path.replace(/\\/g, '/').replace(/\/+/g, '/');
  };

  const formatImageUri = (uri: string) => {
    const normalizedUri = normalizeImagePath(uri);
    
    if (Platform.OS === "ios") {
      if (!normalizedUri.startsWith("file://") && !normalizedUri.startsWith("http")) {
        return "file://" + normalizedUri;
      }
    }
    return normalizedUri;
  };

  const handleTakePicture = async () => {
    if (!cameraRef || !selectedStudent?.id || !session_id) {
      return;
    }

    try {
      setImageLoadError(false);
      const photo = await cameraRef.takePictureAsync({
        quality: 0.7,
        base64: true,
        exif: false
      });

      const manipulatedPhoto = await ImageManipulator.manipulateAsync(
        photo.uri,
        [{ resize: { width: 640 } }],
        { 
          compress: 0.7, 
          format: ImageManipulator.SaveFormat.JPEG,
          base64: true 
        }
      );

      const formData = new FormData();
      formData.append('session_id', session_id);
      formData.append('student_id', selectedStudent.id);
      formData.append('image', {
        uri: manipulatedPhoto.uri,
        type: 'image/jpeg',
        name: 'camera_image.jpg',
      } as any);

      const processedImageUrl = await processFrame(formData);

      if (processedImageUrl) {
        setCurrentPicture(processedImageUrl);
        setImageLoadError(false);
      }

    } catch (error) {
      console.error("Error in handleTakePicture:", error);
      setImageLoadError(true);
    }
  };

  useEffect(() => {
    if (!cameraRef || !selectedStudent?.id || !session_id || !isRecording) {
      return;
    }

    const interval = setInterval(() => {
      handleTakePicture();
    }, 2000);
    return () => clearInterval(interval);
  }, [cameraRef, session_id, isRecording, selectedStudent]);

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
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
              {currentPicture && !imageLoadError ? (
                <Image
                  source={{ 
                    uri: currentPicture,
                    headers: { 
                      "Cache-Control": "no-cache",
                      "Pragma": "no-cache"
                    }
                  }}
                  style={styles.picture}
                  resizeMode="contain"
                  onError={(e) => {
                    console.error("Image loading error:", e.nativeEvent.error);
                    setImageLoadError(true);
                  }}
                />
              ) : (
                <View style={[styles.picture, { backgroundColor: "#eee", justifyContent: "center", alignItems: "center" }]}>
                  <Text>{imageLoadError ? "Error loading image" : "No image"}</Text>
                </View>
              )}
            </View>
            <View style={styles.scoreInputContainer}>
              <Dropdown
                style={styles.dropdown}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={classroomStudents.filter(student => student?.id)}
                search
                maxHeight={200}
                labelField="name"
                valueField="id"
                placeholder="Select student"
                searchPlaceholder="Search..."
                value={selectedStudent?.id || ""}
                onChange={(item) => {
                  if (!item?.id) return;
                  const student = classroomStudents.find(s => s?.id === item.id);
                  setSelectedStudent(student || null);
                  setCurrentPicture(null);
                  setImageLoadError(false);
                }}
              />
            </View>
            <View style={styles.controlsContainer}>
              <Pressable
                disabled={!selectedStudent}
                onPress={isRecording ? handleStopRecording : handleStartRecording}
              >
                <IconSymbol
                  size={40}
                  name={isRecording ? "stop" : "play"}
                  color={!selectedStudent ? "gray" : isRecording ? "red" : "green"}
                />
              </Pressable>
            </View>
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
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    marginTop: 80,
  },
  cameraContainer: {
    flex: 0.5,
    width: "100%",
    borderWidth: 1,
    borderColor: "gray",
    backgroundColor: "lightgray",
    marginBottom: 10,
    borderRadius: 8,
    overflow: "hidden",
  },
  pictureContainer: {
    flex: 0.5,
    width: "100%",
    borderWidth: 1,
    borderColor: "gray",
    marginBottom: 10,
    borderRadius: 8,
    overflow: "hidden",
  },
  camera: {
    width: "100%",
    height: "100%",
  },
  controlsContainer: {
    alignItems: "center",
    marginBottom: 10,
  },
  recordButton: {
    padding: 10,
  },
  scoreInputContainer: {
    width: "100%",
    padding: 5,
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
    marginBottom: 5,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  dropdown: {
    flex: 2,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 4,
    height: 40,
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
    fontSize: 16,
  },
});

export default CameraModal;