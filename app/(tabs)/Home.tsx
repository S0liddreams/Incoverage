import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  RefreshControl,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import {
  useNavigation,
  CompositeNavigationProp,
} from "@react-navigation/native";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import type { RootStackParamList, TabParamList } from "../../App";
import SideDrawer from "../../components/SideDrawer";

type HomeNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamList, "Home">,
  NativeStackNavigationProp<RootStackParamList>
>;

type QuickActionScreen = keyof TabParamList | keyof RootStackParamList;

// Mock data
const upcomingAppointments = [
  {
    id: "1",
    title: "Cardiology Checkup",
    doctor: "Dr. Okonkwo",
    date: "18",
    month: "Mar",
    time: "10:30 AM",
    status: "confirmed",
    location: "LUTH Cardiology Unit",
  },
  {
    id: "2",
    title: "Lab Work - Blood Test",
    doctor: "NHIS Lab",
    date: "22",
    month: "Mar",
    time: "08:00 AM",
    status: "pending",
    location: "NHIS Diagnostic Center",
  },
];

const quickActions: {
  key: string;
  label: string;
  icon: string;
  screen: QuickActionScreen;
  bg: string;
  color: string;
}[] = [
  {
    key: "contact",
    label: "Contact",
    icon: "mail-outline",
    screen: "Coordinators",
    bg: "#e8f0fe",
    color: "#2563eb",
  },
  {
    key: "refill",
    label: "Refills",
    icon: "reload-outline",
    screen: "Tracker",
    bg: "#f3e8fd",
    color: "#7c3aed",
  },
  {
    key: "appointment",
    label: "Appointments",
    icon: "calendar-outline",
    screen: "Appointments",
    bg: "#fef3e2",
    color: "#d97706",
  },
  {
    key: "faq",
    label: "FAQ & Help",
    icon: "help-circle-outline",
    screen: "FAQ",
    bg: "#fce8ee",
    color: "#db2777",
  },
];

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export default function Home() {
  const navigation = useNavigation<HomeNavigationProp>();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // User data
  const userName = "Chidi Okonkwo";
  const userEmail = "chidi@email.com";
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  // Policy progress
  const totalDays = 365;
  const daysLeft = 214;
  const progressPct = Math.min(100, Math.round((daysLeft / totalDays) * 100));

  const handleAvatarPress = () => setDrawerVisible(true);
  const handleDrawerClose = () => setDrawerVisible(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  };

  const handleQuickAction = (screen: QuickActionScreen) => {
    navigation.navigate(screen as any);
  };

  const handleAppointmentPress = (title: string) => {
    Alert.alert("Appointment", title);
  };

  const handleHmoPress = () => {
    Alert.alert("Hygeia HMO Ltd", "Your assigned provider details go here.");
  };

  const handlePolicyGuidePress = () => {
    navigation.navigate("FAQ");
  };

  return (
    <>
      <SafeAreaView style={styles.container} edges={["top"]}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#0b3b5c"]}
              tintColor="#0b3b5c"
            />
          }
        >
          {/* Header */}
          <LinearGradient
            colors={["#0b3b5c", "#146c8f"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.header}
          >
            <View style={styles.headerBlobLarge} />
            <View style={styles.headerBlobSmall} />
            <View style={styles.headerBlobMedium} />

            <View style={styles.headerTopRow}>
              <View>
                <Text style={styles.greeting}>{getGreeting()},</Text>
                <Text style={styles.userName}>{userName}</Text>
              </View>
              <TouchableOpacity
                style={styles.avatarButton}
                activeOpacity={0.85}
                onPress={handleAvatarPress}
              >
                <Text style={styles.avatarInitials}>{initials}</Text>
              </TouchableOpacity>
            </View>

            {/* Quick Stats in Header */}
            <View style={styles.headerStats}>
              <View style={styles.headerStat}>
                <Icon
                  name="medkit-outline"
                  size={18}
                  color="rgba(255,255,255,0.8)"
                />
                <Text style={styles.headerStatValue}>12</Text>
                <Text style={styles.headerStatLabel}>Covered</Text>
              </View>
              <View style={styles.headerStatDivider} />
              <View style={styles.headerStat}>
                <Icon
                  name="calendar-outline"
                  size={18}
                  color="rgba(255,255,255,0.8)"
                />
                <Text style={styles.headerStatValue}>4</Text>
                <Text style={styles.headerStatLabel}>Appointments</Text>
              </View>
              <View style={styles.headerStatDivider} />
              <View style={styles.headerStat}>
                <Icon
                  name="wallet-outline"
                  size={18}
                  color="rgba(255,255,255,0.8)"
                />
                <Text style={styles.headerStatValue}>₦0</Text>
                <Text style={styles.headerStatLabel}>Out-of-Pocket</Text>
              </View>
            </View>
          </LinearGradient>

          {/* Policy Status Card */}
          <View style={styles.policyCard}>
            <View style={styles.policyTopRow}>
              <View style={styles.policyStatus}>
                <View style={[styles.statusDot, styles.active]} />
                <Text style={styles.statusLabel}>Policy Active</Text>
              </View>
              <Text style={styles.policyNumber}>NHIS/2021/0048291</Text>
            </View>

            <View style={styles.progressTrack}>
              <View
                style={[styles.progressFill, { width: `${progressPct}%` }]}
              />
            </View>

            <View style={styles.policyBottomRow}>
              <Text style={styles.daysLeftText}>
                <Text style={styles.daysLeftBold}>{daysLeft} days</Text>{" "}
                remaining
              </Text>
              <Text style={styles.expiryDate}>
                Expires <Text style={styles.expiryDateBold}>15 Dec 2026</Text>
              </Text>
            </View>
          </View>

          {/* Global Search */}
          <View style={styles.searchWrapper}>
            <Icon
              name="search"
              size={18}
              color="#8a9eb0"
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Search medications, procedures..."
              placeholderTextColor="#8a9eb0"
              onFocus={() => navigation.navigate("Search")}
            />
            <TouchableOpacity style={styles.searchVoice}>
              <Icon name="mic-outline" size={18} color="#0b3b5c" />
            </TouchableOpacity>
          </View>

          {/* Quick Actions */}
          <Text style={styles.sectionLabel}>QUICK ACTIONS</Text>
          <View style={styles.quickActions}>
            {quickActions.map((qa) => (
              <TouchableOpacity
                key={qa.key}
                style={styles.qaButton}
                onPress={() => handleQuickAction(qa.screen)}
                activeOpacity={0.7}
              >
                <View style={[styles.qaIconChip, { backgroundColor: qa.bg }]}>
                  <Icon name={qa.icon} size={20} color={qa.color} />
                </View>
                <Text style={styles.qaLabel}>{qa.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Your HMO */}
          <Text style={styles.sectionLabel}>YOUR HMO</Text>
          <TouchableOpacity
            style={styles.hmoCard}
            activeOpacity={0.7}
            onPress={handleHmoPress}
          >
            <View style={styles.hmoTopRow}>
              <View style={styles.hmoIconChip}>
                <Icon name="business-outline" size={18} color="#0B4D3A" />
              </View>
              <View style={styles.hmoInfo}>
                <Text style={styles.hmoName}>Hygeia HMO Ltd</Text>
                <Text style={styles.hmoSub}>Your assigned provider</Text>
              </View>
              <Icon name="chevron-forward" size={18} color="#c0c8d4" />
            </View>
            <View style={styles.hmoDetails}>
              <View style={styles.detailRow}>
                <Icon name="call-outline" size={14} color="#8a9eb0" />
                <Text style={styles.detailText}>+234 700 494 3421</Text>
              </View>
              <View style={styles.detailRow}>
                <Icon name="mail-outline" size={14} color="#8a9eb0" />
                <Text style={styles.detailText}>
                  hygeia.support@hygeiahmo.com
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* Upcoming Appointments */}
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionLabel}>UPCOMING APPOINTMENTS</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("Appointments")}
            >
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>

          {upcomingAppointments.map((appt) => (
            <TouchableOpacity
              key={appt.id}
              style={styles.appointmentCard}
              activeOpacity={0.7}
              onPress={() => handleAppointmentPress(appt.title)}
            >
              <LinearGradient
                colors={
                  appt.status === "confirmed"
                    ? ["#0b3b5c", "#146c8f"]
                    : ["#d97706", "#f2994a"]
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.dateBox}
              >
                <Text style={styles.dateDay}>{appt.date}</Text>
                <Text style={styles.dateMonth}>{appt.month}</Text>
              </LinearGradient>
              <View style={styles.apptInfo}>
                <Text style={styles.apptTitle}>{appt.title}</Text>
                <View style={styles.apptTimeRow}>
                  <Icon name="time-outline" size={13} color="#8a9eb0" />
                  <Text style={styles.apptTime}>
                    {appt.time} · {appt.doctor}
                  </Text>
                </View>
                <Text style={styles.apptLocation}>
                  <Icon name="location-outline" size={12} color="#8a9eb0" />{" "}
                  {appt.location}
                </Text>
              </View>
              <View
                style={[
                  styles.apptStatus,
                  appt.status === "confirmed"
                    ? styles.confirmed
                    : styles.pending,
                ]}
              >
                <Text
                  style={[
                    styles.apptStatusText,
                    {
                      color:
                        appt.status === "confirmed" ? "#219653" : "#b7791f",
                    },
                  ]}
                >
                  {appt.status === "confirmed" ? "Confirmed" : "Pending"}
                </Text>
              </View>
            </TouchableOpacity>
          ))}

          {/* Policy Guide Button */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handlePolicyGuidePress}
          >
            <LinearGradient
              colors={["#0b3b5c", "#146c8f"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.policyGuideButton}
            >
              <Icon name="book-outline" size={19} color="white" />
              <Text style={styles.policyGuideText}>Read NHIS Policy Guide</Text>
              <Icon name="arrow-forward" size={17} color="white" />
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.footerSpace} />
        </ScrollView>
      </SafeAreaView>

      {/* Side Drawer */}
      <SideDrawer
        visible={drawerVisible}
        onClose={handleDrawerClose}
        navigation={navigation}
        userName={userName}
        userEmail={userEmail}
        userInitials={initials}
        isPremium={true}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f7fc",
  },
  scrollContent: {
    paddingBottom: 32,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    overflow: "hidden",
  },
  headerBlobLarge: {
    position: "absolute",
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "rgba(255,255,255,0.06)",
    top: -60,
    right: -40,
  },
  headerBlobSmall: {
    position: "absolute",
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "rgba(255,255,255,0.07)",
    bottom: -30,
    left: -20,
  },
  headerBlobMedium: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(255,255,255,0.04)",
    top: 40,
    right: 60,
  },
  headerTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  greeting: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 14,
    fontWeight: "500",
  },
  userName: {
    color: "white",
    fontSize: 27,
    fontWeight: "800",
    marginTop: 2,
  },
  avatarButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "rgba(255,255,255,0.16)",
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.35)",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitials: {
    color: "white",
    fontSize: 17,
    fontWeight: "800",
  },
  headerStats: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 8,
    marginTop: 4,
  },
  headerStat: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  headerStatValue: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },
  headerStatLabel: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 11,
    fontWeight: "500",
  },
  headerStatDivider: {
    width: 1,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  policyCard: {
    backgroundColor: "white",
    marginHorizontal: 20,
    marginTop: -22,
    padding: 18,
    borderRadius: 18,
    shadowColor: "#0b1a2e",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 5,
    marginBottom: 20,
  },
  policyTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  policyStatus: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  statusDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
  },
  active: {
    backgroundColor: "#6fcf97",
  },
  statusLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0b1a2e",
  },
  policyNumber: {
    fontSize: 11,
    fontWeight: "600",
    color: "#a8b5c0",
    letterSpacing: 0.3,
  },
  progressTrack: {
    height: 7,
    borderRadius: 4,
    backgroundColor: "#eef2f6",
    overflow: "hidden",
    marginBottom: 12,
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
    backgroundColor: "#6fcf97",
  },
  policyBottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  daysLeftText: {
    fontSize: 12.5,
    color: "#6a7f92",
  },
  daysLeftBold: {
    fontWeight: "800",
    color: "#219653",
  },
  expiryDate: {
    fontSize: 12.5,
    color: "#6a7f92",
  },
  expiryDateBold: {
    fontWeight: "700",
    color: "#0b1a2e",
  },
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    marginHorizontal: 20,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e6edf4",
    marginBottom: 22,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 13,
    fontSize: 14.5,
    color: "#0b1a2e",
  },
  searchVoice: {
    padding: 4,
  },
  sectionLabel: {
    fontSize: 11.5,
    fontWeight: "700",
    color: "#8a9eb0",
    letterSpacing: 0.6,
    marginBottom: 10,
    marginLeft: 22,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginRight: 20,
  },
  seeAll: {
    fontSize: 12.5,
    fontWeight: "700",
    color: "#146c8f",
    marginBottom: 10,
  },
  quickActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginBottom: 22,
    backgroundColor: "white",
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 10,
    shadowColor: "#0b1a2e",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  qaButton: {
    alignItems: "center",
    flex: 1,
  },
  qaIconChip: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 7,
  },
  qaLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#0b3b5c",
    textAlign: "center",
  },
  hmoCard: {
    backgroundColor: "white",
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 18,
    marginBottom: 22,
    shadowColor: "#0b1a2e",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  hmoTopRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  hmoIconChip: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#eaf3ee",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  hmoInfo: {
    flex: 1,
  },
  hmoName: {
    fontSize: 15.5,
    fontWeight: "700",
    color: "#0b1a2e",
  },
  hmoSub: {
    fontSize: 12,
    color: "#8a9eb0",
    marginTop: 1,
  },
  hmoDetails: {
    borderTopWidth: 1,
    borderTopColor: "#f2f5f8",
    paddingTop: 11,
    gap: 7,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  detailText: {
    fontSize: 13,
    color: "#4a5f72",
  },
  appointmentCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    marginHorizontal: 20,
    marginBottom: 10,
    padding: 14,
    borderRadius: 18,
    shadowColor: "#0b1a2e",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  dateBox: {
    borderRadius: 13,
    paddingHorizontal: 12,
    paddingVertical: 9,
    alignItems: "center",
    minWidth: 50,
    marginRight: 14,
  },
  dateDay: {
    color: "white",
    fontSize: 19,
    fontWeight: "800",
    lineHeight: 22,
  },
  dateMonth: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 10.5,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  apptInfo: {
    flex: 1,
  },
  apptTitle: {
    fontSize: 14.5,
    fontWeight: "700",
    color: "#0b1a2e",
  },
  apptTimeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 3,
  },
  apptTime: {
    fontSize: 12.5,
    color: "#6a7f92",
  },
  apptLocation: {
    fontSize: 12,
    color: "#8a9eb0",
    marginTop: 2,
  },
  apptStatus: {
    paddingHorizontal: 11,
    paddingVertical: 5,
    borderRadius: 20,
  },
  confirmed: {
    backgroundColor: "#e5f6ea",
  },
  pending: {
    backgroundColor: "#fef3e2",
  },
  apptStatusText: {
    fontSize: 10.5,
    fontWeight: "700",
  },
  policyGuideButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 18,
    gap: 9,
  },
  policyGuideText: {
    fontSize: 14.5,
    fontWeight: "700",
    color: "white",
  },
  footerSpace: {
    height: 24,
  },
});
