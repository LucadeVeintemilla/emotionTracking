import React, { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, View, TouchableOpacity, Alert, Modal, TextInput } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { Link, router } from "expo-router";
import { Classroom, useClassroom } from "@/context/ClassroomContext";
import { useAuth } from "@/context/AuthContext";
import { IconSymbol } from "@/components/ui/IconSymbol";

const ClassroomsScreen = () => {
  const { loadClassrooms, classrooms, updateClassroom, removeClassroom } = useClassroom();
  const { loadStudents } = useAuth();
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentClassroom, setCurrentClassroom] = useState<Classroom | null>(null);
  const [editName, setEditName] = useState("");

  useEffect(() => {
    loadStudents();
    loadClassrooms();
  }, []);

  const handleEdit = (classroom: Classroom) => {
    setCurrentClassroom(classroom);
    setEditName(classroom.name);
    setEditModalVisible(true);
  };

  const handleDelete = (classroom: Classroom) => {
    Alert.alert(
      "Confirmar eliminación",
      `¿Estás seguro de que deseas eliminar la clase "${classroom.name}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Eliminar", 
          style: "destructive",
          onPress: async () => {
            try {
              await removeClassroom(classroom.id);
              Alert.alert("Éxito", "Clase eliminada correctamente");
            } catch (error) {
              Alert.alert("Error", "No se pudo eliminar la clase");
            }
          }
        }
      ]
    );
  };

  const handleSaveEdit = async () => {
    if (!currentClassroom) return;
    
    try {
      await updateClassroom(currentClassroom.id, {
        name: editName,
        students: currentClassroom.students
      });
      setEditModalVisible(false);
      Alert.alert("Éxito", "Clase actualizada correctamente");
    } catch (error) {
      Alert.alert("Error", "No se pudo actualizar la clase");
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 80 }}
    keyboardShouldPersistTaps="handled"
  >
      <View style={{ margin: 5 }}>
        <ThemedText>Clases</ThemedText>
        {classrooms.map((classroom, index) => (
          <ClassroomCard 
            key={index} 
            classroom={classroom} 
            onEdit={() => handleEdit(classroom)}
            onDelete={() => handleDelete(classroom)}
          />
        ))}
      </View>

      {/* Edit Modal */}
      <Modal
        visible={editModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ThemedText style={styles.modalTitle}>Editar Clase</ThemedText>
            
            <ThemedText style={styles.label}>Nombre</ThemedText>
            <TextInput
              style={styles.input}
              value={editName}
              onChangeText={setEditName}
              placeholder="Nombre de la clase"
            />
            
            <View style={styles.buttonRow}>
              <TouchableOpacity 
                style={[styles.button, styles.cancelButton]} 
                onPress={() => setEditModalVisible(false)}
              >
                <ThemedText style={styles.buttonText}>Cancelar</ThemedText>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.button, styles.saveButton]} 
                onPress={handleSaveEdit}
              >
                <ThemedText style={styles.buttonText}>Guardar</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

interface ClassroomCardProps {
  classroom: Classroom;
  onEdit: () => void;
  onDelete: () => void;
}

const ClassroomCard = ({ classroom, onEdit, onDelete }: ClassroomCardProps) => {
  return (
    <View style={{ margin: 5 }}>
      <ThemedView style={styles.card}>
        <TouchableOpacity
          style={styles.cardContent}
          onPress={() => router.push(`/classroom/${classroom.id}`)}
        >
          <View style={styles.containerText}>
            <ThemedText style={styles.classroomName}>{classroom.name}</ThemedText>
          </View>
        </TouchableOpacity>
        
        <View style={styles.cardActions}>
          <TouchableOpacity 
            style={styles.iconButton} 
            onPress={(e) => {
              e.stopPropagation();
              onEdit();
            }}
          >
            <IconSymbol name="pencil" size={20} color="#4CAF50" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.iconButton} 
            onPress={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          >
            <IconSymbol name="trash" size={20} color="#F44336" />
          </TouchableOpacity>
        </View>
      </ThemedView>
    </View>
  );
};

export default ClassroomsScreen;

const styles = StyleSheet.create({
  card: {
    padding: 15,
    borderRadius: 10,
    marginVertical: 0.1,
    width: "100%",
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cardContent: {
    flex: 1,
  },
  cardActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    padding: 8,
    marginLeft: 5,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  containerText: {
    flex: 1,
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
  },
  classroomName: {
    fontSize: 18,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#9e9e9e',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
