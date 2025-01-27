import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  TextInput,
  Button,
  KeyboardAvoidingView,
  Platform,
  View,
  Image,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useAuth, User } from "@/context/AuthContext";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Classroom, useClassroom } from "@/context/ClassroomContext";
import { router } from "expo-router";
import { Session, useSession } from "@/context/SessionContext";

const getImageUrl = (path: string) => {
  return `${process.env.EXPO_PUBLIC_API_URL}/user/${path}`;
};

const CreateSessionScreen = () => {
  const { classrooms, loadClassrooms } = useClassroom();
  const { addSession } = useSession();
  const [name, setName] = useState("");
  const [selectedClassroom, setSelectedClassroom] = useState<Classroom | null>(
    null
  );

  useEffect(() => {
    loadClassrooms();
  }, []);

  const handleCreateSession = () => {
    if (!name || !selectedClassroom) {
      alert("Please fill all fields");
      return;
    }

    const sessionData = {
      name,
      classroom_id: selectedClassroom.id,
    };

    try {
      addSession(sessionData);
      router.replace("/");
    } catch (error) {
      console.error("Error creating session:", error);
    }
  };

  const handleSelectClassroom = (classroom: Classroom) => {
    setSelectedClassroom(classroom);
  };

  const renderClassroomItem = ({ item }: { item: Classroom }) => {
    const isSelected = selectedClassroom?.id === item.id;

    return (
      <TouchableOpacity
        style={[styles.item, isSelected && styles.selectedItem]}
        onPress={() => handleSelectClassroom(item)}
      >
        <View style={styles.textContainer}>
          <ThemedText>{item.name}</ThemedText>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ThemedView style={styles.container}>
        <ThemedText style={styles.label}>Enter Session Name:</ThemedText>
        <TextInput
          style={styles.input}
          placeholder="Session Name"
          value={name}
          onChangeText={setName}
          placeholderTextColor="#888"
        />

        <ThemedText style={styles.label}>Select Classroom</ThemedText>
        <View
          style={{
            width: "100%",
            height: 500,
          }}
        >
          <FlatList
            style={{
              width: "100%",
            }}
            data={classrooms}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderClassroomItem}
            contentContainerStyle={styles.list}
          />
        </View>

        <Button title="Create Session" onPress={handleCreateSession} />
      </ThemedView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 20,
  },
  label: {
    alignSelf: "flex-start",
    marginBottom: 5,
    fontSize: 16,
    fontWeight: "bold",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 12,
    paddingLeft: 8,
    width: "100%",
    color: "#000",
    backgroundColor: "#fff",
  },
  list: {
    width: "100%",
    height: 200,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 10,
  },
  selectedItem: {
    borderColor: "#80c0a0",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  textContainer: {
    flexDirection: "column",
  },
});

export default CreateSessionScreen;
