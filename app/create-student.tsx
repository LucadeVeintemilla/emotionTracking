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
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { useAuth, User } from "@/context/AuthContext";

export default function CreateStudentScreen() {
  const [name, setName] = useState("S1");
  const [lastName, setLastName] = useState("S1");
  const [email, setEmail] = useState("s1@test.com");
  const [gender, setGender] = useState("male");
  const [age, setAge] = useState("20");
  const [images, setImages] = useState<(ImagePicker.ImagePickerAsset | null)[]>(
    [null, null, null]
  );

  const { register, loadStudents } = useAuth();

  const pickImage = async (index: number) => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permission to access the photo library is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const newImages = [...images];
      newImages[index] = result.assets[0];
      setImages(newImages);
    }
  };

  const handleCreateStudent = async () => {
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
        images: images.filter(
          (img) => img !== null
        ) as ImagePicker.ImagePickerAsset[],
      };

      await register(userData);
      await loadStudents();
      router.replace("/(tabs)/students");
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
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={{ flexDirection: "row", marginVertical: 10 }}>
          {images.map((image, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => pickImage(index)}
              style={styles.imageContainer}
            >
              {image ? (
                <Image source={{ uri: image.uri }} style={styles.image} />
              ) : (
                <Text style={styles.addImageText}>Tap to add image</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

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
          placeholder="Gender"
          value={gender}
          onChangeText={setGender}
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

        <Button title="Create New Student" onPress={handleCreateStudent} />
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
  imageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: "hidden",
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
    margin: 5,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  addImageText: {
    color: "#555",
    fontSize: 12,
    textAlign: "center",
  },
});
