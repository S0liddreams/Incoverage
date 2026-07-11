import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";

// Mock refill data
const refills = [
  {
    id: "1",
    name: "Amoxicillin 500mg",
    nextRefill: "05/04/2026",
    refillsLeft: 3,
    status: "on-track",
  },
  {
    id: "2",
    name: "Lisinopril 10mg",
    nextRefill: "22/03/2026",
    refillsLeft: 1,
    status: "expiring",
  },
];

export default function TrackerScreen() {
  const [activeTab, setActiveTab] = useState<"plan" | "refills">("plan");

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          <Icon name="stats-chart" size={24} color="#0b3b5c" /> Plan Tracker
        </Text>
      </View>

      {/* Tab Switcher */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "plan" && styles.tabActive]}
          onPress={() => setActiveTab("plan")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "plan" && styles.tabTextActive,
            ]}
          >
            Plan Details
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "refills" && styles.tabActive]}
          onPress={() => setActiveTab("refills")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "refills" && styles.tabTextActive,
            ]}
          >
            Refills
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {activeTab === "plan" ? (
          <>
            {/* Plan Details */}
            <View style={styles.card}>
              <View style={styles.planRow}>
                <Text style={styles.planLabel}>Plan Type</Text>
                <Text style={styles.planValue}>NHIS Comprehensive</Text>
              </View>
              <View style={styles.planRow}>
                <Text style={styles.planLabel}>Registration Date</Text>
                <Text style={styles.planValue}>15/12/2024</Text>
              </View>
              <View style={styles.planRow}>
                <Text style={styles.planLabel}>Expected Expiry</Text>
                <Text style={[styles.planValue, styles.expiryActive]}>
                  15/12/2026
                </Text>
              </View>

              <View style={styles.progressContainer}>
                <View style={styles.progressHeader}>
                  <Text style={styles.progressLabel}>Time Remaining</Text>
                  <Text style={styles.progressValue}>1 year 8 months</Text>
                </View>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: "62%" }]} />
                </View>
              </View>
            </View>

            {/* HMO Info */}
            <View style={styles.card}>
              <Text style={styles.hmoTitle}>
                <Icon name="person" size={18} color="#1a6d8a" /> Assigned HMO
              </Text>
              <Text style={styles.hmoName}>MediPlan HMO</Text>
              <Text style={styles.hmoContact}>
                <Icon name="call" size={14} color="#6a7f92" /> 01-888-1234
              </Text>
              <Text style={styles.hmoContact}>
                <Icon name="mail" size={14} color="#6a7f92" />{" "}
                support@mediplanhmo.com
              </Text>
            </View>
          </>
        ) : (
          <>
            <Text style={styles.sectionTitle}>
              <Icon name="refresh" size={18} color="#0b3b5c" /> Medication
              Refill Tracker
            </Text>

            {refills.map((refill) => (
              <View
                key={refill.id}
                style={[
                  styles.refillCard,
                  refill.status === "expiring" && styles.refillCardExpiring,
                ]}
              >
                <View style={styles.refillHeader}>
                  <Text style={styles.refillName}>{refill.name}</Text>
                  <View
                    style={[
                      styles.refillStatus,
                      refill.status === "on-track"
                        ? styles.statusOnTrack
                        : styles.statusExpiring,
                    ]}
                  >
                    <Icon
                      name={
                        refill.status === "on-track"
                          ? "checkmark-circle"
                          : "warning"
                      }
                      size={14}
                      color={
                        refill.status === "on-track" ? "#219653" : "#f2994a"
                      }
                    />
                    <Text
                      style={[
                        styles.refillStatusText,
                        refill.status === "on-track"
                          ? styles.statusOnTrackText
                          : styles.statusExpiringText,
                      ]}
                    >
                      {refill.status === "on-track"
                        ? "On Track"
                        : "Expiring Soon"}
                    </Text>
                  </View>
                </View>
                <View style={styles.refillDetails}>
                  <Text style={styles.refillDetail}>
                    <Icon name="calendar" size={14} color="#6a7f92" /> Next
                    refill: {refill.nextRefill}
                  </Text>
                  <Text style={styles.refillDetail}>
                    <Icon name="refresh" size={14} color="#6a7f92" />{" "}
                    {refill.refillsLeft} refills left
                  </Text>
                </View>
              </View>
            ))}

            <TouchableOpacity style={styles.requestButton}>
              <Icon name="add" size={20} color="white" />
              <Text style={styles.requestButtonText}>Request New Refill</Text>
            </TouchableOpacity>
          </>
        )}
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
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "white",
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 4,
    borderWidth: 1,
    borderColor: "#eef4f9",
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 12,
  },
  tabActive: {
    backgroundColor: "#0b3b5c",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6a7f92",
  },
  tabTextActive: {
    color: "white",
  },
  card: {
    backgroundColor: "white",
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#eef4f9",
    marginBottom: 12,
  },
  planRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  planLabel: {
    fontSize: 14,
    color: "#6a7f92",
  },
  planValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0b1a2e",
  },
  expiryActive: {
    color: "#219653",
  },
  progressContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#eef4f9",
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  progressLabel: {
    fontSize: 13,
    fontWeight: "500",
    color: "#6a7f92",
  },
  progressValue: {
    fontSize: 13,
    fontWeight: "700",
    color: "#0b1a2e",
  },
  progressBar: {
    height: 8,
    backgroundColor: "#e6edf4",
    borderRadius: 10,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#0b3b5c",
    borderRadius: 10,
  },
  hmoTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0b1a2e",
    marginBottom: 6,
  },
  hmoName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0b3b5c",
    marginBottom: 4,
  },
  hmoContact: {
    fontSize: 14,
    color: "#6a7f92",
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0b1a2e",
    marginHorizontal: 20,
    marginBottom: 12,
  },
  refillCard: {
    backgroundColor: "white",
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#219653",
    marginBottom: 10,
  },
  refillCardExpiring: {
    borderLeftColor: "#f2994a",
  },
  refillHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  refillName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0b1a2e",
  },
  refillStatus: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusOnTrack: {
    backgroundColor: "#d4edda",
  },
  statusExpiring: {
    backgroundColor: "#fff3cd",
  },
  refillStatusText: {
    fontSize: 11,
    fontWeight: "600",
  },
  statusOnTrackText: {
    color: "#155724",
  },
  statusExpiringText: {
    color: "#856404",
  },
  refillDetails: {
    flexDirection: "row",
    gap: 16,
  },
  refillDetail: {
    fontSize: 13,
    color: "#6a7f92",
  },
  requestButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0b3b5c",
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 16,
    gap: 10,
    marginTop: 8,
    marginBottom: 24,
  },
  requestButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },
});
