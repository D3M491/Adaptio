import { Animated, Easing, Image, StyleSheet, View } from "react-native";
import { createContext, useContext, useRef } from "react";
import * as SplashScreen from "expo-splash-screen";
import { colors } from "../../theme";

//True once the intro is over, so screens under it can wait before opening the keyboard
export const IntroContext = createContext(true);

export function useIntroDone() {
  return useContext(IntroContext);
}

//Il simbolo ha la stessa larghezza dello splash nativo (imageWidth in app.json),
//cosi' l'animazione parte senza salti dal logo gia' visibile
const SYMBOL_WIDTH = 120;
const SYMBOL_HEIGHT = SYMBOL_WIDTH * (316 / 573);
const WORDMARK_WIDTH = 230;
const WORDMARK_HEIGHT = WORDMARK_WIDTH * (70 / 735);
const GAP = 12;

//Quanto sale il simbolo per tenere centrato il logo completo
const SHIFT = (GAP + WORDMARK_HEIGHT) / 2;

//Colonne (in pixel dell'immagine logo-wordmark, larga 735) di ogni lettera di ADAPTIO
const LETTERS = [
  [4, 95],
  [140, 217],
  [256, 343],
  [386, 454],
  [491, 557],
  [600, 613],
  [655, 731],
];
const WORDMARK_SCALE = WORDMARK_WIDTH / 735;

export default function Intro({ onFinish }) {
  const shift = useRef(new Animated.Value(0)).current;
  const letters = useRef(LETTERS.map(() => new Animated.Value(0))).current;
  const overlay = useRef(new Animated.Value(1)).current;

  //Parte quando il simbolo e' caricato: toglie lo splash nativo e anima
  const start = () => {
    SplashScreen.hideAsync();

    Animated.sequence([
      Animated.delay(400),
      Animated.parallel([
        Animated.timing(shift, {
          toValue: 1,
          duration: 500,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        //Le lettere compaiono una dopo l'altra, da sinistra a destra
        Animated.sequence([
          Animated.delay(200),
          Animated.stagger(
            80,
            letters.map((letter) =>
              Animated.timing(letter, {
                toValue: 1,
                duration: 170,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
              }),
            ),
          ),
        ]),
      ]),
      Animated.delay(800),
      Animated.timing(overlay, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start(() => onFinish());
  };

  return (
    <Animated.View
      style={[styles.container, { opacity: overlay }]}
      pointerEvents="none"
    >
      <Animated.Image
        source={require("../../../assets/images/logo-symbol.png")}
        onLoadEnd={start}
        style={[
          styles.symbol,
          {
            transform: [
              {
                translateY: shift.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -SHIFT],
                }),
              },
            ],
          },
        ]}
      />
      <View style={styles.wordmark}>
        {LETTERS.map(([from, to], index) => (
          <Animated.View
            key={from}
            style={[
              styles.letter,
              {
                left: from * WORDMARK_SCALE,
                width: (to - from) * WORDMARK_SCALE,
                opacity: letters[index],
                transform: [
                  {
                    translateY: letters[index].interpolate({
                      inputRange: [0, 1],
                      outputRange: [6, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            {/* Ogni lettera e' un ritaglio dell'immagine intera */}
            <Image
              source={require("../../../assets/images/logo-wordmark.png")}
              style={[styles.letterImage, { left: -from * WORDMARK_SCALE }]}
            />
          </Animated.View>
        ))}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },

  symbol: {
    width: SYMBOL_WIDTH,
    height: SYMBOL_HEIGHT,
  },

  wordmark: {
    position: "absolute",
    top: "50%",
    marginTop: SYMBOL_HEIGHT / 2 + GAP,
    width: WORDMARK_WIDTH,
    height: WORDMARK_HEIGHT,
  },

  letter: {
    position: "absolute",
    top: 0,
    height: WORDMARK_HEIGHT,
    overflow: "hidden",
  },

  letterImage: {
    position: "absolute",
    top: 0,
    width: WORDMARK_WIDTH,
    height: WORDMARK_HEIGHT,
  },
});
