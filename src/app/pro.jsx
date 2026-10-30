import { View, Text, ScrollView, Pressable, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Crown,
  X,
  Sparkles,
  TrendingUp,
  TrendingDown,
  ClipboardList,
  ChartLine,
  Check,
} from "lucide-react-native";
import { colors } from "../theme";

//Todo final prices and trial length
const TRIAL_DAYS = 7;

const PLANS = [
  { id: "yearly", label: "Annuale", price: "€39,99/anno", note: "€3,33/mese" },
  { id: "monthly", label: "Mensile", price: "€5,99/mese", note: null },
];

//Examples of AI suggestions shown in the main card
const AI_EXAMPLES = [
  {
    exercise: "Panca piana",
    last: "80kg x 8 @ RPE 7",
    suggestion: "82.5kg",
    up: true,
  },
  {
    exercise: "Squat",
    last: "100kg x 5 @ RPE 9.5",
    suggestion: "95kg",
    up: false,
  },
  {
    exercise: "Stacco da terra",
    last: "140kg x 5 @ RPE 7",
    suggestion: "140kg x 6",
    up: true,
  },
];

const BENEFITS = [
  {
    Icon: ClipboardList,
    title: "Schede esclusive",
    text: "Programmi creati da coach per forza, ipertrofia e ricomposizione",
  },
  {
    Icon: ChartLine,
    title: "Statistiche avanzate",
    text: "Massimali stimati, volume settimanale e andamento di ogni esercizio",
  },
];

export default function Pro() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState(PLANS[0].id);

  return (
    <SafeAreaView style={styles.body}>
      <Pressable
        hitSlop={10}
        style={styles.closeButton}
        onPress={() => router.back()}
      >
        <X size={26} color={colors.secondary} />
      </Pressable>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <View style={styles.crownCircle}>
            <Crown size={36} color={colors.pro} fill={colors.pro} />
          </View>
          <Text style={styles.title}>
            Adaptio <Text style={styles.titlePro}>PRO</Text>
          </Text>
          <Text style={styles.subtitle}>
            Allenati sempre con il carico giusto
          </Text>
        </View>

        {/* Main feature: AI progressions */}
        <View style={styles.aiCard}>
          <View style={styles.aiHeader}>
            <Sparkles size={22} color={colors.pro} />
            <Text style={styles.aiTitle}>Progressioni con l'AI</Text>
          </View>
          <Text style={styles.aiText}>
            Dopo ogni allenamento l'AI analizza serie, ripetizioni e RPE e ti
            dice quanto caricare la volta successiva, quando aggiungere
            ripetizioni o quando scaricare per recuperare
          </Text>

          {AI_EXAMPLES.map((example) => {
            const TrendIcon = example.up ? TrendingUp : TrendingDown;
            return (
              <View key={example.exercise} style={styles.aiExample}>
                <View>
                  <Text style={styles.exampleName}>{example.exercise}</Text>
                  <Text style={styles.exampleLast}>
                    Ultima: {example.last}
                  </Text>
                </View>
                <View style={styles.exampleSuggestion}>
                  <TrendIcon
                    size={16}
                    color={example.up ? colors.pro : colors.tertiary}
                  />
                  <Text
                    style={[
                      styles.exampleWeight,
                      !example.up && styles.exampleWeightDown,
                    ]}
                  >
                    {example.suggestion}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>

        {BENEFITS.map(({ Icon, title, text }) => (
          <View key={title} style={styles.benefit}>
            <View style={styles.benefitIcon}>
              <Icon size={20} color={colors.pro} />
            </View>
            <View style={styles.benefitBody}>
              <Text style={styles.benefitTitle}>{title}</Text>
              <Text style={styles.benefitText}>{text}</Text>
            </View>
          </View>
        ))}

        <Text style={styles.sectionText}>SCEGLI IL PIANO</Text>
        {PLANS.map((plan) => {
          const selected = plan.id === selectedPlan;
          return (
            <Pressable
              key={plan.id}
              onPress={() => setSelectedPlan(plan.id)}
              style={[styles.plan, selected && styles.planSelected]}
            >
              <View style={[styles.radio, selected && styles.radioSelected]}>
                {selected && <Check size={14} color={colors.secondary} />}
              </View>
              <Text style={styles.planLabel}>{plan.label}</Text>
              <View style={styles.planPrices}>
                <Text style={styles.planPrice}>{plan.price}</Text>
                {plan.note && <Text style={styles.planNote}>{plan.note}</Text>}
              </View>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Todo connect payment */}
      <View style={styles.footer}>
        <Pressable
          style={({ pressed }) => [styles.cta, pressed && styles.pressed]}
        >
          <Text style={styles.ctaText}>Prova gratis per {TRIAL_DAYS} giorni</Text>
        </Pressable>
        <Text style={styles.footerNote}>
          Nessun addebito oggi · Disdici quando vuoi
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: colors.primary,
  },

  closeButton: {
    alignSelf: "flex-end",
    padding: 20,
    paddingBottom: 0,
  },

  content: {
    padding: 20,
    gap: 12,
  },

  hero: {
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },

  crownCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.pro,
    backgroundColor: colors.proLight,
  },

  title: {
    color: colors.secondary,
    fontSize: 28,
    fontWeight: "700",
  },

  titlePro: {
    color: colors.pro,
  },

  subtitle: {
    color: colors.secondaryDark,
    fontSize: 16,
  },

  aiCard: {
    padding: 20,
    gap: 12,
    borderWidth: 1,
    borderColor: colors.pro,
    borderRadius: 14,
    backgroundColor: colors.proLight,
  },

  aiHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  aiTitle: {
    color: colors.secondary,
    fontSize: 18,
    fontWeight: "700",
  },

  aiText: {
    color: colors.secondary,
    opacity: 0.8,
    lineHeight: 20,
  },

  aiExample: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderRadius: 10,
    backgroundColor: colors.primary,
  },

  exampleName: {
    color: colors.secondary,
  },

  exampleLast: {
    color: colors.secondaryDark,
    fontSize: 12,
  },

  exampleSuggestion: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  exampleWeight: {
    color: colors.pro,
    fontSize: 16,
    fontWeight: "700",
  },

  exampleWeightDown: {
    color: colors.tertiary,
  },

  benefit: {
    flexDirection: "row",
    gap: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.secondaryDark,
    borderRadius: 14,
  },

  benefitIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.proLight,
  },

  benefitBody: {
    flex: 1,
    gap: 2,
  },

  benefitTitle: {
    color: colors.secondary,
    fontWeight: "600",
  },

  benefitText: {
    color: colors.secondaryDark,
  },

  sectionText: {
    color: colors.secondaryDark,
    marginTop: 12,
  },

  plan: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.secondaryDark,
    borderRadius: 14,
  },

  planSelected: {
    borderColor: colors.pro,
    backgroundColor: colors.proLight,
  },

  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: colors.secondaryDark,
    alignItems: "center",
    justifyContent: "center",
  },

  radioSelected: {
    borderColor: colors.pro,
    backgroundColor: colors.pro,
  },

  planLabel: {
    flex: 1,
    color: colors.secondary,
    fontSize: 16,
  },

  planPrices: {
    alignItems: "flex-end",
  },

  planPrice: {
    color: colors.secondary,
    fontWeight: "600",
  },

  planNote: {
    color: colors.secondaryDark,
    fontSize: 12,
  },

  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    gap: 8,
  },

  cta: {
    alignItems: "center",
    paddingVertical: 16,
    borderRadius: 14,
    backgroundColor: colors.pro,
  },

  pressed: {
    opacity: 0.7,
  },

  ctaText: {
    color: colors.secondary,
    fontSize: 16,
    fontWeight: "700",
  },

  footerNote: {
    color: colors.secondaryDark,
    fontSize: 12,
    textAlign: "center",
  },
});
