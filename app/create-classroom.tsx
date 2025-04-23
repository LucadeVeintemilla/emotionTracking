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
import { IconSymbol } from "@/components/ui/IconSymbol";

const getImageUrl = (path: string) => {
  return `${process.env.EXPO_PUBLIC_API_URL}/user/${path}`;
};

const CreateClassroomScreen = () => {
  const { students, loadStudents } = useAuth();
  const { addClassroom } = useClassroom();
  const [name, setName] = useState("");
  const [selectedStudents, setSelectedStudents] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!students || students.length === 0) {
      const loadData = async () => {
        try {
          await loadStudents();
        } catch (error) {
          console.error("Error loading students:", error);
        }
      };
      loadData();
    }
  }, []);
  

  const toggleSelectStudent = (student: User) => {
    if (!student || !student.id) {
      return;
    }

    setSelectedStudents((prev) => {
      const isSelected = prev.some((s) => s.id === student.id);
      if (isSelected) {
        return prev.filter((s) => s.id !== student.id);
      } else {
        return [...prev, student];
      }
    });
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
    if (!item || !item.id) {
      return null;
    }

    const isSelected = selectedStudents.some((s) => s.id === item.id);

    return (
      <TouchableOpacity
        style={[styles.item, isSelected && styles.selectedItem]}
        onPress={() => toggleSelectStudent(item)}
        activeOpacity={0.7}
      >
        <View style={styles.checkboxContainer}>
          <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
            {isSelected && <IconSymbol name="checkmark" size={16} color="white" />}
          </View>
        </View>
        <Image
          source={{ uri: getImageUrl(item.images[0]) }}
          style={styles.avatar}
        />
        <View style={styles.textContainer}>
          <ThemedText style={styles.studentName}>{item.name}</ThemedText>
          <ThemedText style={styles.studentEmail}>{item.email}</ThemedText>
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
        <View style={styles.listContainer}>
          <FlatList
            data={students || []}
            keyExtractor={(item) => item?.id?.toString() || Math.random().toString()}
            renderItem={renderStudentItem}
            contentContainerStyle={styles.list}
          />
        </View>

        <View style={styles.buttonContainer}>
          <Button title="Create Classroom" onPress={handleCreateClassroom} />
        </View>
      </ThemedView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 20,
    paddingBottom: 80,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: "white",
  },
  listContainer: {
    width: "100%",
    height: "70%", 
    marginBottom: 20,
  },
  list: {
    paddingVertical: 8,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    marginVertical: 4,
    marginHorizontal: 8,
    borderRadius: 12,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  selectedItem: {
    backgroundColor: "#f0f9ff",
  },
  checkboxContainer: {
    marginRight: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxSelected: {
    backgroundColor: "#2196F3",
    borderColor: "#2196F3",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
  },
  studentName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  studentEmail: {
    fontSize: 14,
    color: "#666",
  },
  buttonContainer: {
    width: "100%",
    paddingVertical: 10,
    backgroundColor: "transparent",
    marginTop: "auto", 
  },
});

export default CreateClassroomScreen;
