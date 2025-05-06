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
  Modal,
} from "react-native";
import { Picker } from '@react-native-picker/picker';
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { useAuth } from "@/context/AuthContext";

export default function Register({ navigation }: any) {
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("male");
  const [age, setAge] = useState("");
  const [image, setImage] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [role, setRole] = useState("professor");
  const [showGenderPicker, setShowGenderPicker] = useState(false);

  const { register } = useAuth();

  const openGenderPicker = () => {
    setShowGenderPicker(true);
  };

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted) {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setImage(result.assets[0]);
      }
    } else {
      alert("Permission to access the photo library is required!");
    }
  };

  const handleRegister = async () => {
    try {
      if (!name || !lastName || !email || !password || !gender || !age || !image) {
        Alert.alert("Error", "Por favor complete todos los campos");
        return;
      }

      const ageNum = parseInt(age);
      if (isNaN(ageNum)) {
        Alert.alert("Error", "La edad debe ser un número válido");
        return;
      }

      const formData = new FormData();
      formData.append("name", name);
      formData.append("last_name", lastName);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("gender", gender);
      formData.append("age", ageNum.toString());
      formData.append("role", role);

      if (image) {
        const imageFileName = `profile_${Date.now()}.${image.uri.split('.').pop()}`;
        formData.append("image", {
          uri: Platform.OS === 'ios' ? image.uri.replace('file://', '') : image.uri,
          type: 'image/jpeg',
          name: imageFileName,
        } as any);
      }

      console.log("Form data being sent:", Object.fromEntries(formData));

      try {
        await register(formData);
        router.replace("/(tabs)/profile");
      } catch (error: any) {
        console.error("Registration failed:", error.message);
        Alert.alert(
          "Error en el registro",
          "Error al conectar con el servidor. Por favor intente nuevamente."
        );
      }
    } catch (error) {
      console.error('Registration error:', error);
      Alert.alert(
        "Error en el registro",
        "Por favor verifique sus datos e intente nuevamente"
      );
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
          {image ? (
            <Image source={{ uri: image.uri }} style={styles.image} />
          ) : (
            <Text style={styles.addImageText}>Clic para añadir foto</Text>
          )}
        </TouchableOpacity>

        <Text>Register</Text>

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
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor="#888"
        />
        <TouchableOpacity 
          style={styles.input}
          onPress={openGenderPicker}
        >
          <Text style={[styles.inputText, !gender && styles.placeholder]}>
            {gender ? (gender === 'male' ? 'Masculino' : 'Femenino') : 'Género'}
          </Text>
        </TouchableOpacity>
        
        <Modal
          visible={showGenderPicker}
          transparent={true}
          animationType="slide"
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.pickerHeader}>
                <Button title="Cerrar" onPress={() => setShowGenderPicker(false)} />
              </View>
              <Picker
                selectedValue={gender}
                onValueChange={(itemValue) => {
                  setGender(itemValue);
                  setShowGenderPicker(false);
                }}
                style={styles.picker}
              >
                <Picker.Item label="Masculino" value="male" />
                <Picker.Item label="Femenino" value="female" />
              </Picker>
            </View>
          </View>
        </Modal>
        <TextInput
          style={styles.input}
          placeholder="Edad"
          value={age}
          onChangeText={setAge}
          keyboardType="numeric"
          placeholderTextColor="#888"
        />

        <Button title="Registrate" onPress={handleRegister} />
        <Button
          title="Ya tienes una cuenta? Inicia sesión"
          onPress={() => router.navigate("/login")}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
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
    justifyContent: 'center',
  },
  imageContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    overflow: "hidden",
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  addImageText: {
    color: "#555",
    fontSize: 14,
    textAlign: "center",
  },
  inputText: {
    color: '#000',
    fontSize: 16,
    padding: 0,
  },
  placeholder: {
    color: '#888',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
    height: '40%', 
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 15, 
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  picker: {
    height: 150,
    width: "100%",
  },
});
