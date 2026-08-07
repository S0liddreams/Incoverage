import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");

interface Feature {
  id: string;
  title: string;
  description: string;
  icon: string;
  included: boolean;
}

const features: Feature[] = [
  {
    id: "ai-coverage",
    title: "AI Coverage Assistant",
    description: "Ask why something was covered or draft a claim",
    icon: "chatbubbles",
    included: true,
  },
  {
    id: "ai-digest",
    title: "AI Health Digest",
    description: "Monthly personalized coverage & usage summary",
    icon: "newspaper",
    included: true,
  },
  {
    id: "ai-report",
    title: "AI Report Reader",
    description: "Upload lab results, get plain-language reads",
    icon: "document-text",
    included: true,
  },
  {
    id: "priority-support",
    title: "Priority Customer Support",
    description: "24/7 priority support with dedicated team",
    icon: "headset",
    included: true,
  },
  {
    id: "unlimited-claims",
    title: "Unlimited Claims Assistance",
    description: "No limits on claims assistance requests",
    icon: "infinite",
    included: true,
  },
  {
    id: "family-cover",
    title: "Family Coverage Add-on",
    description: "Add up to 5 family members to your plan",
    icon: "people",
    included: true,
  },
];

const plans = [
  {
    id: "monthly",
    title: "Monthly",
    price: "₦2,500",
    period: "/month",
    popular: false,
  },
  {
    id: "yearly",
    title: "Yearly",
    price: "₦24,000",
    period: "/year",
    popular: true,
    savings: "Save 20%",
  },
];

export default function PremiumScreen() {
  const navigation = useNavigation();
  const [selectedPlan, setSelectedPlan] = useState("yearly");

  const handleSubscribe = () => {
    // Navigate to payment screen
    alert(`Subscribing to ${selectedPlan} plan...`);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color="#0b3b5c" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Premium</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <LinearGradient
          colors={["#0b3b5c", "#146c8f"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroSection}
        >
          <View style={styles.heroIconContainer}>
            <Icon name="diamond" size={40} color="#FFD700" />
          </View>
          <Text style={styles.heroTitle}>Unlock Premium Benefits</Text>
          <Text style={styles.heroSubtitle}>
            Get access to AI-powered tools and premium features to manage your
            health insurance effortlessly.
          </Text>
        </LinearGradient>

        {/* Features List */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionLabel}>PREMIUM FEATURES</Text>
          {features.map((feature) => (
            <View key={feature.id} style={styles.featureItem}>
              <View style={styles.featureIconContainer}>
                <Icon name={feature.icon} size={20} color="#0b3b5c" />
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>
                  {feature.description}
                </Text>
              </View>
              <Icon name="checkmark-circle" size={20} color="#219653" />
            </View>
          ))}
        </View>

        {/* Pricing Plans */}
        <View style={styles.pricingSection}>
          <Text style={styles.sectionLabel}>CHOOSE YOUR PLAN</Text>
          <View style={styles.plansContainer}>
            {plans.map((plan) => (
              <TouchableOpacity
                key={plan.id}
                style={[
                  styles.planCard,
                  selectedPlan === plan.id && styles.planCardSelected,
                ]}
                onPress={() => setSelectedPlan(plan.id)}
                activeOpacity={0.7}
              >
                {plan.popular && (
                  <View style={styles.popularBadge}>
                    <Text style={styles.popularBadgeText}>Popular</Text>
                  </View>
                )}
                <Text style={styles.planTitle}>{plan.title}</Text>
                <Text style={styles.planPrice}>
                  {plan.price}
                  <Text style={styles.planPeriod}>{plan.period}</Text>
                </Text>
                {plan.savings && (
                  <Text style={styles.planSavings}>{plan.savings}</Text>
                )}
                {selectedPlan === plan.id && (
                  <View style={styles.planCheck}>
                    <Icon name="checkmark" size={14} color="white" />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Subscribe Button */}
        <LinearGradient
          colors={["#0b3b5c", "#146c8f"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.subscribeButton}
        >
          <TouchableOpacity
            style={styles.subscribeTouchable}
            onPress={handleSubscribe}
            activeOpacity={0.8}
          >
            <Icon name="lock-open" size={20} color="white" />
            <Text style={styles.subscribeText}>Subscribe Now</Text>
          </TouchableOpacity>
        </LinearGradient>

        <Text style={styles.footerText}>
          Cancel anytime. No questions asked. Secure payment.
        </Text>

        <View style={styles.footerSpace} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f7fc",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#eef4f9",
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0b1a2e",
  },
  heroSection: {
    marginHorizontal: 20,
    marginTop: 16,
    padding: 24,
    borderRadius: 20,
    alignItems: "center",
    marginBottom: 20,
  },
  heroIconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "white",
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    textAlign: "center",
    lineHeight: 22,
  },
  featuresSection: {
    backgroundColor: "white",
    marginHorizontal: 20,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#eef4f9",
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 11.5,
    fontWeight: "700",
    color: "#8a9eb0",
    letterSpacing: 0.6,
    marginBottom: 10,
    marginTop: 12,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f2f5f8",
  },
  featureIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#eaf1f7",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0b1a2e",
  },
  featureDescription: {
    fontSize: 12,
    color: "#8a9eb0",
    marginTop: 1,
  },
  pricingSection: {
    backgroundColor: "white",
    marginHorizontal: 20,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#eef4f9",
    marginBottom: 20,
  },
  plansContainer: {
    flexDirection: "row",
    gap: 10,
    marginVertical: 8,
  },
  planCard: {
    flex: 1,
    padding: 16,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "#eef4f9",
    alignItems: "center",
    position: "relative",
  },
  planCardSelected: {
    borderColor: "#0b3b5c",
    backgroundColor: "#f0f7fe",
  },
  popularBadge: {
    position: "absolute",
    top: -10,
    backgroundColor: "#7c3aed",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  popularBadgeText: {
    color: "white",
    fontSize: 9,
    fontWeight: "700",
  },
  planTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0b1a2e",
    marginBottom: 6,
  },
  planPrice: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0b3b5c",
  },
  planPeriod: {
    fontSize: 12,
    fontWeight: "500",
    color: "#8a9eb0",
  },
  planSavings: {
    fontSize: 11,
    color: "#219653",
    fontWeight: "600",
    marginTop: 4,
  },
  planCheck: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#0b3b5c",
    alignItems: "center",
    justifyContent: "center",
  },
  subscribeButton: {
    marginHorizontal: 20,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 12,
  },
  subscribeTouchable: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 18,
    gap: 10,
  },
  subscribeText: {
    fontSize: 17,
    fontWeight: "700",
    color: "white",
  },
  footerText: {
    textAlign: "center",
    fontSize: 13,
    color: "#8a9eb0",
    marginBottom: 16,
  },
  footerSpace: {
    height: 24,
  },
});
