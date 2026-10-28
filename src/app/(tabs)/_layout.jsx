import { Tabs } from "expo-router";
import { House, PersonStanding, Cog } from "lucide-react-native";
import { colors } from "../../theme";
import { Dumbbell } from "lucide-react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.tertiary,
        tabBarInactiveTintColor: colors.secondary,

        sceneStyle: {
          backgroundColor: colors.primary,
        },

        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.primary,
          borderTopWidth: 0,
          paddingBottom: 0,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <House size={28} name="house" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="workoutTab"
        options={{
          title: "Workout",
          tabBarIcon: ({ color }) => (
            <Dumbbell size={28} name="dumbbell" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profileTab"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <PersonStanding size={28} name="person-standing" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settingsTab"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => <Cog size={28} name="cog" color={color} />,
        }}
      />
    </Tabs>
  );
}
