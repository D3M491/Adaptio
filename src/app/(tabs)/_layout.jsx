import { Tabs } from "expo-router";
import { House, PersonStanding } from "lucide-react-native";
import { colors } from "../../theme";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.tertiary,
        tabBarInactiveTintColor: colors.secondary,
        tabBarActiveBackgroundColor: colors.primaryLight,
        headerShown: false,

        //Todo sposta le icone piu i basso
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
          tabBarIcon: ({ focused }) => (
            <House
              size={28}
              name="house"
              color={focused ? colors.tertiary : colors.secondary}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ focused }) => (
            <PersonStanding
              size={28}
              name="person-standing"
              color={focused ? colors.tertiary : colors.secondary}
            />
          ),
        }}
      />
    </Tabs>
  );
}
