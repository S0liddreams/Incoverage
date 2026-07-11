import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Dimensions,
  TouchableWithoutFeedback,
  Animated,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const { width, height } = Dimensions.get("window");

interface MenuItem {
  id: string;
  title: string;
  icon: string;
  screen: string; // The exact screen name string matching your Stack.Screen names
  description: string;
}

interface MenuSection {
  title: string;
  items: MenuItem[];
}

// Updated 'screen' fields to match your exact Stack.Screen name values
const menuSections: MenuSection[] = [
  {
    title: "Find Care",
    items: [
      {
        id: "HospitalsScreen",
        title: "Hospitals",
        icon: "medical-outline",
        screen: "Hospitals", // Matches exactly <Stack.Screen name="Hospitals" />
        description: "Find NHIS accredited hospitals near you",
      },
      {
        id: "coordinators",
        title: "Contact Coordinators",
        icon: "people-outline",
        screen: "Coordinators", // Matches exactly <Stack.Screen name="Coordinators" />
        description: "Reach your state NHIS coordinator",
      },
    ],
  },
  {
    title: "Know Your Cover",
    items: [
      {
        id: "policy",
        title: "NHIS Policy Guide",
        icon: "book-outline",
        screen: "FAQ", // Routed to FAQ for now as per your original configuration
        description: "Complete guide to NHIS policies",
      },
      {
        id: "rights",
        title: "Patient Rights",
        icon: "shield-checkmark-outline",
        screen: "FAQ", // Matches exactly <Stack.Screen name="FAQ" />
        description: "Know your rights as a patient",
      },
      {
        id: "faq",
        title: "FAQ & Help",
        icon: "help-circle-outline",
        screen: "FAQ", // Matches exactly <Stack.Screen name="FAQ" />
        description: "Frequently asked questions and support",
      },
    ],
  },
  {
    title: "App",
    items: [
      {
        id: "settings",
        title: "Settings",
        icon: "settings-outline",
        screen: "FAQ",
        description: "App settings and preferences",
      },
      {
        id: "about",
        title: "About NHIS Care",
        icon: "information-circle-outline",
        screen: "FAQ",
        description: "About this app and its creators",
      },
    ],
  },
];

interface MenuScreenProps {
  visible: boolean;
  onClose: () => void;
  navigation: any;
}

export default function MenuScreen({
  visible,
  onClose,
  navigation,
}: MenuScreenProps) {
  const [slideAnim] = useState(new Animated.Value(height));

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 65,
        friction: 11,
      }).start();
    }
  }, [visible]);

  const closeModal = () => {
    Animated.timing(slideAnim, {
      toValue: height,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      onClose();
    });
  };

  const handleMenuItemPress = (screen: string) => {
    closeModal();
    // Delay slightly to allow the sheet sliding down animation to complete gracefully
    setTimeout(() => {
      if (navigation) {
        navigation.navigate(screen);
      } else {
        console.warn(
          "Navigation reference is not available inside MenuScreen.",
        );
      }
    }, 350);
  };

  if (!visible) {
    return null;
  }

  return (
    <Modal
      transparent={true}
      visible={visible}
      onRequestClose={closeModal}
      animationType="none"
    >
      <TouchableWithoutFeedback onPress={closeModal}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <Animated.View
              style={[
                styles.modalContainer,
                { transform: [{ translateY: slideAnim }] },
              ]}
            >
              {/* Modal Header */}
              <View style={styles.modalHeader}>
                <View style={styles.modalHandle} />
                <View style={styles.modalTitleContainer}>
                  <View style={styles.modalTitleIcon}>
                    <Icon name="menu-outline" size={20} color="#0b3b5c" />
                  </View>
                  <Text style={styles.modalTitle}>Menu</Text>
                  <TouchableOpacity
                    onPress={closeModal}
                    style={styles.closeButton}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Icon name="close" size={22} color="#6a7f92" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Menu Sections */}
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.menuList}
              >
                {menuSections.map((section) => (
                  <View key={section.title} style={styles.sectionBlock}>
                    <Text style={styles.sectionLabel}>{section.title}</Text>
                    <View style={styles.sectionCard}>
                      {section.items.map((item, iIndex) => (
                        <TouchableOpacity
                          key={item.id}
                          style={[
                            styles.menuItem,
                            iIndex !== section.items.length - 1 &&
                              styles.menuItemDivider,
                          ]}
                          onPress={() => handleMenuItemPress(item.screen)}
                          activeOpacity={0.6}
                        >
                          <View style={styles.menuItemLeft}>
                            <View style={styles.menuIconContainer}>
                              <Icon
                                name={item.icon}
                                size={20}
                                color="#0b3b5c"
                              />
                            </View>
                            <View style={styles.menuTextContainer}>
                              <Text style={styles.menuTitle}>{item.title}</Text>
                              <Text style={styles.menuDescription}>
                                {item.description}
                              </Text>
                            </View>
                          </View>
                          <Icon
                            name="chevron-forward"
                            size={18}
                            color="#c0c8d4"
                          />
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                ))}

                <View style={styles.versionContainer}>
                  <Text style={styles.versionText}>Incoverage</Text>
                  <Text style={styles.versionSubtext}>Version 1.0.0</Text>
                </View>
              </ScrollView>
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(11, 26, 46, 0.45)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#f7fafc",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: height * 0.85,
    minHeight: height * 0.6,
  },
  modalHeader: {
    backgroundColor: "white",
    paddingTop: 12,
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderBottomWidth: 1,
    borderBottomColor: "#eef4f9",
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: "#d0d8e0",
    borderRadius: 4,
    alignSelf: "center",
    marginBottom: 14,
  },
  modalTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  modalTitleIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "#eef6fb",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0b1a2e",
    flex: 1,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#f2f5f8",
    alignItems: "center",
    justifyContent: "center",
  },
  menuList: {
    paddingHorizontal: 16,
    paddingBottom: 32,
    paddingTop: 18,
  },
  sectionBlock: {
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#8a9eb0",
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginBottom: 8,
    marginLeft: 4,
  },
  sectionCard: {
    backgroundColor: "white",
    borderRadius: 18,
    overflow: "hidden",
    shadowColor: "#0b1a2e",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 13,
    paddingHorizontal: 14,
    backgroundColor: "white",
  },
  menuItemDivider: {
    borderBottomWidth: 1,
    borderBottomColor: "#f2f5f8",
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#f0f7fe",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0b1a2e",
  },
  menuDescription: {
    fontSize: 12.5,
    color: "#8a9eb0",
    marginTop: 2,
  },
  versionContainer: {
    alignItems: "center",
    marginTop: 8,
    paddingTop: 20,
  },
  versionText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#0b3b5c",
  },
  versionSubtext: {
    fontSize: 11.5,
    color: "#8a9eb0",
    marginTop: 2,
  },
});
