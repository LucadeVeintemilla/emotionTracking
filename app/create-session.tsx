import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  TextInput,
  Button,
  KeyboardAvoidingView,
  Platform,
  View,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Classroom, useClassroom } from "@/context/ClassroomContext";

// Ensure Classroom interface has id defined as string | number
type SafeClassroom = Omit<Classroom, 'id'> & { id: string | number };
import { router } from "expo-router";
import { Session, useSession } from "@/context/SessionContext";

const getImageUrl = (path: string) => {
  return `${process.env.EXPO_PUBLIC_API_URL}/user/${path}`;
};

const CreateSessionScreen = () => {
  const { classrooms, loadClassrooms } = useClassroom();
  const { addSession } = useSession();
  const [name, setName] = useState("");
  const [selectedClassroomId, setSelectedClassroomId] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      console.log("Initializing CreateSessionScreen");
      await loadClassrooms();
    };
    init();
  }, []);

  useEffect(() => {
    console.log("Classrooms updated:", classrooms);
  }, [classrooms]);

  const handleSelectClassroom = (classroom: Classroom) => {
    console.log("Selecting classroom:", classroom);
    setSelectedClassroomId(classroom.id);
  };

  const handleCreateSession = () => {
    if (!name || !selectedClassroomId) {
      alert("Please fill all fields");
      return;
    }

    try {
      addSession({
        name,
        classroom_id: selectedClassroomId
      });
      router.replace("/");
    } catch (error) {
      console.error("Error creating session:", error);
    }
  };

  const renderClassroomItem = ({ item }: { item: Classroom }) => {
    const isSelected = selectedClassroomId === item.id;
    
    return (
      <TouchableOpacity
        style={[styles.item, isSelected && styles.selectedItem]}
        onPress={() => handleSelectClassroom(item)}
        activeOpacity={0.7}
      >
        <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
          {isSelected && <IconSymbol name="checkmark" size={16} color="white" />}
        </View>
        <View style={styles.textContainer}>
          <ThemedText style={styles.className}>{item.name}</ThemedText>
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
        <View style={styles.contentContainer}>
          <ThemedText style={styles.label}>Enter Session Name:</ThemedText>
          <TextInput
            style={styles.input}
            placeholder="Session Name"
            value={name}
            onChangeText={setName}
            placeholderTextColor="#888"
          />

          <ThemedText style={styles.label}>
            Select Classroom ({classrooms.length})
          </ThemedText>
          <View style={styles.listContainer}>
            <FlatList
              data={classrooms}
              keyExtractor={(item) => item.id}
              renderItem={renderClassroomItem}
              contentContainerStyle={styles.list}
              ListEmptyComponent={() => (
                <ThemedText style={styles.emptyText}>No classrooms available</ThemedText>
              )}
              showsVerticalScrollIndicator={true}
            />
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <Button 
            title="Create Session" 
            onPress={handleCreateSession} 
            disabled={!name || !selectedClassroomId}
          />
        </View>
      </ThemedView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    padding: 50,
  },
  contentContainer: {
    flex: 1,
    width: "100%",
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
    paddingBottom: 10,
  },
  listContainer: {
    flex: 1,
    width: "100%",
    marginBottom: 10,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    marginVertical: 4,
    marginHorizontal: 8,
    borderRadius: 12,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  selectedItem: {
    backgroundColor: "#f0f9ff",
  },
  checkboxContainer: {
    marginRight: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#ccc",
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxSelected: {
    backgroundColor: "#2196F3",
    borderColor: "#2196F3",
  },
  className: {
    fontSize: 16,
    fontWeight: "600",
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
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
  },
  buttonContainer: {
    width: "100%",
    paddingVertical: 60,
  },
});

export default CreateSessionScreen;
