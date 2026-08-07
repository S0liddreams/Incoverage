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

interface DigestData {
  month: string;
  year: number;
  claims: {
    total: number;
    approved: number;
    denied: number;
    pending: number;
  };
  medications: {
    total: number;
    covered: number;
    outOfPocket: number;
  };
  appointments: {
    total: number;
    attended: number;
    missed: number;
  };
  savings: number;
  topConditions: string[];
}

const mockDigest: DigestData = {
  month: "March",
  year: 2026,
  claims: {
    total: 8,
    approved: 6,
    denied: 1,
    pending: 1,
  },
  medications: {
    total: 12,
    covered: 10,
    outOfPocket: 2,
  },
  appointments: {
    total: 4,
    attended: 3,
    missed: 1,
  },
  savings: 245000,
  topConditions: ["Hypertension", "Malaria", "Respiratory Infection"],
};

export default function AIHealthDigest() {
  const navigation = useNavigation();
  const [selectedMonth, setSelectedMonth] = useState(0);
  const [digest, setDigest] = useState(mockDigest);

  // In a real app, you'd fetch data for different months
  const months = ["Mar", "Feb", "Jan", "Dec"];

  const StatCard = ({
    icon,
    value,
    label,
    color,
    bgColor,
  }: {
    icon: string;
    value: string | number;
    label: string;
    color: string;
    bgColor: string;
  }) => (
    <View style={[styles.statCard, { backgroundColor: bgColor }]}>
      <Icon name={icon} size={22} color={color} />
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color="#0b3b5c" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>AI Health Digest</Text>
        <TouchableOpacity style={styles.calendarButton}>
          <Icon name="calendar-outline" size={22} color="#0b3b5c" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Month Selector */}
        <View style={styles.monthSelector}>
          {months.map((month, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.monthChip,
                selectedMonth === index && styles.monthChipActive,
              ]}
              onPress={() => setSelectedMonth(index)}
            >
              <Text
                style={[
                  styles.monthChipText,
                  selectedMonth === index && styles.monthChipTextActive,
                ]}
              >
                {month}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Summary Card */}
        <LinearGradient
          colors={["#0b3b5c", "#146c8f"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.summaryCard}
        >
          <Text style={styles.summaryTitle}>
            {digest.month} {digest.year} Summary
          </Text>
          <View style={styles.savingsContainer}>
            <Text style={styles.savingsLabel}>Total Savings</Text>
            <Text style={styles.savingsValue}>
              ₦{digest.savings.toLocaleString()}
            </Text>
          </View>
          <View style={styles.summaryStats}>
            <View style={styles.summaryStat}>
              <Text style={styles.summaryStatValue}>{digest.claims.total}</Text>
              <Text style={styles.summaryStatLabel}>Total Claims</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryStat}>
              <Text style={[styles.summaryStatValue, styles.approvedColor]}>
                {digest.claims.approved}
              </Text>
              <Text style={styles.summaryStatLabel}>Approved</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryStat}>
              <Text style={[styles.summaryStatValue, styles.deniedColor]}>
                {digest.claims.denied}
              </Text>
              <Text style={styles.summaryStatLabel}>Denied</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Claims Stats */}
        <Text style={styles.sectionLabel}>CLAIMS OVERVIEW</Text>
        <View style={styles.statsGrid}>
          <StatCard
            icon="checkmark-circle"
            value={digest.claims.approved}
            label="Approved"
            color="#219653"
            bgColor="#eaf6ed"
          />
          <StatCard
            icon="close-circle"
            value={digest.claims.denied}
            label="Denied"
            color="#dc2626"
            bgColor="#fce8ee"
          />
          <StatCard
            icon="time"
            value={digest.claims.pending}
            label="Pending"
            color="#d97706"
            bgColor="#fef3e2"
          />
        </View>

        {/* Medications */}
        <Text style={styles.sectionLabel}>MEDICATIONS</Text>
        <View style={styles.medicationCard}>
          <View style={styles.medicationRow}>
            <View style={styles.medicationInfo}>
              <Text style={styles.medicationNumber}>
                {digest.medications.total}
              </Text>
              <Text style={styles.medicationLabel}>Total Prescriptions</Text>
            </View>
            <View style={styles.medicationDivider} />
            <View style={styles.medicationInfo}>
              <Text style={[styles.medicationNumber, styles.coveredColor]}>
                {digest.medications.covered}
              </Text>
              <Text style={styles.medicationLabel}>Covered</Text>
            </View>
            <View style={styles.medicationDivider} />
            <View style={styles.medicationInfo}>
              <Text style={[styles.medicationNumber, styles.outOfPocketColor]}>
                {digest.medications.outOfPocket}
              </Text>
              <Text style={styles.medicationLabel}>Out of Pocket</Text>
            </View>
          </View>
        </View>

        {/* Appointments */}
        <Text style={styles.sectionLabel}>APPOINTMENTS</Text>
        <View style={styles.appointmentCard}>
          <View style={styles.appointmentRow}>
            <View style={styles.appointmentInfo}>
              <Text style={styles.appointmentNumber}>
                {digest.appointments.total}
              </Text>
              <Text style={styles.appointmentLabel}>Total</Text>
            </View>
            <View style={styles.appointmentDivider} />
            <View style={styles.appointmentInfo}>
              <Text style={[styles.appointmentNumber, styles.attendedColor]}>
                {digest.appointments.attended}
              </Text>
              <Text style={styles.appointmentLabel}>Attended</Text>
            </View>
            <View style={styles.appointmentDivider} />
            <View style={styles.appointmentInfo}>
              <Text style={[styles.appointmentNumber, styles.missedColor]}>
                {digest.appointments.missed}
              </Text>
              <Text style={styles.appointmentLabel}>Missed</Text>
            </View>
          </View>
        </View>

        {/* Top Conditions */}
        <Text style={styles.sectionLabel}>TOP CONDITIONS</Text>
        <View style={styles.conditionsCard}>
          {digest.topConditions.map((condition, index) => (
            <View key={index} style={styles.conditionItem}>
              <View style={styles.conditionRank}>
                <Text style={styles.conditionRankText}>#{index + 1}</Text>
              </View>
              <Text style={styles.conditionName}>{condition}</Text>
              <View style={styles.conditionBar}>
                <View
                  style={[
                    styles.conditionBarFill,
                    { width: `${Math.random() * 40 + 60}%` },
                  ]}
                />
              </View>
            </View>
          ))}
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
    fontSize: 18,
    fontWeight: "700",
    color: "#0b1a2e",
  },
  calendarButton: {
    padding: 4,
  },
  monthSelector: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginTop: 16,
    marginBottom: 16,
    gap: 8,
  },
  monthChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#e6edf4",
  },
  monthChipActive: {
    backgroundColor: "#0b3b5c",
    borderColor: "#0b3b5c",
  },
  monthChipText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#8a9eb0",
  },
  monthChipTextActive: {
    color: "white",
  },
  summaryCard: {
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "white",
    marginBottom: 12,
  },
  savingsContainer: {
    backgroundColor: "rgba(255,255,255,0.12)",
    padding: 16,
    borderRadius: 14,
    marginBottom: 16,
  },
  savingsLabel: {
    fontSize: 13,
    color: "rgba(255,255,255,0.7)",
  },
  savingsValue: {
    fontSize: 28,
    fontWeight: "800",
    color: "white",
    marginTop: 2,
  },
  summaryStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "rgba(255,255,255,0.08)",
    paddingVertical: 12,
    borderRadius: 14,
  },
  summaryStat: {
    alignItems: "center",
    flex: 1,
  },
  summaryStatValue: {
    fontSize: 22,
    fontWeight: "800",
    color: "white",
  },
  approvedColor: {
    color: "#6fcf97",
  },
  deniedColor: {
    color: "#f28b82",
  },
  summaryStatLabel: {
    fontSize: 12,
    color: "rgba(255,255,255,0.6)",
    marginTop: 2,
  },
  summaryDivider: {
    width: 1,
    backgroundColor: "rgba(255,255,255,0.15)",
  },
  sectionLabel: {
    fontSize: 11.5,
    fontWeight: "700",
    color: "#8a9eb0",
    letterSpacing: 0.6,
    marginBottom: 10,
    marginLeft: 22,
  },
  statsGrid: {
    flexDirection: "row",
    gap: 10,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    padding: 14,
    borderRadius: 16,
    alignItems: "center",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "800",
    marginTop: 4,
  },
  statLabel: {
    fontSize: 11,
    color: "#6a7f92",
    marginTop: 2,
  },
  medicationCard: {
    backgroundColor: "white",
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#eef4f9",
    marginBottom: 20,
  },
  medicationRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  medicationInfo: {
    alignItems: "center",
    flex: 1,
  },
  medicationNumber: {
    fontSize: 24,
    fontWeight: "800",
    color: "#0b1a2e",
  },
  coveredColor: {
    color: "#219653",
  },
  outOfPocketColor: {
    color: "#dc2626",
  },
  medicationLabel: {
    fontSize: 11,
    color: "#6a7f92",
    marginTop: 2,
  },
  medicationDivider: {
    width: 1,
    backgroundColor: "#eef4f9",
  },
  appointmentCard: {
    backgroundColor: "white",
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#eef4f9",
    marginBottom: 20,
  },
  appointmentRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  appointmentInfo: {
    alignItems: "center",
    flex: 1,
  },
  appointmentNumber: {
    fontSize: 24,
    fontWeight: "800",
    color: "#0b1a2e",
  },
  attendedColor: {
    color: "#219653",
  },
  missedColor: {
    color: "#dc2626",
  },
  appointmentLabel: {
    fontSize: 11,
    color: "#6a7f92",
    marginTop: 2,
  },
  appointmentDivider: {
    width: 1,
    backgroundColor: "#eef4f9",
  },
  conditionsCard: {
    backgroundColor: "white",
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#eef4f9",
    marginBottom: 20,
  },
  conditionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f2f5f8",
  },
  conditionRank: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#eaf1f7",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  conditionRankText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#0b3b5c",
  },
  conditionName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#0b1a2e",
    width: 100,
  },
  conditionBar: {
    flex: 1,
    height: 6,
    backgroundColor: "#eef4f9",
    borderRadius: 3,
    marginLeft: 12,
  },
  conditionBarFill: {
    height: "100%",
    backgroundColor: "#0b3b5c",
    borderRadius: 3,
  },
  footerSpace: {
    height: 24,
  },
});
