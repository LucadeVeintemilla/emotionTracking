import React, { useEffect } from "react";
import { Image, ScrollView, StyleSheet, View } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { useAuth, User } from "@/context/AuthContext";
import { Link } from "expo-router";

const StudentsScreen = () => {
  const { loadStudents, students } = useAuth();

  useEffect(() => {
    loadStudents();
  }, []);

  return (
    <ScrollView>
      <View style={{ margin: 5 }}>
        <ThemedText>Students</ThemedText>
        {students.map((student, index) => (
          <StudentCard student={student} key={index} />
        ))}
      </View>
    </ScrollView>
  );
};

export const StudentCard = ({ student }: { student: User }) => {
  const getImageUrl = (path: string) => {
    return `${process.env.EXPO_PUBLIC_API_URL}/user/${path}`;
  };

  return (
    <Link href={`/student/${student.id}`} style={{ margin: 5 }}>
      <ThemedView style={styles.container}>
        <View style={styles.containerImages}>
          <Image
            source={{ uri: student ? getImageUrl(student.images[0]) : "" }}
            style={styles.profileImage}
          />
          <Image
            source={{ uri: student ? getImageUrl(student.images[1]) : "" }}
            style={styles.profileImage}
          />
          <Image
            source={{ uri: student ? getImageUrl(student.images[2]) : "" }}
            style={styles.profileImage}
          />
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
