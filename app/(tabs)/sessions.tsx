import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View, TouchableOpacity, Alert, Modal, TextInput } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { router } from "expo-router";
import { Session, useSession } from "@/context/SessionContext";
import { useClassroom } from "@/context/ClassroomContext";
import { IconSymbol } from "@/components/ui/IconSymbol";

const SessionsScreen = () => {
  const { loadSessions, sessions, updateSession, deleteSession } = useSession();
  const { classrooms, loadClassrooms } = useClassroom();
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentSession, setCurrentSession] = useState<Session | null>(null);
  const [editName, setEditName] = useState("");

  useEffect(() => {
    loadSessions();
    loadClassrooms();
  }, []);

  const handleEdit = (session: Session) => {
    setCurrentSession(session);
    setEditName(session.name);
    setEditModalVisible(true);
  };

  const handleDelete = (session: Session) => {
    Alert.alert(
      "Confirmar eliminación",
      `¿Estás seguro de que deseas eliminar la sesión "${session.name}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Eliminar", 
          style: "destructive",
          onPress: async () => {
            try {
              await deleteSession(session.id);
              Alert.alert("Éxito", "Sesión eliminada correctamente");
            } catch (error) {
              Alert.alert("Error", "No se pudo eliminar la sesión");
            }
          }
        }
      ]
    );
  };

  const handleSaveEdit = async () => {
    if (!currentSession) return;
    
    try {
      await updateSession(currentSession.id, {
        name: editName
      });
      setEditModalVisible(false);
      Alert.alert("Éxito", "Sesión actualizada correctamente");
    } catch (error) {
      Alert.alert("Error", "No se pudo actualizar la sesión");
    }
  };

  const getClassroomName = (classroomId: string) => {
    const classroom = classrooms.find(c => c.id === classroomId);
    return classroom ? classroom.name : 'Clase no encontrada';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 80 }}
      keyboardShouldPersistTaps="handled"
    >
      <View style={{ margin: 5 }}>
        <ThemedText>Sesiones</ThemedText>
        {sessions.map((session, index) => (
          <SessionCard 
            key={index} 
            session={session} 
            classroomName={getClassroomName(session.classroom_id)}
            formattedDate={formatDate(session.created_at)}
            onEdit={() => handleEdit(session)}
            onDelete={() => handleDelete(session)}
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
            <ThemedText style={styles.modalTitle}>Editar Sesión</ThemedText>
            
            <ThemedText style={styles.label}>Nombre</ThemedText>
            <TextInput
              style={styles.input}
              value={editName}
              onChangeText={setEditName}
              placeholder="Nombre de la sesión"
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

interface SessionCardProps {
  session: Session;
  classroomName: string;
  formattedDate: string;
  onEdit: () => void;
  onDelete: () => void;
}

const SessionCard = ({ session, classroomName, formattedDate, onEdit, onDelete }: SessionCardProps) => {
  return (
    <View style={{ margin: 5 }}>
      <ThemedView style={styles.card}>
        <TouchableOpacity
          style={styles.cardContent}
          onPress={() => router.push(`/session/${session.id}`)}
        >
          <View style={styles.containerText}>
            <ThemedText style={styles.sessionName}>{session.name}</ThemedText>
            <ThemedText style={styles.classroomName}>Clase: {classroomName}</ThemedText>
            <ThemedText style={styles.date}>Fecha: {formattedDate}</ThemedText>
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

export default SessionsScreen;

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
  },
  sessionName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  classroomName: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  date: {
    fontSize: 12,
    color: "#888",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    borderRadius: 5,
    padding: 10,
    width: "48%",
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#f5f5f5",
  },
  saveButton: {
    backgroundColor: "#4CAF50",
  },
  buttonText: {
    fontWeight: "bold",
  },
});
