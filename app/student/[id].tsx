import React, { useEffect, useState } from "react";
import { StyleSheet, Image, ScrollView, View, Platform } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useAuth, User } from "@/context/AuthContext";
import { useLocalSearchParams } from "expo-router";

const StudentDetailScreen = () => {
  const { students } = useAuth();
  const params = useLocalSearchParams<{ id: string }>();
  const [student, setStudent] = useState<User | null>(null);

  useEffect(() => {
    if (params.id && students) {
      const foundStudent = students.find(
        (student) => student.id === params.id.toString()
      );
      setStudent(foundStudent || null);
    }
  }, [params.id, students]);

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
          
          <View style={styles.roleContainer}>
            <ThemedText style={styles.role}>Estudiante</ThemedText>
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
});
