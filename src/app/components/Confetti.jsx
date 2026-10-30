import {
  View,
  Animated,
  Easing,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import { useEffect, useState } from "react";
import { colors } from "../../theme";

const PIECES = 60;
//The same in every theme: no white, it wouldn't show on the light one
const CONFETTI_COLORS = [colors.tertiary, colors.pro, "#f5c542", "#3b82f6"];

function random(min, max) {
  return min + Math.random() * (max - min);
}

//One-shot confetti falling from the top of the screen, doesn't block touches
export default function Confetti() {
  const { width, height } = useWindowDimensions();

  //Random look and path for every piece, created once
  const [pieces] = useState(() =>
    Array.from({ length: PIECES }, () => ({
      progress: new Animated.Value(0),
      x: random(0, width),
      drift: random(-60, 60),
      spins: random(2, 6) * (Math.random() < 0.5 ? -1 : 1),
      size: random(6, 11),
      color: CONFETTI_COLORS[Math.floor(random(0, CONFETTI_COLORS.length))],
      delay: random(0, 400),
      duration: random(2200, 3600),
    })),
  );

  useEffect(() => {
    Animated.parallel(
      pieces.map((piece) =>
        Animated.timing(piece.progress, {
          toValue: 1,
          duration: piece.duration,
          delay: piece.delay,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ),
    ).start();
  }, [pieces]);

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {pieces.map((piece, i) => (
        <Animated.View
          key={i}
          style={{
            position: "absolute",
            top: -20,
            left: piece.x,
            width: piece.size,
            height: piece.size * 1.6,
            borderRadius: 2,
            backgroundColor: piece.color,
            //Fade out in the last part of the fall
            opacity: piece.progress.interpolate({
              inputRange: [0, 0.8, 1],
              outputRange: [1, 1, 0],
            }),
            transform: [
              {
                translateY: piece.progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, height + 40],
                }),
              },
              {
                translateX: piece.progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, piece.drift],
                }),
              },
              {
                rotate: piece.progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: ["0deg", `${piece.spins * 360}deg`],
                }),
              },
            ],
          }}
        />
      ))}
    </View>
  );
}
