import { Tabs } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { PaperProvider } from "react-native-paper";

export default function AppLayout() {
  return (
    <PaperProvider>
      <Tabs
        screenOptions={{
          headerStyle: {
            backgroundColor: "#007AFF",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
          tabBarActiveTintColor: "#007AFF",
          tabBarStyle: {
            height: 60,
            paddingBottom: 10,
            paddingTop: 10,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Add Case",
            tabBarLabel: "Add Case",
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons
                name="add-circle-outline"
                size={size}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="dashboard"
          options={{
            title: "Dashboard",
            tabBarLabel: "Dashboard",
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="dashboard" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="case/[id]"
          options={{
            href: null,
            headerShown: false,
          }}
        />
      </Tabs>
    </PaperProvider>
  );
}
