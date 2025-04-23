import React, { useEffect } from "react";
import { Image, ScrollView, StyleSheet, View } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { useAuth, User } from "@/context/AuthContext";
import { Link } from "expo-router";

const StudentsScreen = () => {
  const { students, loadStudents } = useAuth();

  useEffect(() => {
    const loadData = async () => {
      try {
        await loadStudents();
      } catch (error) {
        console.error("Error loading students:", error);
      }
    };
    loadData();
  }, []);

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 80 }}
    keyboardShouldPersistTaps="handled"
  >
      <View style={{ margin: 5 }}>
        <ThemedText>Students ({students.length})</ThemedText>
        {students && students.length > 0 ? (
          students.map((student) => (
            <StudentCard 
              key={`student-${student.id}`} 
              student={student} 
            />
          ))
        ) : (
          <ThemedText>No students found</ThemedText>
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
      style={{ margin: 5 }}
    >
      <ThemedView style={styles.container}>
        <View style={styles.containerImages}>
          {student.images.map((image, index) => (
            <Image
              key={index}
              source={{ uri: image ? getImageUrl(image) : "" }}
              style={styles.profileImage}
            />
          ))}
        </View>
        <View style={styles.containerText}>
          <ThemedText>
            {student.name} {student.last_name}
          </ThemedText>
          <ThemedText>{student.email}</ThemedText>
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
    padding: 5,
    borderRadius: 10,
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
});
