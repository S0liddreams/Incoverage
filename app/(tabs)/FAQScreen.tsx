import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

import { faqs } from "../../data/faqs";

export default function FAQScreen() {
  const navigation = useNavigation();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleFAQ = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleCallSupport = () => {
    Linking.openURL("tel:09123456789");
  };

  const handleEmailSupport = () => {
    Linking.openURL("mailto:support@nhis.gov.ng");
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Header — matches SearchScreen: back button + icon chip + title group */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Icon name="arrow-back" size={20} color="#0b3b5c" />
        </TouchableOpacity>
        <View style={styles.headerIconChip}>
          <Icon name="help-circle-outline" size={18} color="#0B4D3A" />
        </View>
        <View style={styles.headerTextGroup}>
          <Text style={styles.headerTitle}>FAQ & Help</Text>
          <Text style={styles.headerSubtitle}>
            Answers, guides, and ways to reach us
          </Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* FAQ Section */}
        <View style={styles.sectionTitleRow}>
          <Icon name="chatbubbles-outline" size={16} color="#0b3b5c" />
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
        </View>

        {faqs.map((faq) => (
          <View key={faq.id} style={styles.faqItem}>
            <TouchableOpacity
              style={styles.faqQuestion}
              onPress={() => toggleFAQ(faq.id)}
              activeOpacity={0.7}
            >
              <Text style={styles.faqQuestionText}>{faq.question}</Text>
              <Icon
                name={expandedId === faq.id ? "chevron-up" : "chevron-down"}
                size={18}
                color="#8a9eb0"
              />
            </TouchableOpacity>
            {expandedId === faq.id && (
              <View style={styles.faqAnswer}>
                <Text style={styles.faqAnswerText}>{faq.answer}</Text>
              </View>
            )}
          </View>
        ))}

        {/* Customer Assistance */}
        <View style={styles.assistanceCard}>
          <View style={styles.sectionTitleRow}>
            <Icon name="headset-outline" size={16} color="#0b3b5c" />
            <Text style={styles.assistanceTitle}>Customer Assistance</Text>
          </View>
          <Text style={styles.assistanceText}>
            Need help? Our support team is here for you.
          </Text>
          <View style={styles.assistanceButtons}>
            <TouchableOpacity
              style={[styles.assistanceButton, styles.callButton]}
              onPress={handleCallSupport}
              activeOpacity={0.85}
            >
              <Icon name="call-outline" size={18} color="white" />
              <Text style={styles.assistanceButtonText}>Call Support</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.assistanceButton, styles.emailButton]}
              onPress={handleEmailSupport}
              activeOpacity={0.85}
            >
              <Icon name="mail-outline" size={18} color="white" />
              <Text style={styles.assistanceButtonText}>Email Support</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* NHIS Policy Guide */}
        <View style={styles.policyCard}>
          <View style={styles.sectionTitleRow}>
            <Icon name="book-outline" size={16} color="#0b3b5c" />
            <Text style={styles.policyTitle}>NHIS Policy Guide</Text>
          </View>
          <Text style={styles.policyText}>
            The National Health Insurance Scheme (NHIS) provides health
            insurance to Nigerians. Key benefits include:
          </Text>
          <View style={styles.policyList}>
            <View style={styles.policyItem}>
              <Icon name="checkmark-circle" size={16} color="#219653" />
              <Text style={styles.policyItemText}>
                Access to accredited healthcare providers
              </Text>
            </View>
            <View style={styles.policyItem}>
              <Icon name="checkmark-circle" size={16} color="#219653" />
              <Text style={styles.policyItemText}>
                Coverage for over 80% of common medical conditions
              </Text>
            </View>
            <View style={styles.policyItem}>
              <Icon name="checkmark-circle" size={16} color="#219653" />
              <Text style={styles.policyItemText}>
                Preventive care and health education services
              </Text>
            </View>
            <View style={styles.policyItem}>
              <Icon name="checkmark-circle" size={16} color="#219653" />
              <Text style={styles.policyItemText}>
                Maternity and child health coverage
              </Text>
            </View>
            <View style={styles.policyItem}>
              <Icon name="checkmark-circle" size={16} color="#219653" />
              <Text style={styles.policyItemText}>
                Emergency and accident care
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f7fc",
  },

  // Header — same shape as SearchScreen's header, with a back button added
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 14,
    gap: 10,
  },
  backButton: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#e6edf4",
    alignItems: "center",
    justifyContent: "center",
  },
  headerIconChip: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: "#eaf3ee",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTextGroup: { flex: 1 },
  headerTitle: { fontSize: 20, fontWeight: "800", color: "#0b1a2e" },
  headerSubtitle: { fontSize: 11.5, color: "#8a9eb0", marginTop: 1 },

  scrollContent: { paddingHorizontal: 20, paddingTop: 4, paddingBottom: 32 },

  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 15, fontWeight: "800", color: "#0b1a2e" },

  // FAQ cards — restyled to match resultCard/procCard conventions
  faqItem: {
    backgroundColor: "white",
    marginBottom: 10,
    paddingHorizontal: 14,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "transparent",
    shadowColor: "#0b1a2e",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  faqQuestion: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    gap: 12,
  },
  faqQuestionText: {
    fontSize: 14.5,
    fontWeight: "700",
    color: "#0b1a2e",
    flex: 1,
  },
  faqAnswer: {
    paddingBottom: 14,
    borderTopWidth: 1,
    borderTopColor: "#f2f5f8",
    paddingTop: 10,
  },
  faqAnswerText: {
    fontSize: 13,
    color: "#6a7f92",
    lineHeight: 20,
  },

  // Customer assistance card
  assistanceCard: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#eef4f9",
    marginTop: 6,
    marginBottom: 12,
    shadowColor: "#0b1a2e",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  assistanceTitle: { fontSize: 15, fontWeight: "800", color: "#0b1a2e" },
  assistanceText: {
    fontSize: 12.5,
    color: "#8a9eb0",
    marginBottom: 14,
  },
  assistanceButtons: {
    flexDirection: "row",
    gap: 10,
  },
  assistanceButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 12,
    gap: 7,
  },
  callButton: {
    backgroundColor: "#0b3b5c",
  },
  emailButton: {
    backgroundColor: "#146c8f",
  },
  assistanceButtonText: {
    color: "white",
    fontSize: 12.5,
    fontWeight: "700",
  },

  // Policy card
  policyCard: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#0b3b5c",
    borderWidth: 1,
    borderColor: "#eef4f9",
    marginBottom: 4,
    shadowColor: "#0b1a2e",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  policyTitle: { fontSize: 15, fontWeight: "800", color: "#0b1a2e" },
  policyText: {
    fontSize: 12.5,
    color: "#6a7f92",
    lineHeight: 19,
    marginBottom: 12,
  },
  policyList: {
    gap: 9,
  },
  policyItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  policyItemText: {
    fontSize: 13,
    color: "#4a5f72",
    flex: 1,
    lineHeight: 18,
  },
});
