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
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.back()}>
          <Icon name="arrow-back" size={24} color="#0b3b5c" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          <Icon name="help-circle" size={24} color="#0b3b5c" /> FAQ & Help
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* FAQ Section */}
        <Text style={styles.sectionTitle}>
          <Icon name="chatbubbles" size={18} color="#0b3b5c" /> Frequently Asked
          Questions
        </Text>

        {faqs.map((faq) => (
          <View key={faq.id} style={styles.faqItem}>
            <TouchableOpacity
              style={styles.faqQuestion}
              onPress={() => toggleFAQ(faq.id)}
            >
              <Text style={styles.faqQuestionText}>{faq.question}</Text>
              <Icon
                name={expandedId === faq.id ? "chevron-up" : "chevron-down"}
                size={20}
                color="#1a6d8a"
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
          <Text style={styles.assistanceTitle}>
            <Icon name="headset" size={20} color="#0b3b5c" /> Customer
            Assistance
          </Text>
          <Text style={styles.assistanceText}>
            Need help? Our support team is here for you.
          </Text>
          <View style={styles.assistanceButtons}>
            <TouchableOpacity
              style={[styles.assistanceButton, styles.callButton]}
              onPress={handleCallSupport}
            >
              <Icon name="call" size={20} color="white" />
              <Text style={styles.assistanceButtonText}>Call Support</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.assistanceButton, styles.emailButton]}
              onPress={handleEmailSupport}
            >
              <Icon name="mail" size={20} color="white" />
              <Text style={styles.assistanceButtonText}>Email Support</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* NHIS Policy Guide */}
        <View style={styles.policyCard}>
          <Text style={styles.policyTitle}>
            <Icon name="book" size={18} color="#0b3b5c" /> NHIS Policy Guide
          </Text>
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
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0b1a2e",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0b1a2e",
    marginHorizontal: 20,
    marginBottom: 12,
  },
  faqItem: {
    backgroundColor: "white",
    marginHorizontal: 20,
    marginBottom: 8,
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#eef4f9",
  },
  faqQuestion: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  faqQuestionText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#0b1a2e",
    flex: 1,
    marginRight: 12,
  },
  faqAnswer: {
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: "#eef4f9",
    paddingTop: 12,
  },
  faqAnswerText: {
    fontSize: 14,
    color: "#4a5f72",
    lineHeight: 22,
  },
  assistanceCard: {
    backgroundColor: "#f0f7fe",
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#d0e0ec",
    marginTop: 16,
    marginBottom: 12,
  },
  assistanceTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0b1a2e",
    marginBottom: 8,
  },
  assistanceText: {
    fontSize: 14,
    color: "#4a5f72",
    marginBottom: 16,
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
    padding: 14,
    borderRadius: 14,
    gap: 8,
  },
  callButton: {
    backgroundColor: "#0b3b5c",
  },
  emailButton: {
    backgroundColor: "#1a6d8a",
  },
  assistanceButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  policyCard: {
    backgroundColor: "white",
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#0b3b5c",
    marginBottom: 16,
  },
  policyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0b1a2e",
    marginBottom: 8,
  },
  policyText: {
    fontSize: 14,
    color: "#4a5f72",
    lineHeight: 22,
    marginBottom: 12,
  },
  policyList: {
    gap: 8,
  },
  policyItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  policyItemText: {
    fontSize: 14,
    color: "#4a5f72",
    flex: 1,
  },
  footerSpace: {
    height: 24,
  },
});
