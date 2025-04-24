import React from "react";
import { Image, StyleSheet, View, Button, Alert } from "react-native";
import { useAuth } from "@/context/AuthContext";
import { HelloWave } from "@/components/HelloWave";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Link, router } from "expo-router";

export default function ProfileScreen() {
  const { user, isAuthenticated, logout } = useAuth();

  const getImageUrl = (path: string) => {
    return `${process.env.EXPO_PUBLIC_API_URL}/user/${path}`;
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.replace("/login");
    } catch (error) {
      Alert.alert("Logout failed", "Please try again.");
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.titleContainer}>
        <Image
          source={{ uri: user ? getImageUrl(user.images[0]) : "" }}
          style={styles.profileImage}
        />
        <View style={styles.titleTextContainer}>
          <ThemedText type="title">Bienvenido, {user?.name || "User"}!</ThemedText>
          <HelloWave />
        </View>
      </ThemedView>

      {isAuthenticated ? (
        <View style={styles.profileInfoContainer}>
          <ThemedText>
            Nombre: {user?.name} {user?.last_name}
          </ThemedText>
          <ThemedText>Edad: {user?.age}</ThemedText>
          <ThemedText>Género: {user?.gender}</ThemedText>
          <ThemedText>Email: {user?.email}</ThemedText>
          <ThemedText>Docente</ThemedText>
          <Button title="Cerrar Sesión" onPress={handleLogout} />
        </View>
      ) : (
        <View style={styles.profileInfoContainer}>
          <ThemedText>Inicie sesión para ver su perfil.</ThemedText>
          <Link href="/login" style={styles.button}>
            Log in
          </Link>
        </View>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  titleTextContainer: {
    marginLeft: 10,
  },
  profileInfoContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  button: {
    marginTop: 10,
  },
});
