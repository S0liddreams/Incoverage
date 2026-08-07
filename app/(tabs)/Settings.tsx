import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

interface SettingItem {
  id: string;
  title: string;
  icon: string;
  type: "toggle" | "button" | "action";
  value?: boolean;
  action?: () => void;
}

export default function SettingsScreen() {
  const navigation = useNavigation();
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: false,
    biometricAuth: true,
    autoRefill: false,
    dataSaver: false,
  });

  const handleToggle = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleClearCache = () => {
    Alert.alert(
      "Clear Cache",
      "This will clear all cached data. Are you sure?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: () => alert("Cache cleared!"),
        },
      ],
    );
  };

  const handlePrivacyPolicy = () => {
    alert("Opening Privacy Policy...");
  };

  const handleTerms = () => {
    alert("Opening Terms of Service...");
  };

  const handleRateApp = () => {
    alert("Redirecting to app store...");
  };

  const SettingRow = ({ item }: { item: SettingItem }) => (
    <TouchableOpacity
      style={styles.settingRow}
      onPress={item.action || (() => {})}
      activeOpacity={item.type === "toggle" ? 1 : 0.7}
    >
      <View style={styles.settingLeft}>
        <View style={styles.settingIconContainer}>
          <Icon name={item.icon} size={20} color="#0b3b5c" />
        </View>
        <Text style={styles.settingTitle}>{item.title}</Text>
      </View>
      {item.type === "toggle" && (
        <Switch
          value={item.value}
          onValueChange={() => handleToggle(item.id as keyof typeof settings)}
          trackColor={{ false: "#e6edf4", true: "#0b3b5c" }}
          thumbColor={item.value ? "white" : "white"}
        />
      )}
      {item.type === "button" && (
        <Icon name="chevron-forward" size={18} color="#c0c8d4" />
      )}
      {item.type === "action" && (
        <Icon name="chevron-forward" size={18} color="#c0c8d4" />
      )}
    </TouchableOpacity>
  );

  const sections = [
    {
      id: "preferences",
      title: "PREFERENCES",
      items: [
        {
          id: "notifications",
          title: "Push Notifications",
          icon: "notifications-outline",
          type: "toggle",
          value: settings.notifications,
        },
        {
          id: "darkMode",
          title: "Dark Mode",
          icon: "moon-outline",
          type: "toggle",
          value: settings.darkMode,
        },
        {
          id: "biometricAuth",
          title: "Biometric Authentication",
          icon: "finger-print-outline",
          type: "toggle",
          value: settings.biometricAuth,
        },
      ],
    },
    {
      id: "health",
      title: "HEALTH & WELLNESS",
      items: [
        {
          id: "autoRefill",
          title: "Auto Refill Reminders",
          icon: "reload-outline",
          type: "toggle",
          value: settings.autoRefill,
        },
        {
          id: "dataSaver",
          title: "Data Saver Mode",
          icon: "save-outline",
          type: "toggle",
          value: settings.dataSaver,
        },
      ],
    },
    {
      id: "support",
      title: "SUPPORT",
      items: [
        {
          id: "privacy",
          title: "Privacy Policy",
          icon: "shield-outline",
          type: "button",
          action: handlePrivacyPolicy,
        },
        {
          id: "terms",
          title: "Terms of Service",
          icon: "document-text-outline",
          type: "button",
          action: handleTerms,
        },
        {
          id: "clearCache",
          title: "Clear Cache",
          icon: "trash-outline",
          type: "action",
          action: handleClearCache,
        },
        {
          id: "rate",
          title: "Rate Our App",
          icon: "star-outline",
          type: "action",
          action: handleRateApp,
        },
      ],
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color="#0b3b5c" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {sections.map((section) => (
          <View key={section.id} style={styles.section}>
            <Text style={styles.sectionLabel}>{section.title}</Text>
            <View style={styles.sectionCard}>
              {section.items.map((item, index) => (
                <React.Fragment key={item.id}>
                  <SettingRow item={item} />
                  {index < section.items.length - 1 && (
                    <View style={styles.divider} />
                  )}
                </React.Fragment>
              ))}
            </View>
          </View>
        ))}

        <View style={styles.footer}>
          <Text style={styles.versionText}>InCoverage v1.0.0</Text>
          <Text style={styles.footerSubtext}>
            Made with ❤️ for better healthcare
          </Text>
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
  section: {
    marginTop: 16,
    paddingHorizontal: 20,
  },
  sectionLabel: {
    fontSize: 11.5,
    fontWeight: "700",
    color: "#8a9eb0",
    letterSpacing: 0.6,
    marginBottom: 8,
    marginLeft: 4,
  },
  sectionCard: {
    backgroundColor: "white",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#eef4f9",
    overflow: "hidden",
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingIconContainer: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: "#eaf1f7",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  settingTitle: {
    fontSize: 15,
    fontWeight: "500",
    color: "#0b1a2e",
  },
  divider: {
    height: 1,
    backgroundColor: "#f2f5f8",
    marginHorizontal: 16,
  },
  footer: {
    alignItems: "center",
    paddingVertical: 32,
    paddingBottom: 40,
  },
  versionText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#8a9eb0",
  },
  footerSubtext: {
    fontSize: 12,
    color: "#c0c8d4",
    marginTop: 4,
  },
});
