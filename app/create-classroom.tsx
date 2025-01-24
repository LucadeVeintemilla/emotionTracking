import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  TextInput,
  Button,
  KeyboardAvoidingView,
  Platform,
  View,
  Image,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useAuth, User } from "@/context/AuthContext";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useClassroom } from "@/context/ClassroomContext";
import { router } from "expo-router";

const getImageUrl = (path: string) => {
  return `${process.env.EXPO_PUBLIC_API_URL}/user/${path}`;
};

const CreateClassroomScreen = () => {
  const { students, loadStudents } = useAuth();
  const { addClassroom } = useClassroom();
  const [name, setName] = useState("");
  const [selectedStudents, setSelectedStudents] = useState<User[]>([]);

  useEffect(() => {
    loadStudents();
  }, []);

  const toggleSelectStudent = (student: User) => {
    const isSelected = selectedStudents.some((s) => s.id === student.id);
    if (isSelected) {
      setSelectedStudents((prev) => prev.filter((s) => s.id !== student.id));
    } else {
      setSelectedStudents((prev) => [...prev, student]);
    }
  };

  const handleCreateClassroom = () => {
    if (!name || selectedStudents.length === 0) {
      alert("Please fill all fields");
      return;
    }

    const classroomData = {
      name,
      students: selectedStudents.map((student) => student.id),
    };

    try {
      addClassroom(classroomData);
      router.replace("/classrom");
    } catch (error) {
      console.error("Error creating classroom:", error);
    }
  };

  const renderStudentItem = ({ item }: { item: User }) => {
    const isSelected = selectedStudents.some((s) => s.id === item.id);

    return (
      <TouchableOpacity
        style={[styles.item, isSelected && styles.selectedItem]}
        onPress={() => toggleSelectStudent(item)}
      >
        <Image
          source={{ uri: getImageUrl(item.images[0]) }}
          style={styles.avatar}
        />
        <View style={styles.textContainer}>
          <ThemedText>{item.name}</ThemedText>
          <ThemedText>{item.email}</ThemedText>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ThemedView style={styles.container}>
        <ThemedText style={styles.label}>Enter Classroom Name:</ThemedText>
        <TextInput
          style={styles.input}
          placeholder="Classroom Name"
          value={name}
          onChangeText={setName}
          placeholderTextColor="#888"
        />

        <ThemedText style={styles.label}>Select Students:</ThemedText>
        <View
          style={{
            width: "100%",
            height: 500,
          }}
        >
          <FlatList
            style={{
              width: "100%",
            }}
            data={students}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderStudentItem}
            contentContainerStyle={styles.list}
          />
        </View>

        <Button title="Create Classroom" onPress={handleCreateClassroom} />
      </ThemedView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 20,
  },
  label: {
    alignSelf: "flex-start",
    marginBottom: 5,
    fontSize: 16,
    fontWeight: "bold",
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
  list: {
    width: "100%",
    height: 200,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 10,
  },
  selectedItem: {
    borderColor: "#80c0a0",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  textContainer: {
    flexDirection: "column",
  },
});

export default CreateClassroomScreen;
