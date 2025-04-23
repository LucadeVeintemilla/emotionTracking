import React from "react";
import { ScrollView, StyleSheet, View, Pressable } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { useSession } from "@/context/SessionContext";
import { router } from "expo-router";

export default function DashboardScreen() {
  const { sessions } = useSession();

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 80 }}
    keyboardShouldPersistTaps="handled">
      <View style={styles.container}>
        <ThemedText style={styles.title}>Sessions Analysis</ThemedText>
        {sessions.map((session, index) => (
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
  }
});
