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
} from "react-native";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { useAuth, User } from "@/context/AuthContext";

export default function Register({ navigation }: any) {
  const [name, setName] = useState("TestName");
  const [lastName, setLastName] = useState("TestLastName");
  const [email, setEmail] = useState("test@test.com");
  const [password, setPassword] = useState("123");
  const [gender, setGender] = useState("male");
  const [role, setRole] = useState("professor");
  const [age, setAge] = useState("25");
  const [image, setImage] = useState<ImagePicker.ImagePickerAsset | null>(null);

  const { register } = useAuth();

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
      const userData: Omit<User, "id" | "images"> & {
        password: string;
        image: ImagePicker.ImagePickerAsset | null;
      } = {
        age: parseInt(age),
        email,
        gender,
        last_name: lastName,
        name,
        password,
        role,
        image,
      };

      await register(userData);
      router.replace("/(tabs)");
    } catch (error) {
      Alert.alert(
        "Registration failed",
        "Please check your credentials and try again."
      );
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "position" : "height"}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
          {image ? (
            <Image source={{ uri: image.uri }} style={styles.image} />
          ) : (
            <Text style={styles.addImageText}>Tap to add image</Text>
          )}
        </TouchableOpacity>

        <Text>Register</Text>
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={setName}
          placeholderTextColor="#888"
        />
        <TextInput
          style={styles.input}
          placeholder="Last Name"
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
        <TextInput
          style={styles.input}
          placeholder="Gender"
          value={gender}
          onChangeText={setGender}
          placeholderTextColor="#888"
        />
        <TextInput
          style={styles.input}
          placeholder="Role"
          value={role}
          onChangeText={setRole}
          placeholderTextColor="#888"
        />
        <TextInput
          style={styles.input}
          placeholder="Age"
          value={age}
          onChangeText={setAge}
          keyboardType="numeric"
          placeholderTextColor="#888"
        />

        <Button title="Register" onPress={handleRegister} />
        <Button
          title="Already have an account? Sign in"
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
    color: "#000", // Text color
    backgroundColor: "#fff", // Background color
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
});
