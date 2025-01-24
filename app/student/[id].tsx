import React, { useEffect, useState } from "react";
import { StyleSheet, Image, ScrollView, View } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useAuth, User } from "@/context/AuthContext";
import { useLocalSearchParams } from "expo-router";

const StudentDetailScreen = () => {
  const { students } = useAuth();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [student, setStudent] = useState<User | null>(null);

  useEffect(() => {
    console.log({ id });
    if (id && students) {
      const foundStudent = students.find((student) => student.id === id);
      setStudent(foundStudent || null);
    }
  }, [id, students]);

  const getImageUrl = (path: string) => {
    return `${process.env.EXPO_PUBLIC_API_URL}/user/${path}`;
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
      <View style={styles.imageContainer}>
        {student.images.map((image, index) => (
          <Image
            key={index}
            source={{ uri: getImageUrl(image) }}
            style={styles.profileImage}
          />
        ))}
      </View>
      <ThemedText style={styles.name}>
        {student.name} {student.last_name}
      </ThemedText>
      <ThemedText>Email: {student.email}</ThemedText>
      <ThemedText>Age: {student.age}</ThemedText>
      <ThemedText>Gender: {student.gender}</ThemedText>
      <ThemedText>Role: {student.role}</ThemedText>
    </ScrollView>
  );
};

export default StudentDetailScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 20,
  },
  imageContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginHorizontal: 5,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
});
