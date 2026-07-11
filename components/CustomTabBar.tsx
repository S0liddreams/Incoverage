import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const { width } = Dimensions.get("window");

interface CustomTabBarProps {
  state: any;
  descriptors: any;
  navigation: any;
  onMenuPress: () => void;
}

export default function CustomTabBar({
  state,
  descriptors,
  navigation,
  onMenuPress,
}: CustomTabBarProps) {
  const tabs = [
    { key: "Home", label: "Home", icon: "home" },
    { key: "Search", label: "Search", icon: "search" },
    { key: "Menu", label: "Menu", icon: "menu" },
    { key: "Appointments", label: "Appointments", icon: "calendar" },
    { key: "Tracker", label: "Tracker", icon: "stats-chart" },
  ];

  return (
    <View style={styles.container}>
      {tabs.map((tab, index) => {
        const isFocused = state.index === index;
        const color = isFocused ? "#0b3b5c" : "#8a9eb0";

        const onPress = () => {
          if (tab.key === "Menu") {
            onMenuPress();
            return;
          }

          const event = navigation.emit({
            type: "tabPress",
            target: tab.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(tab.key);
          }
        };

        return (
          <TouchableOpacity
            key={tab.key}
            onPress={onPress}
            style={styles.tabButton}
            activeOpacity={0.7}
          >
            <View style={styles.tabContent}>
              <Icon
                name={isFocused ? tab.icon : `${tab.icon}-outline`}
                size={24}
                color={color}
              />
              <Text style={[styles.tabLabel, { color }]}>{tab.label}</Text>
              {tab.key === "Menu" && (
                <View style={styles.menuBadge}>
                  <Icon name="apps" size={12} color="white" />
                </View>
              )}
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#e6edf4",
    paddingBottom: 8,
    paddingTop: 6,
    height: 68,
  },
  tabButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  tabContent: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: "600",
    marginTop: 2,
  },
  menuBadge: {
    position: "absolute",
    top: -8,
    right: -16,
    backgroundColor: "#eb5757",
    borderRadius: 10,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
});
