import TopTabs from "expo-router/js-top-tabs";
import { House, PersonStanding, Cog, Dumbbell } from "lucide-react-native";
import { useColors } from "../../theme";
import GlassTabBar from "../components/GlassTabBar";
import { useT } from "../../i18n";

//TopTabs allows swiping left/right, the bar is kept at the bottom
export default function TabLayout() {
  const colors = useColors();
  const t = useT();
  return (
    <TopTabs
      tabBarPosition="bottom"
      //The bar is a glass pill floating over the screens
      tabBar={(props) => <GlassTabBar {...props} />}
      screenOptions={{
        sceneStyle: {
          backgroundColor: colors.primary,
        },
      }}
    >
      <TopTabs.Screen
        name="index"
        options={{
          title: t("tabs.home"),
          tabBarIcon: ({ color }) => (
            <House size={28} name="house" color={color} />
          ),
        }}
      />
      <TopTabs.Screen
        name="workoutTab"
        options={{
          title: t("tabs.workout"),
          tabBarIcon: ({ color }) => (
            <Dumbbell size={28} name="dumbbell" color={color} />
          ),
        }}
      />
      <TopTabs.Screen
        name="profileTab"
        options={{
          title: t("tabs.profile"),
          tabBarIcon: ({ color }) => (
            <PersonStanding size={28} name="person-standing" color={color} />
          ),
        }}
      />
      <TopTabs.Screen
        name="settingsTab"
        options={{
          title: t("tabs.settings"),
          tabBarIcon: ({ color }) => <Cog size={28} name="cog" color={color} />,
        }}
      />
    </TopTabs>
  );
}
