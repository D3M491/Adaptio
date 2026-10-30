import { View, StyleSheet } from "react-native";
import { useId } from "react";
import Svg, { Defs, RadialGradient, Stop, Rect } from "react-native-svg";
import { useColors } from "../../theme";

//The colored lights behind the glass cards: a red one at the top right and a violet one at the
//bottom left, soft radial gradients. Put it as the first child of a screen: the screen gives
//the base color, this draws only the lights and doesn't take touches.
export default function GlassBackground() {
  const colors = useColors();
  //The ids of the gradients must be different for every use of the component
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  const red = `red${id}`;
  const violet = `violet${id}`;

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <Svg width="100%" height="100%">
        <Defs>
          <RadialGradient id={red} cx="88%" cy="18%" rx="62%" ry="34%">
            <Stop
              offset="0"
              stopColor={colors.glowRed}
              stopOpacity={colors.glowRedOpacity}
            />
            <Stop offset="1" stopColor={colors.glowRed} stopOpacity="0" />
          </RadialGradient>
          <RadialGradient id={violet} cx="8%" cy="82%" rx="68%" ry="36%">
            <Stop
              offset="0"
              stopColor={colors.glowViolet}
              stopOpacity={colors.glowVioletOpacity}
            />
            <Stop offset="1" stopColor={colors.glowViolet} stopOpacity="0" />
          </RadialGradient>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" fill={`url(#${red})`} />
        <Rect x="0" y="0" width="100%" height="100%" fill={`url(#${violet})`} />
      </Svg>
    </View>
  );
}
