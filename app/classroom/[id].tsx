import React, { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, View, TouchableOpacity, Modal, FlatList } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useAuth, User } from "@/context/AuthContext";
import { useLocalSearchParams } from "expo-router";
import { Classroom, useClassroom } from "@/context/ClassroomContext";
import { Link } from "expo-router";
import { StudentCard } from "../(tabs)/students";
import { IconSymbol } from "@/components/ui/IconSymbol";

const getImageUrl = (path: string) => {
  return `${process.env.EXPO_PUBLIC_API_URL}/user/${path}`;
};

const ClassroomDetailScreen = () => {
  const { students, user } = useAuth();
  const { classrooms, loadClassrooms, addStudentsToClassroom, removeStudentsFromClassroom } = useClassroom();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [classroom, setClassroom] = useState<Classroom | null>(null);
  const [classroomStudents, setClassroomStudents] = useState<User[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState<User[]>([]);

  useEffect(() => {
    if (id && classrooms) {
      const foundClassroom = classrooms.find(
        (classroom) => classroom.id === id
      );
      setClassroom(foundClassroom || null);

      if (foundClassroom) {
        const filteredStudents = students.filter((student) =>
          foundClassroom.students.includes(student.id)
        );
        setClassroomStudents(filteredStudents);
      }
    }
  }, [id, classrooms, students]);

  const nonClassroomStudents = students.filter(
    student => !classroom?.students.includes(student.id)
  );

  const handleAddStudents = async () => {
    try {
      if (classroom) {
        await addStudentsToClassroom(
          classroom.id,
          selectedStudents.map(s => s.id)
        );
        setShowAddModal(false);
        setSelectedStudents([]);
      }
    } catch (error) {
      console.error("Error adding students:", error);
    }
  };

  const handleRemoveStudents = async () => {
    try {
      if (classroom) {
        await removeStudentsFromClassroom(
          classroom.id,
          selectedStudents.map(s => s.id)
        );
        setShowRemoveModal(false);
        setSelectedStudents([]);
      }
    } catch (error) {
      console.error("Error removing students:", error);
    }
  };

  const renderStudentItem = ({ item }: { item: User }) => {
    const isSelected = selectedStudents.some(s => s.id === item.id);
    return (
      <TouchableOpacity
        style={[styles.studentItem, isSelected && styles.selectedItem]}
        onPress={() => {
          setSelectedStudents(prev => 
            isSelected 
              ? prev.filter(s => s.id !== item.id)
              : [...prev, item]
          );
        }}
      >
        <View style={styles.checkboxContainer}>
          <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
            {isSelected && <IconSymbol name="checkmark" size={16} color="white" />}
          </View>
        </View>
        <Image
          source={{ uri: item.images[0] ? getImageUrl(item.images[0]) : "" }}
          style={styles.studentAvatar}
        />
        <View style={styles.studentInfoContainer}>
          <ThemedText style={styles.studentName}>
            {item.name} {item.last_name}
          </ThemedText>
          <ThemedText style={styles.studentEmail}>{item.email}</ThemedText>
        </View>
      </TouchableOpacity>
    );
  };

  if (!classroom) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Classroom not found</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <View style={styles.headerCard}>
        <ThemedText style={styles.classroomName}>{classroom.name}</ThemedText>
        <View style={styles.teacherContainer}>
          <ThemedText style={styles.teacherLabel}>Docente</ThemedText>
          <ThemedText style={styles.teacherName}>
            {user!.name} {user!.last_name}
          </ThemedText>
        </View>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setShowAddModal(true)}
        >
          <ThemedText style={styles.addButtonText}>
            Agregar Estudiantes
          </ThemedText>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.deleteButton}
          onPress={() => {
            setSelectedStudents([]);
            setShowRemoveModal(true);
          }}
        >
          <ThemedText style={styles.deleteButtonText}>
            Eliminar Estudiantes
          </ThemedText>
        </TouchableOpacity>
      </View>

      <ThemedText style={styles.studentsTitle}>Estudiantes</ThemedText>
      <ScrollView>
        {classroomStudents.map((student) => (
          <StudentCard student={student} key={student.id} />
        ))}
      </ScrollView>

      <Modal visible={showAddModal} animationType="slide">
        <ThemedView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <ThemedText style={styles.modalTitle}>
              Agregar Estudiantes a la Clase
            </ThemedText>
          </View>
          
          <FlatList
            data={nonClassroomStudents}
            renderItem={renderStudentItem}
            keyExtractor={item => item.id}
            style={styles.studentList}
            contentContainerStyle={styles.studentListContent}
          />

          <View style={styles.modalFooter}>
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={() => {
                setShowAddModal(false);
                setSelectedStudents([]);
              }}
            >
              <ThemedText style={styles.buttonText}>Cancelar</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.modalAddButton,
                selectedStudents.length === 0 && styles.disabledButton
              ]}
              onPress={handleAddStudents}
              disabled={selectedStudents.length === 0}
            >
              <ThemedText style={styles.buttonText}>
                Agregar ({selectedStudents.length})
              </ThemedText>
            </TouchableOpacity>
          </View>
        </ThemedView>
      </Modal>

      <Modal
        visible={showRemoveModal}
        animationType="slide"
        onRequestClose={() => setShowRemoveModal(false)}
      >
        <ThemedView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <ThemedText style={styles.modalTitle}>Eliminar Estudiantes de la Clase</ThemedText>
          </View>
          <FlatList
            data={classroomStudents}
            renderItem={renderStudentItem}
            keyExtractor={(item) => item.id}
            style={styles.studentList}
            contentContainerStyle={styles.studentListContent}
          />
          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                setShowRemoveModal(false);
                setSelectedStudents([]);
              }}
            >
              <ThemedText style={styles.buttonText}>Cancelar</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.modalAddButton,
                selectedStudents.length === 0 && styles.disabledButton,
              ]}
              disabled={selectedStudents.length === 0}
              onPress={handleRemoveStudents}
            >
              <ThemedText style={styles.buttonText}>
                Eliminar ({selectedStudents.length})
              </ThemedText>
            </TouchableOpacity>
          </View>
        </ThemedView>
      </Modal>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  headerCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  classroomName: {
    fontSize: 25,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: 'center',
    color: '#2c3e50',
  },
  teacherContainer: {
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  teacherLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  teacherName: {
    fontSize: 20,
    fontWeight: "600",
    color: '#2c3e50',
  },
  studentsTitle: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 16,
    color: '#2c3e50',
    paddingHorizontal: 4,
  },
  studentCard: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
    borderRadius: 10,
    marginBottom: 10,
  },
  containerText: {
    flex: 1,
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
  },
  containerImages: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "center",
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 50,
    marginLeft: -15,
  },
  addButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  addButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: '#F44336',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  deleteButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  modalHeader: {
    backgroundColor: 'white',
    paddingTop: 70, 
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2c3e50',
    textAlign: 'center',
  },
  studentList: {
    flex: 1,
  },
  studentListContent: {
    padding: 16,
  },
  studentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 2,
  },
  selectedItem: {
    backgroundColor: '#e3f2fd',
  },
  checkboxContainer: {
    marginRight: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
  },
  studentAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  studentInfoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  studentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 4,
  },
  studentEmail: {
    fontSize: 14,
    color: '#666',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#9e9e9e',
    padding: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  modalAddButton: {
    flex: 1,
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 8,
    marginLeft: 8,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.5,
  },
});

export default ClassroomDetailScreen;
