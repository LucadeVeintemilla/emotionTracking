import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useLocalSearchParams } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { StudentCard } from '../(tabs)/students';

export default function SemesterScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { students } = useAuth();

  const semesterStudents = students.filter(student => student.semester === id);

  return (
    <ScrollView>
      <ThemedView style={styles.container}>
        <ThemedText style={styles.title}>Semestre {id}</ThemedText>
        {semesterStudents.map((student) => (
          <StudentCard key={student.id} student={student} />
        ))}
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});
