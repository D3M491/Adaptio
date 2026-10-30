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
import { useColors, useStyles, glassCard } from "../theme";
import { useT, entryName } from "../i18n";
import GlassBackground from "./components/GlassBackground";

//Todo final prices and trial length
const TRIAL_DAYS = 7;

//label, price and note are keys of the texts (src/i18n)
const PLANS = [
  {
    id: "yearly",
    label: "pro.plans.yearly",
    price: "pro.plans.yearlyPrice",
    note: "pro.plans.yearlyNote",
  },
  {
    id: "monthly",
    label: "pro.plans.monthly",
    price: "pro.plans.monthlyPrice",
    note: null,
  },
];

//Examples of AI suggestions shown in the main card (exercise is the name of a max, translated when shown)
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
    exercise: "Stacco",
    last: "140kg x 5 @ RPE 7",
    suggestion: "140kg x 6",
    up: true,
  },
];

const BENEFITS = [
  {
    Icon: ClipboardList,
    title: "pro.benefits.plansTitle",
    text: "pro.benefits.plansText",
  },
  {
    Icon: ChartLine,
    title: "pro.benefits.statsTitle",
    text: "pro.benefits.statsText",
  },
];

export default function Pro() {
  const colors = useColors();
  const styles = useStyles(createStyles);
  const t = useT();
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState(PLANS[0].id);

  return (
    <SafeAreaView style={styles.body}>
      <GlassBackground />
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
          <Text style={styles.subtitle}>{t("pro.subtitle")}</Text>
        </View>

        {/* Main feature: AI progressions */}
        <View style={styles.aiCard}>
          <View style={styles.aiHeader}>
            <Sparkles size={22} color={colors.pro} />
            <Text style={styles.aiTitle}>{t("pro.aiTitle")}</Text>
          </View>
          <Text style={styles.aiText}>{t("pro.aiText")}</Text>

          {AI_EXAMPLES.map((example) => {
            const TrendIcon = example.up ? TrendingUp : TrendingDown;
            return (
              <View key={example.exercise} style={styles.aiExample}>
                <View>
                  <Text style={styles.exampleName}>
                    {entryName(t, example.exercise)}
                  </Text>
                  <Text style={styles.exampleLast}>
                    {t("pro.last", { value: example.last })}
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
              <Text style={styles.benefitTitle}>{t(title)}</Text>
              <Text style={styles.benefitText}>{t(text)}</Text>
            </View>
          </View>
        ))}

        <Text style={styles.sectionText}>{t("pro.choosePlan")}</Text>
        {PLANS.map((plan) => {
          const selected = plan.id === selectedPlan;
          return (
            <Pressable
              key={plan.id}
              onPress={() => setSelectedPlan(plan.id)}
              style={[styles.plan, selected && styles.planSelected]}
            >
              <View style={[styles.radio, selected && styles.radioSelected]}>
                {selected && <Check size={14} color={colors.onTertiary} />}
              </View>
              <Text style={styles.planLabel}>{t(plan.label)}</Text>
              <View style={styles.planPrices}>
                <Text style={styles.planPrice}>{t(plan.price)}</Text>
                {plan.note && (
                  <Text style={styles.planNote}>{t(plan.note)}</Text>
                )}
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
          <Text style={styles.ctaText}>
            {t("pro.trial", { days: TRIAL_DAYS })}
          </Text>
        </Pressable>
        <Text style={styles.footerNote}>{t("pro.footerNote")}</Text>
      </View>
    </SafeAreaView>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
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
      ...glassCard(colors),
      borderRadius: 18,
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
      ...glassCard(colors),
      borderRadius: 18,
    },

    planSelected: {
      borderColor: colors.pro,
      borderTopColor: colors.pro,
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
      color: colors.onTertiary,
      fontSize: 16,
      fontWeight: "700",
    },

    footerNote: {
      color: colors.secondaryDark,
      fontSize: 12,
      textAlign: "center",
    },
  });
