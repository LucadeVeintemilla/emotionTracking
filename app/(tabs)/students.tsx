import React, { useEffect } from "react";
import { Image, ScrollView, StyleSheet, View } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { useAuth, User } from "@/context/AuthContext";
import { Link } from "expo-router";

const StudentsScreen = () => {
  const { students, loadStudents, user } = useAuth();

  useEffect(() => {
    const loadData = async () => {
      if (user) {  
        try {
          await loadStudents();
        } catch (error) {
          console.error("Error loading students:", error);
        }
      }
    };
    loadData();
  }, [user]); 

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 80 }}
    keyboardShouldPersistTaps="handled"
  >
      <View style={{ margin: 5 }}>
        {students && students.length > 0 ? (
          students.map((student) => (
            <StudentCard 
              key={`student-${student.id}`} 
              student={student} 
            />
          ))
        ) : (
          <ThemedText>No se encontraron estudiantes</ThemedText>
        )}
      </View>
    </ScrollView>
  );
};

export const StudentCard = ({ student }: { student: User }) => {
  if (!student || !student.id) {
    return null;
  }

  const getImageUrl = (path: string) => {
    return path ? `${process.env.EXPO_PUBLIC_API_URL}/user/${path}` : "";
  };

  return (
    <Link
      href={{
        pathname: "/student/[id]",
        params: { id: student.id }
      }}
      style={{ margin: 10 }}
    >
      <ThemedView style={styles.container}>
        <Image
          source={{ uri: student.images[0] ? getImageUrl(student.images[0]) : "" }}
          style={styles.profileImage}
        />
        <View style={styles.containerText}>
          <ThemedText style={styles.studentName}>
            {student.name} {student.last_name}
          </ThemedText>
          <ThemedText style={styles.studentEmail}>{student.email}</ThemedText>
        </View>
      </ThemedView>
    </Link>
  );
};

export default StudentsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 15,
    backgroundColor: 'white',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
    marginVertical: 5,
  },
  containerText: {
    flex: 1,
    marginLeft: 15,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  studentName: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 5,
  },
  studentEmail: {
    fontSize: 14,
    color: '#666',
  }
});
