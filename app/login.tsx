import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { router } from "expo-router";
import { useAuth } from "@/context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("eduar2.moreira@gmail.com");
  const [password, setPassword] = useState("NeKjp4Ah");
  const { login } = useAuth();

  const handleLogin = async () => {
    try {
      await login(email, password);
      router.replace("/(tabs)");
    } catch (error) {
      Alert.alert(
        "Login failed",
        "Please check your credentials and try again."
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text>Login</Text>
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
        placeholder="Password"
        placeholderTextColor="#888"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Login" onPress={handleLogin} />
      <Button
        title="Don't have an account? Register"
        onPress={() => router.navigate("/register")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 12,
    paddingLeft: 8,
    color: "#000", // Text color
    backgroundColor: "#fff", // Background color
  },
});
