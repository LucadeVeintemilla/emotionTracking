import React, { useState } from "react";
import { ScrollView, StyleSheet, View, Pressable } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { useSession } from "@/context/SessionContext";
import { useClassroom } from "@/context/ClassroomContext";
import { router } from "expo-router";
import { Dropdown } from "react-native-element-dropdown";

export default function DashboardScreen() {
  const { sessions } = useSession();
  const { classrooms } = useClassroom();
  const [selectedClassroomId, setSelectedClassroomId] = useState<string | null>(null);

  const filteredSessions = selectedClassroomId 
    ? sessions.filter(session => session.classroom_id === selectedClassroomId)
    : sessions;

  return (
    <ScrollView 
      contentContainerStyle={{ flexGrow: 1, paddingBottom: 80 }}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.container}>
        <ThemedText style={styles.title}>Análisis de Sesiones</ThemedText>
        
        <View style={styles.filterContainer}>
          <Dropdown
            style={styles.dropdown}
            data={[
              { id: null, name: "Todas las Sesiones" },
              ...classrooms.map(c => ({ id: c.id, name: c.name }))
            ]}
            labelField="name"
            valueField="id"
            placeholder="Filtrar por Clase"
            value={selectedClassroomId}
            onChange={item => setSelectedClassroomId(item.id)}
            placeholderStyle={styles.dropdownPlaceholder}
            selectedTextStyle={styles.dropdownSelectedText}
          />
        </View>

        {filteredSessions.map((session, index) => (
          <Pressable 
            key={index}
            onPress={() => router.push(`/session/stats/${session.id}`)}
          >
            <ThemedView style={styles.card}>
              <ThemedText style={styles.sessionName}>{session.name}</ThemedText>
              <ThemedText style={styles.date}>
                {new Date(session.created_at).toLocaleDateString()}
              </ThemedText>
            </ThemedView>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  card: {
    padding: 15,
    borderRadius: 10,
    marginVertical: 5,
  },
  sessionName: {
    fontSize: 18,
    fontWeight: "600",
  },
  date: {
    fontSize: 14,
    opacity: 0.7,
  },
  filterContainer: {
    marginBottom: 20,
    width: '100%',
  },
  dropdown: {
    height: 50,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 2,
  },
  dropdownPlaceholder: {
    fontSize: 16,
    color: '#666',
  },
  dropdownSelectedText: {
    fontSize: 16,
    color: '#000',
  }
});
