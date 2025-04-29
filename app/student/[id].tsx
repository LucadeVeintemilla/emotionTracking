import React, { useEffect, useState } from "react";
import { StyleSheet, Image, ScrollView, View, Platform, Alert, TouchableOpacity, TextInput } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useAuth, User } from "@/context/AuthContext";
import { useLocalSearchParams } from "expo-router";
import { router } from "expo-router";

const StudentDetailScreen = () => {
  const { students, deleteStudent, updateStudent } = useAuth();
  const params = useLocalSearchParams<{ id: string }>();
  const [student, setStudent] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: "",
    last_name: "",
    email: "",
    age: "",
    gender: ""
  });

  useEffect(() => {
    if (params.id && students) {
      const foundStudent = students.find(
        (student) => student.id === params.id.toString()
      );
      setStudent(foundStudent || null);
    }
  }, [params.id, students]);

  useEffect(() => {
    if (student) {
      setEditData({
        name: student.name,
        last_name: student.last_name,
        email: student.email,
        age: student.age.toString(),
        gender: student.gender
      });
    }
  }, [student]);

  const getImageUrl = (path: string) => {
    if (!path) return "";
    const normalizedPath = path.replace(/\\/g, '/');
    const baseUrl = process.env.EXPO_PUBLIC_API_URL;
    let fullUrl = `${baseUrl}/user/${normalizedPath}`;
    
    if (Platform.OS === 'android') {
      fullUrl = fullUrl.replace(/([^:])\/\//g, '$1/');
      fullUrl = fullUrl.trim();
    }

    return fullUrl;
  };

  const handleDeleteStudent = async () => {
    if (!student) return;

    Alert.alert(
      "Eliminar Estudiante",
      "¿Está seguro que desea eliminar este estudiante? Esta acción no se puede deshacer.",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteStudent(student.id);
              Alert.alert("Éxito", "Estudiante eliminado correctamente");
              router.replace("/(tabs)/students");
            } catch (error) {
              Alert.alert("Error", "No se pudo eliminar el estudiante");
            }
          }
        }
      ]
    );
  };

  const handleToggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleSaveChanges = async () => {
    if (!student) return;

    try {
      const updatedData = {
        ...student,
        ...editData,
        age: parseInt(editData.age)
      };

      await updateStudent(student.id, updatedData);
      setStudent(updatedData);
      setIsEditing(false);
      Alert.alert("Éxito", "Datos actualizados correctamente");
    } catch (error) {
      Alert.alert("Error", "No se pudieron actualizar los datos");
    }
  };

  if (!student) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Student not found</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Image
          source={{ uri: student.images[0] ? getImageUrl(student.images[0]) : "" }}
          style={styles.profileImage}
        />
        
        <View style={styles.infoContainer}>
          {isEditing ? (
            <>
              <View style={styles.inputGroup}>
                <ThemedText style={styles.label}>Nombre:</ThemedText>
                <TextInput
                  style={styles.input}
                  value={editData.name}
                  onChangeText={(text) => setEditData({...editData, name: text})}
                />
              </View>
              
              <View style={styles.inputGroup}>
                <ThemedText style={styles.label}>Apellido:</ThemedText>
                <TextInput
                  style={styles.input}
                  value={editData.last_name}
                  onChangeText={(text) => setEditData({...editData, last_name: text})}
                />
              </View>

              <View style={styles.inputGroup}>
                <ThemedText style={styles.label}>Email:</ThemedText>
                <TextInput
                  style={styles.input}
                  value={editData.email}
                  onChangeText={(text) => setEditData({...editData, email: text})}
                />
              </View>

              <View style={styles.inputGroup}>
                <ThemedText style={styles.label}>Edad:</ThemedText>
                <TextInput
                  style={styles.input}
                  value={editData.age}
                  onChangeText={(text) => setEditData({...editData, age: text})}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputGroup}>
                <ThemedText style={styles.label}>Género:</ThemedText>
                <TextInput
                  style={styles.input}
                  value={editData.gender}
                  onChangeText={(text) => setEditData({...editData, gender: text})}
                />
              </View>
            </>
          ) : (
            <>
              <ThemedText style={styles.name}>
                {student.name} {student.last_name}
              </ThemedText>
              
              <View style={styles.infoRow}>
                <ThemedText style={styles.label}>Email:</ThemedText>
                <ThemedText style={styles.value}>{student.email}</ThemedText>
              </View>
              
              <View style={styles.infoRow}>
                <ThemedText style={styles.label}>Edad:</ThemedText>
                <ThemedText style={styles.value}>{student.age} años</ThemedText>
              </View>
              
              <View style={styles.infoRow}>
                <ThemedText style={styles.label}>Género:</ThemedText>
                <ThemedText style={styles.value}>{student.gender}</ThemedText>
              </View>
            </>
          )}
          
          <View style={styles.roleContainer}>
            <ThemedText style={styles.role}>Estudiante</ThemedText>
          </View>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.editButton} 
              onPress={isEditing ? handleSaveChanges : handleToggleEdit}
            >
              <ThemedText style={styles.editButtonText}>
                {isEditing ? "Guardar Cambios" : "Editar"}
              </ThemedText>
            </TouchableOpacity>

            {isEditing && (
              <TouchableOpacity 
                style={styles.cancelButton} 
                onPress={() => {
                  setIsEditing(false);
                  setEditData({
                    name: student.name,
                    last_name: student.last_name,
                    email: student.email,
                    age: student.age.toString(),
                    gender: student.gender
                  });
                }}
              >
                <ThemedText style={styles.cancelButtonText}>
                  Cancelar
                </ThemedText>
              </TouchableOpacity>
            )}

            <TouchableOpacity 
              style={styles.deleteButton} 
              onPress={handleDeleteStudent}
            >
              <ThemedText style={styles.deleteButtonText}>
                Eliminar Estudiante
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default StudentDetailScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  card: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  profileImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginBottom: 20,
  },
  infoContainer: {
    width: '100%',
    alignItems: 'center',
  },
  name: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    width: '30%',
    color: '#666',
  },
  value: {
    fontSize: 18,
    flex: 1,
  },
  roleContainer: {
    marginTop: 20,
    backgroundColor: '#e8f4ff',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  role: {
    fontSize: 16,
    color: '#0066cc',
    fontWeight: '600',
  },
  deleteButton: {
    marginTop: 20,
    backgroundColor: '#ff4444',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: '100%',
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  inputGroup: {
    width: '100%',
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    backgroundColor: 'white',
    color: '#000',
  },
  buttonContainer: {
    width: '100%',
    gap: 10,
    marginTop: 20,
  },
  editButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: '100%',
  },
  editButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  cancelButton: {
    backgroundColor: '#9e9e9e',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: '100%',
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
