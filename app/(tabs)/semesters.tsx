import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View, TouchableOpacity, Alert, Modal, TextInput } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { Link, router } from "expo-router";
import { Semester, useSemester } from "@/context/SemesterContext";
import { useAuth } from "@/context/AuthContext";
import { IconSymbol } from "@/components/ui/IconSymbol";

const SemestersScreen = () => {
  const { loadSemesters, semesters, updateSemester, deleteSemester } = useSemester();
  const { loadStudents } = useAuth();
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentSemester, setCurrentSemester] = useState<Semester | null>(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");

  useEffect(() => {
    loadStudents();
    loadSemesters();
  }, []);

  const handleEdit = (semester: Semester) => {
    setCurrentSemester(semester);
    setEditName(semester.name);
    setEditDescription(semester.description);
    setEditModalVisible(true);
  };

  const handleDelete = (semester: Semester) => {
    Alert.alert(
      "Confirmar eliminación",
      `¿Estás seguro de que deseas eliminar el semestre "${semester.name}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Eliminar", 
          style: "destructive",
          onPress: async () => {
            try {
              await deleteSemester(semester.id);
              Alert.alert("Éxito", "Semestre eliminado correctamente");
            } catch (error) {
              Alert.alert("Error", "No se pudo eliminar el semestre");
            }
          }
        }
      ]
    );
  };

  const handleSaveEdit = async () => {
    if (!currentSemester) return;
    
    try {
      await updateSemester(currentSemester.id, {
        name: editName,
        description: editDescription
      });
      setEditModalVisible(false);
      Alert.alert("Éxito", "Semestre actualizado correctamente");
    } catch (error) {
      Alert.alert("Error", "No se pudo actualizar el semestre");
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 80 }}
      keyboardShouldPersistTaps="handled"
    >
      <View style={{ margin: 5 }}>
        {semesters.map((semester, index) => (
          <SemesterCard 
            key={index} 
            semester={semester} 
            onEdit={() => handleEdit(semester)}
            onDelete={() => handleDelete(semester)}
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
            <ThemedText style={styles.modalTitle}>Editar Semestre</ThemedText>
            
            <ThemedText style={styles.label}>Nombre</ThemedText>
            <TextInput
              style={styles.input}
              value={editName}
              onChangeText={setEditName}
              placeholder="Nombre del semestre"
            />
            
            <ThemedText style={styles.label}>Descripción</ThemedText>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={editDescription}
              onChangeText={setEditDescription}
              placeholder="Descripción del semestre"
              multiline
              numberOfLines={4}
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

interface SemesterCardProps {
  semester: Semester;
  onEdit: () => void;
  onDelete: () => void;
}

const SemesterCard = ({ semester, onEdit, onDelete }: SemesterCardProps) => {
  return (
    <View style={{ margin: 5 }}>
      <ThemedView style={styles.card}>
        <TouchableOpacity
          style={styles.cardContent}
          onPress={() => router.push(`/semester/${semester.id}`)}
        >
          <View style={styles.containerText}>
            <ThemedText style={styles.semesterName}>{semester.name}</ThemedText>
            <ThemedText style={styles.description}>{semester.description}</ThemedText>
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
            <IconSymbol name="pencil" size={20} color="#4E7D96" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.iconButton} 
            onPress={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          >
            <IconSymbol name="trash" size={20} color="#4E7D96" />
          </TouchableOpacity>
        </View>
      </ThemedView>
    </View>
  );
};

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
  containerText: {
    flex: 1,
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
  },
  semesterName: {
    fontSize: 18,
    fontWeight: "600",
    color: '#2c3e50',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#666',
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
  textArea: {
    height: 100,
    textAlignVertical: 'top',
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

export default SemestersScreen;
