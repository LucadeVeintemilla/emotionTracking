import React, { useState } from "react";
import {
  Text,
  TextInput,
  Button,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  View,
} from "react-native";
import { Picker } from '@react-native-picker/picker';
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { useAuth, User } from "@/context/AuthContext";
import { IconSymbol } from "@/components/ui/IconSymbol";

export default function CreateStudentScreen() {
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("male");
  const [age, setAge] = useState("");
  const [image, setImage] = useState<ImagePicker.ImagePickerAsset | null>(null);

  const { register, loadStudents } = useAuth();

  const pickImageFromGallery = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permiso requerido", "Necesitamos permiso para acceder a tu galería");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permiso requerido", "Necesitamos permiso para acceder a tu cámara");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  const handleCreateStudent = async () => {
    if (!image) {
      Alert.alert("Error", "Por favor, agrega una foto del estudiante");
      return;
    }

    try {
      const userData: Omit<User, "id" | "images"> & {
        password: string;
        images: ImagePicker.ImagePickerAsset[];
      } = {
        age: parseInt(age),
        email,
        gender,
        last_name: lastName,
        name,
        password: "",
        role: "student",
        images: [image],
      };

      await register(userData);
      await loadStudents();
      router.replace("/(tabs)/students");
    } catch (error) {
      Alert.alert(
        "Error en el registro",
        "Por favor verifica los datos e intenta nuevamente"
      );
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.imageSection}>
          <TouchableOpacity
            style={styles.imageContainer}
            onPress={() => {
              Alert.alert(
                "Seleccionar foto",
                "¿Cómo deseas agregar la foto?",
                [
                  {
                    text: "Tomar foto",
                    onPress: takePhoto
                  },
                  {
                    text: "Elegir de galería",
                    onPress: pickImageFromGallery
                  },
                  {
                    text: "Cancelar",
                    style: "cancel"
                  }
                ]
              );
            }}
          >
            {image ? (
              <Image source={{ uri: image.uri }} style={styles.image} />
            ) : (
              <View style={styles.placeholderContainer}>
                <IconSymbol name="camera.rotate.fill" size={40} color="#666" />
                <Text style={styles.addImageText}>Agregar foto</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Nombre"
          value={name}
          onChangeText={setName}
          placeholderTextColor="#888"
        />
        <TextInput
          style={styles.input}
          placeholder="Apellido"
          value={lastName}
          onChangeText={setLastName}
          placeholderTextColor="#888"
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          placeholderTextColor="#888"
        />
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={gender}
            placeholder="Género"
            onValueChange={(itemValue) => setGender(itemValue)}
            style={styles.picker}
            dropdownIconColor="#888"
          >
            <Picker.Item 
              label="Masculino" 
              value="male"
              color="#000"  
            />
            <Picker.Item 
              label="Femenino" 
              value="female" 
              color="#000"
            />
          </Picker>
        </View>
        <TextInput
          style={styles.input}
          placeholder="Edad"
          value={age}
          onChangeText={setAge}
          keyboardType="numeric"
          placeholderTextColor="#888"
        />

        <Button title="Crear nuevo estudiante" onPress={handleCreateStudent} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 12,
    paddingLeft: 8,
    width: "100%",
    color: "#000",
    backgroundColor: "#fff",
  },
  imageSection: {
    alignItems: 'center',
    marginVertical: 20,
  },
  imageContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "#f0f0f0",
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  placeholderContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  addImageText: {
    marginTop: 8,
    color: "#666",
    fontSize: 14,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: "#fff",
    width: "100%",
    justifyContent: 'center',
  },
  picker: {
    height: 50,
    width: "100%",
    color: "#000",
  },
});
