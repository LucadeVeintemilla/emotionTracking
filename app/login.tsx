import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from "react-native";
import { router } from "expo-router";
import { useAuth } from "@/context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();

  const handleLogin = async () => {
    try {
      await login(email, password);
      router.replace("/profile");
    } catch (error) {
      Alert.alert(
        "Error al iniciar sesión",
        "Por favor, revise sus credenciales y vuelva a intentarlo"
      );
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Image
          source={require('../images/logoTesi.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <TextInput
          keyboardType="email-address"
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#888"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          keyboardType="default"
          style={styles.input}
          placeholder="Contraseña"
          placeholderTextColor="#888"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <Button title="Iniciar sesión" onPress={handleLogin} />
        <Button
          title="¿No tienes una cuenta? Regístrate"
          onPress={() => router.navigate("/register")}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
  },
  logo: {
    width: 300,
    height: 300,
    marginBottom: 30,
    alignSelf: "center",
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
});
