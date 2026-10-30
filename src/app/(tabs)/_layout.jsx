import TopTabs from "expo-router/js-top-tabs";
import { House, PersonStanding, Cog, Dumbbell } from "lucide-react-native";
import { colors } from "../../theme";

//TopTabs allows swiping left/right, the bar is kept at the bottom
export default function TabLayout() {
  return (
    <TopTabs
      tabBarPosition="bottom"
      screenOptions={{
        tabBarActiveTintColor: colors.tertiary,
        tabBarInactiveTintColor: colors.secondary,
        tabBarShowIcon: true,
        tabBarIndicatorStyle: { height: 0 },
        tabBarLabelStyle: { textTransform: "none", fontSize: 11 },
        tabBarItemStyle: { paddingTop: 0 },
        tabBarStyle: {
          backgroundColor: colors.primary,
          elevation: 0,
          shadowOpacity: 0,
          paddingTop: 6,
          //Space for the iPhone home bar
          paddingBottom: 18,
        },
        sceneStyle: {
          backgroundColor: colors.primary,
        },
      }}
    >
      <TopTabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <House size={28} name="house" color={color} />
          ),
        }}
      />
      <TopTabs.Screen
        name="workoutTab"
        options={{
          title: "Workout",
          tabBarIcon: ({ color }) => (
            <Dumbbell size={28} name="dumbbell" color={color} />
          ),
        }}
      />
      <TopTabs.Screen
        name="profileTab"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <PersonStanding size={28} name="person-standing" color={color} />
          ),
        }}
      />
      <TopTabs.Screen
        name="settingsTab"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => <Cog size={28} name="cog" color={color} />,
        }}
      />
    </TopTabs>
  );
}
