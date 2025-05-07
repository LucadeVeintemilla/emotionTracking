import { Tabs } from "expo-router";
import React, { useRef, useState } from "react";
import { Platform, Pressable } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { router } from "expo-router";

export default function TabLayout() {
  const colorScheme = useColorScheme() ?? "light";

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].header,
        tabBarInactiveTintColor: Colors[colorScheme ?? "light"].header,
        headerShown: true,
        headerStyle: {
          backgroundColor: Colors[colorScheme ?? "light"].header,
          height: 120,
        },
        headerTitleStyle: {
          fontSize: 22,
          fontWeight: 'bold',
        },
        headerTintColor: '#fff',
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: "absolute",
            backgroundColor: '#fff',
          },
          default: {
            backgroundColor: '#fff',
          },
        }),
      }}
    >
      <Tabs.Screen
        name="sessions"
        options={{
          title: "Clases",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="camera.rotate.fill" color={color} />
          ),
          headerRight: () => (
            <Pressable
              onPress={() => {
                router.push("/create-session");
              }}
            >
              <IconSymbol
                style={{ marginRight: 15, backgroundColor: '#FF844B', borderRadius: 25, padding: 8, marginTop: 5 }}
                size={35}
                name="plus"
                color={'#fff'}
              />
            </Pressable>
          ),
        }}
      />
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Análisis de Sesiones",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="chart.bar.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="classrom"
        options={{
          title: "Materias",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="book.fill" color={color} />
          ),
          headerRight: () => (
            <Pressable
              onPress={() => {
                router.push("/create-classroom");
              }}
            >
              <IconSymbol
                style={{ marginRight: 15, backgroundColor: '#FF844B', borderRadius: 25, padding: 8, marginTop: 5 }}
                size={35}
                name="plus"
                color={'#fff'}
              />
            </Pressable>
          ),
        }}
      />
      <Tabs.Screen
        name="semesters"
        options={{
          title: "Semestres",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="plus.app" color={color} />
          ),
          headerRight: () => (
            <Pressable
              onPress={() => {
                router.push("/create-semester");
              }}
            >
              <IconSymbol
                style={{ marginRight: 15, backgroundColor: '#FF844B', borderRadius: 25, padding: 8, marginTop: 5 }}
                size={35}
                name="plus"
                color={'#fff'}
              />
            </Pressable>
          ),
        }}
      />
      <Tabs.Screen
        name="students"
        options={{
          title: "Estudiantes",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="person.fill" color={color} />
          ),
          headerRight: () => (
            <Pressable
              onPress={() => {
                router.push("/create-student");
              }}
            >
              <IconSymbol
                style={{ marginRight: 15, backgroundColor: '#FF844B', borderRadius: 25, padding: 8, marginTop: 5 }}
                size={35}
                name="plus"
                color={'#fff'}
              />
            </Pressable>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
