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
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: true,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
           
            position: "absolute",
          },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Session",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
          headerRight: () => (
            <Pressable
              onPress={() => {
                router.push("/create-session");
              }}
            >
              <IconSymbol
                style={{ marginRight: 10 }}
                size={28}
                name="plus"
                color={Colors[colorScheme].tint}
              />
            </Pressable>
          ),
        }}
      />
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Analysis",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="chart.bar.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="classrom"
        options={{
          title: "Classroom",
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
                style={{ marginRight: 10 }}
                size={28}
                name="plus"
                color={Colors[colorScheme].tint}
              />
            </Pressable>
          ),
        }}
      />
      <Tabs.Screen
        name="students"
        options={{
          title: "Students",
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
                style={{ marginRight: 10 }}
                size={28}
                name="plus"
                color={Colors[colorScheme].tint}
              />
            </Pressable>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="person.fill" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
