import { Tabs } from "expo-router";
import { House, PersonStanding, Cog } from "lucide-react-native";
import { colors } from "../../theme";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.tertiary,
        tabBarInactiveTintColor: colors.secondary,
        tabBarActiveBackgroundColor: colors.primaryLight,
        //Todo stila lo sfondo di tutte le pagine
        tabBarIconStyle: {
          marginTop: 10,
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
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <PersonStanding size={28} name="person-standing" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => <Cog size={28} name="cog" color={color} />,
        }}
      />
    </Tabs>
  );
}
