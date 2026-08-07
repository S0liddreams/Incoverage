import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Dimensions,
  Animated,
  TouchableWithoutFeedback,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");
const DRAWER_WIDTH = width * 0.8;

interface SideDrawerProps {
  visible: boolean;
  onClose: () => void;
  navigation: any;
  userName: string;
  userEmail: string;
  userInitials: string;
  isPremium?: boolean;
}

interface MenuItem {
  id: string;
  title: string;
  subtitle?: string;
  icon: string;
  screen: string;
}

// Account-level items — shown inside the scroll area, grouped under a section label
const accountItems: MenuItem[] = [
  {
    id: "profile",
    title: "My Profile",
    subtitle: "Personal & policy details",
    icon: "person-outline",
    screen: "Profile",
  },
  {
    id: "premium",
    title: "Premium",
    subtitle: "Unlock extended coverage",
    icon: "diamond-outline",
    screen: "Premium",
  },
];

const generalItems: MenuItem[] = [
  {
    id: "settings",
    title: "Settings",
    subtitle: "Notifications, privacy & more",
    icon: "settings-outline",
    screen: "Settings",
  },
  {
    id: "help",
    title: "FAQ & Help",
    subtitle: "Get answers or contact support",
    icon: "help-circle-outline",
    screen: "FAQ",
  },
];

// Pro-only AI tools — fully locked for free users, not just usage-limited
// like the Symptom Checker teaser. Tapping any of these while on the free
// tier routes straight to the Premium paywall instead of the real screen.
const aiToolsItems: MenuItem[] = [
  {
    id: "ai-coverage",
    title: "AI Coverage Assistant",
    subtitle: "Ask why something was covered, or draft a claim",
    icon: "chatbubbles-outline",
    screen: "AICoverageAssistant",
  },
  {
    id: "ai-digest",
    title: "AI Health Digest",
    subtitle: "Monthly personalized coverage & usage summary",
    icon: "newspaper-outline",
    screen: "AIHealthDigest",
  },
  {
    id: "ai-report-reader",
    title: "Report Reader",
    subtitle: "Upload a lab result, get a plain-language read",
    icon: "document-text-outline",
    screen: "AIReportReader",
  },
];

export default function SideDrawer({
  visible,
  onClose,
  navigation,
  userName,
  userEmail,
  userInitials,
  isPremium = false,
}: SideDrawerProps) {
  const [slideAnim] = useState(new Animated.Value(-DRAWER_WIDTH));
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          tension: 65,
          friction: 11,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -DRAWER_WIDTH,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const handleClose = () => {
    onClose();
  };

  const handleMenuItemPress = (item: MenuItem) => {
    handleClose();
    setTimeout(() => {
      navigation?.navigate(item.screen);
    }, 300);
  };

  const handleAiToolPress = (item: MenuItem) => {
    handleClose();
    setTimeout(() => {
      if (isPremium) {
        navigation?.navigate(item.screen);
      } else {
        navigation?.navigate("Premium", { source: `ai_tool_${item.id}` });
      }
    }, 300);
  };

  const handleLogout = () => {
    handleClose();
    setTimeout(() => {
      alert("Logging out...");
    }, 300);
  };

  if (!visible) {
    return null;
  }

  return (
    <Modal
      transparent={true}
      visible={visible}
      onRequestClose={handleClose}
      animationType="none"
    >
      <View style={styles.container}>
        {/* Overlay */}
        <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
          <TouchableWithoutFeedback onPress={handleClose}>
            <View style={styles.overlayTouchable} />
          </TouchableWithoutFeedback>
        </Animated.View>

        {/* Drawer */}
        <Animated.View
          style={[styles.drawer, { transform: [{ translateX: slideAnim }] }]}
        >
          <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
            {/* Profile header */}
            <LinearGradient
              colors={["#0b3b5c", "#146c8f"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.profileHeader}
            >
              <TouchableOpacity
                style={styles.closeButton}
                onPress={handleClose}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Icon name="close" size={18} color="white" />
              </TouchableOpacity>

              <View style={styles.avatarLarge}>
                <Text style={styles.avatarLargeText}>{userInitials}</Text>
              </View>
              <Text style={styles.profileName} numberOfLines={1}>
                {userName}
              </Text>
              <Text style={styles.profileEmail} numberOfLines={1}>
                {userEmail}
              </Text>
            </LinearGradient>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
            >
              {/* Account section */}
              <Text style={styles.sectionLabel}>ACCOUNT</Text>
              <View style={styles.menuGroup}>
                {accountItems.map((item, index) => (
                  <TouchableOpacity
                    key={item.id}
                    style={[
                      styles.menuItem,
                      index !== accountItems.length - 1 &&
                        styles.menuItemDivider,
                    ]}
                    onPress={() => handleMenuItemPress(item)}
                    activeOpacity={0.6}
                  >
                    <View style={styles.menuIconContainer}>
                      <Icon name={item.icon} size={19} color="#0b3b5c" />
                    </View>
                    <View style={styles.menuTextGroup}>
                      <Text style={styles.menuTitle}>{item.title}</Text>
                      {item.subtitle && (
                        <Text style={styles.menuSubtitle} numberOfLines={1}>
                          {item.subtitle}
                        </Text>
                      )}
                    </View>
                    {item.id === "premium" ? (
                      <View style={styles.proBadge}>
                        <Text style={styles.proBadgeText}>PRO</Text>
                      </View>
                    ) : (
                      <Icon name="chevron-forward" size={16} color="#c0c8d4" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>

              {/* General section */}
              <Text style={styles.sectionLabel}>GENERAL</Text>
              <View style={styles.menuGroup}>
                {generalItems.map((item, index) => (
                  <TouchableOpacity
                    key={item.id}
                    style={[
                      styles.menuItem,
                      index !== generalItems.length - 1 &&
                        styles.menuItemDivider,
                    ]}
                    onPress={() => handleMenuItemPress(item)}
                    activeOpacity={0.6}
                  >
                    <View style={styles.menuIconContainer}>
                      <Icon name={item.icon} size={19} color="#0b3b5c" />
                    </View>
                    <View style={styles.menuTextGroup}>
                      <Text style={styles.menuTitle}>{item.title}</Text>
                      {item.subtitle && (
                        <Text style={styles.menuSubtitle} numberOfLines={1}>
                          {item.subtitle}
                        </Text>
                      )}
                    </View>
                    <Icon name="chevron-forward" size={16} color="#c0c8d4" />
                  </TouchableOpacity>
                ))}
              </View>
              {/* AI Tools section — fully gated behind Pro */}
              <View style={styles.sectionLabelRow}>
                <Text style={styles.sectionLabel}>AI TOOLS</Text>
                {!isPremium && (
                  <View style={styles.sectionProTag}>
                    <Icon name="lock-closed" size={9} color="#7c3aed" />
                    <Text style={styles.sectionProTagText}>PRO</Text>
                  </View>
                )}
              </View>
              <View style={styles.menuGroup}>
                {aiToolsItems.map((item, index) => (
                  <TouchableOpacity
                    key={item.id}
                    style={[
                      styles.menuItem,
                      index !== aiToolsItems.length - 1 &&
                        styles.menuItemDivider,
                    ]}
                    onPress={() => handleAiToolPress(item)}
                    activeOpacity={0.6}
                  >
                    <View
                      style={[
                        styles.menuIconContainer,
                        !isPremium && styles.menuIconContainerLocked,
                      ]}
                    >
                      <Icon
                        name={item.icon}
                        size={19}
                        color={isPremium ? "#0b3b5c" : "#a8b5c0"}
                      />
                    </View>
                    <View style={styles.menuTextGroup}>
                      <Text
                        style={[
                          styles.menuTitle,
                          !isPremium && styles.menuTitleLocked,
                        ]}
                      >
                        {item.title}
                      </Text>
                      {item.subtitle && (
                        <Text style={styles.menuSubtitle} numberOfLines={1}>
                          {item.subtitle}
                        </Text>
                      )}
                    </View>
                    {isPremium ? (
                      <Icon name="chevron-forward" size={16} color="#c0c8d4" />
                    ) : (
                      <Icon name="lock-closed" size={15} color="#c0c8d4" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            {/* Pinned footer — logout kept out of the scrollable list on purpose,
                so a destructive action is never just another row you can misfire */}
            <View style={styles.footer}>
              <TouchableOpacity
                style={styles.logoutButton}
                onPress={handleLogout}
                activeOpacity={0.7}
              >
                <Icon name="log-out-outline" size={18} color="#c0392b" />
                <Text style={styles.logoutText}>Log out</Text>
              </TouchableOpacity>
              <Text style={styles.versionText}>InCoverage v1.0.0</Text>
            </View>
          </SafeAreaView>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(11, 26, 46, 0.5)",
  },
  overlayTouchable: {
    flex: 1,
  },
  drawer: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    width: DRAWER_WIDTH,
    backgroundColor: "#f7fafd",
    shadowColor: "#000",
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  safeArea: {
    flex: 1,
  },

  // Profile header
  profileHeader: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 22,
    alignItems: "center",
  },
  closeButton: {
    position: "absolute",
    top: 16,
    right: 16,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "rgba(255,255,255,0.16)",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarLarge: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "rgba(255,255,255,0.16)",
    borderWidth: 2.5,
    borderColor: "rgba(255,255,255,0.45)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  avatarLargeText: {
    color: "white",
    fontSize: 28,
    fontWeight: "800",
  },
  profileName: {
    color: "white",
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 2,
    maxWidth: DRAWER_WIDTH - 80,
  },
  profileEmail: {
    color: "rgba(255,255,255,0.72)",
    fontSize: 12.5,
    maxWidth: DRAWER_WIDTH - 80,
  },
  verifiedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(255,255,255,0.14)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    marginTop: 12,
  },
  verifiedBadgeText: {
    color: "#eaf6ed",
    fontSize: 10.5,
    fontWeight: "700",
  },

  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 12,
  },

  sectionLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
    marginLeft: 4,
  },
  sectionProTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: "#f3e8fd",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  sectionProTagText: {
    fontSize: 9,
    fontWeight: "800",
    color: "#7c3aed",
    letterSpacing: 0.4,
  },
  menuIconContainerLocked: {
    backgroundColor: "#f2f5f8",
  },
  menuTitleLocked: {
    color: "#8a9eb0",
  },

  sectionLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: "#a8b5c0",
    letterSpacing: 0.6,
    marginBottom: 8,
    marginLeft: 4,
  },
  menuGroup: {
    backgroundColor: "white",
    borderRadius: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#eef4f9",
    shadowColor: "#0b1a2e",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  menuItemDivider: {
    borderBottomWidth: 1,
    borderBottomColor: "#f2f5f8",
  },
  menuIconContainer: {
    width: 38,
    height: 38,
    borderRadius: 11,
    backgroundColor: "#eaf1f7",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  menuTextGroup: { flex: 1 },
  menuTitle: {
    fontSize: 14.5,
    fontWeight: "700",
    color: "#0b1a2e",
  },
  menuSubtitle: {
    fontSize: 11.5,
    color: "#8a9eb0",
    marginTop: 1,
  },
  proBadge: {
    backgroundColor: "#f3e8fd",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  proBadgeText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#7c3aed",
    letterSpacing: 0.4,
  },

  // Pinned footer
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 14,
    borderTopWidth: 1,
    borderTopColor: "#eef4f9",
    backgroundColor: "#f7fafd",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#fbeae8",
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 10,
  },
  logoutText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#c0392b",
  },
  versionText: {
    fontSize: 11,
    color: "#c0c8d4",
    textAlign: "center",
  },
});
