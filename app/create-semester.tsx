import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  TextInput,
  Button,
  KeyboardAvoidingView,
  Platform,
  View,
  Alert,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { router } from "expo-router";
import { useAuth, User } from "@/context/AuthContext";
import { IconSymbol } from "@/components/ui/IconSymbol";

const CreateSemesterScreen = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedStudents, setSelectedStudents] = useState<User[]>([]);
  const { students, loadStudents } = useAuth();

  useEffect(() => {
    loadStudents();
  }, []);

  const toggleSelectStudent = (student: User) => {
    setSelectedStudents((prev) => {
      const isSelected = prev.some((s) => s.id === student.id);
      if (isSelected) {
        return prev.filter((s) => s.id !== student.id);
      } else {
        return [...prev, student];
      }
    });
  };

  const handleCreateSemester = async () => {
    if (!name) {
      Alert.alert("Error", "Por favor ingrese un nombre para el semestre");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/semester/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            description,
            students: selectedStudents.map((s) => s.id),
          }),
        }
      );

      if (response.ok) {
        Alert.alert("Éxito", "Semestre creado exitosamente");
        router.back();
      } else {
        Alert.alert("Error", "No se pudo crear el semestre");
      }
    } catch (error) {
      console.error("Error creating semester:", error);
      Alert.alert("Error", "Ocurrió un error al crear el semestre");
    }
  };

  const renderStudentItem = ({ item }: { item: User }) => {
    const isSelected = selectedStudents.some((s) => s.id === item.id);
    return (
      <TouchableOpacity
        style={[styles.studentItem, isSelected && styles.selectedItem]}
        onPress={() => toggleSelectStudent(item)}
      >
        <View style={styles.checkbox}>
          {isSelected && (
            <IconSymbol name="checkmark" size={16} color="#2196F3" />
          )}
        </View>
        <View style={styles.studentInfo}>
          <ThemedText style={styles.studentName}>
            {item.name} {item.last_name}
          </ThemedText>
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
        <TextInput
          style={styles.input}
          placeholder="Nombre del Semestre"
          value={name}
          onChangeText={setName}
          placeholderTextColor="#888"
        />

        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Descripción (opcional)"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
          placeholderTextColor="#888"
        />

        <ThemedText style={styles.label}>Seleccionar Estudiantes:</ThemedText>
        <FlatList
          data={students}
          renderItem={renderStudentItem}
          keyExtractor={(item) => item.id}
          style={styles.list}
          contentContainerStyle={styles.listContent}
        />

        <View style={styles.buttonContainer}>
          <Button
            title="Crear Semestre"
            onPress={handleCreateSemester}
            disabled={!name || selectedStudents.length === 0}
          />
        </View>
      </ThemedView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
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
  textArea: {
    height: 100,
    textAlignVertical: "top",
    paddingTop: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingVertical: 8,
  },
  studentItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    marginVertical: 4,
    backgroundColor: "white",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  selectedItem: {
    backgroundColor: "#e3f2fd",
    borderColor: "#2196F3",
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#2196F3",
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 16,
    fontWeight: "600",
  },
  studentEmail: {
    fontSize: 14,
    color: "#666",
  },
  buttonContainer: {
    marginTop: 10,
    paddingBottom: 90,
  },
});

export default CreateSemesterScreen;
