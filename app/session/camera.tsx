import { useSession } from "@/context/SessionContext";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { useState, useEffect } from "react";
import { Button, Modal, Text, View, StyleSheet, Image } from "react-native";
import * as ImageManipulator from "expo-image-manipulator";

const CameraModal = ({
  showVideoModal,
  handleStopRecording,
  session_id,
}: {
  showVideoModal: boolean;
  handleStopRecording: () => void;
  session_id: string;
}) => {
  const { processFrame } = useSession();
  const [facing, setFacing] = useState<CameraType>("front");
  const [permission, requestPermission] = useCameraPermissions();
  const [currentPicture, setCurrentPicture] = useState<string | null>(null);
  const [cameraRef, setCameraRef] = useState<any>(null);

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

    // useEffect(() => {
    //   const interval = setInterval(() => {
    //     handleTakePicture();
    //   }, 500);
    //   return () => clearInterval(interval);
    // }, []);

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

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
      <View style={styles.modalContainer}>
        <View style={styles.videoContainer}>
          <View style={styles.cameraContainer}>
            <CameraView
              ref={(ref) => setCameraRef(ref)}
              facing={facing}
              style={styles.picture}
            />
          </View>
          <View
            style={{
              paddingVertical: 4,
            }}
          />
          <View style={styles.pictureContainer}>
            <Image
              source={{ uri: currentPicture ?? "" }}
              style={styles.picture}
            />
          </View>
        </View>
        <Button title="Flip Camera" onPress={toggleCameraFacing} />
        <Button title="Stop Recording" onPress={handleStopRecording} />
        <Button title="Take Picture" onPress={handleTakePicture} />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  videoContainer: {
    width: "100%",
    height: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  pictureContainer: {
    width: "100%",
    height: "55%",
    borderWidth: 1,
    borderColor: "gray",
    backgroundColor: "lightgray",
  },
  cameraContainer: {
    width: "100%",
    height: "50%",
    borderWidth: 1,
    borderColor: "gray",
    backgroundColor: "lightgray",
  },
  picture: {
    width: "100%",
    height: "100%",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
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

export default CameraModal;
