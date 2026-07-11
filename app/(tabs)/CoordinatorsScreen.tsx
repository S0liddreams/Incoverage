import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";

import { coordinators } from "../../data/coordinators";

interface CoordinatorsScreenProps {
  navigation?: any;
}

export default function CoordinatorsScreen({
  navigation,
}: CoordinatorsScreenProps) {
  const [selectedState, setSelectedState] = useState("Lagos");
  const [stateDropdownVisible, setStateDropdownVisible] = useState(false);
  const [stateSearch, setStateSearch] = useState("");

  const [mailModalVisible, setMailModalVisible] = useState(false);
  const [mailData, setMailData] = useState({
    to: "",
    subject: "",
    body: "",
  });

  const selectedCoordinator =
    coordinators.find((c) => c.state === selectedState) || coordinators[0];

  const filteredStates = coordinators.filter((c) =>
    c.state.toLowerCase().includes(stateSearch.toLowerCase()),
  );

  const handleSendMail = () => {
    alert(
      `Mail sent to ${mailData.to}\nSubject: ${mailData.subject}\nMessage: ${mailData.body}`,
    );
    setMailModalVisible(false);
    setMailData({ to: "", subject: "", body: "" });
  };

  const openMailComposer = (email: string) => {
    setMailData({ to: email, subject: "", body: "" });
    setMailModalVisible(true);
  };

  const selectState = (state: string) => {
    setSelectedState(state);
    setStateDropdownVisible(false);
    setStateSearch("");
  };

  const canSend =
    mailData.subject.trim().length > 0 && mailData.body.trim().length > 0;

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        {navigation?.canGoBack?.() && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Icon name="chevron-back" size={22} color="#0b1a2e" />
          </TouchableOpacity>
        )}
        <View style={styles.headerTitleGroup}>
          <View style={styles.headerIconChip}>
            <Icon name="people-outline" size={17} color="#0B4D3A" />
          </View>
          <View>
            <Text style={styles.headerTitle}>State Coordinators</Text>
            <Text style={styles.headerSubtitle}>
              Reach your NHIS state office directly
            </Text>
          </View>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* State Selector — Dropdown */}
        <Text style={styles.sectionLabel}>SELECT STATE</Text>
        <TouchableOpacity
          style={styles.dropdownTrigger}
          onPress={() => setStateDropdownVisible(true)}
          activeOpacity={0.8}
        >
          <View style={styles.dropdownTriggerLeft}>
            <Icon name="location-outline" size={17} color="#0b3b5c" />
            <Text style={styles.dropdownTriggerText}>{selectedState}</Text>
          </View>
          <Icon name="chevron-down" size={18} color="#8a9eb0" />
        </TouchableOpacity>

        {/* Coordinator Card */}
        <Text style={styles.sectionLabel}>COORDINATOR</Text>
        <View style={styles.coordinatorCard}>
          <View style={styles.coordinatorTopRow}>
            <View style={styles.avatarCircle}>
              <Icon name="person" size={22} color="#0b3b5c" />
            </View>
            <View style={styles.coordinatorInfo}>
              <Text style={styles.coordinatorName}>
                {selectedCoordinator.name}
              </Text>
              <Text style={styles.coordinatorRole}>
                {selectedState} State Coordinator
              </Text>
            </View>
          </View>

          <View style={styles.coordinatorDetails}>
            <View style={styles.detailRow}>
              <Icon name="call-outline" size={15} color="#8a9eb0" />
              <Text style={styles.detailText}>{selectedCoordinator.phone}</Text>
            </View>
            <View style={styles.detailRow}>
              <Icon name="mail-outline" size={15} color="#8a9eb0" />
              <Text style={styles.detailText}>{selectedCoordinator.email}</Text>
            </View>
          </View>

          <View style={styles.coordinatorActions}>
            <TouchableOpacity
              style={[styles.actionButton, styles.actionMail]}
              onPress={() => openMailComposer(selectedCoordinator.email)}
              activeOpacity={0.85}
            >
              <Icon name="mail" size={17} color="white" />
              <Text style={styles.actionButtonText}>Mail</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.actionCall]}
              onPress={() => alert(`Calling ${selectedCoordinator.phone}...`)}
              activeOpacity={0.85}
            >
              <Icon name="call" size={17} color="white" />
              <Text style={styles.actionButtonText}>Call</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* NHIS Headquarters */}
        <Text style={styles.sectionLabel}>NATIONAL OFFICE</Text>
        <View style={styles.headquarters}>
          <View style={styles.headquartersHeader}>
            <Icon name="business-outline" size={17} color="#0b3b5c" />
            <Text style={styles.headquartersTitle}>
              NHIS National Headquarters
            </Text>
          </View>
          <View style={styles.headquartersAddressRow}>
            <Icon name="location-outline" size={14} color="#8a9eb0" />
            <Text style={styles.headquartersAddress}>
              Plot 297, Shehu Yar'Adua Way, Utako District, Abuja, Nigeria
            </Text>
          </View>
          <View style={styles.headquartersContact}>
            <View style={styles.detailRow}>
              <Icon name="call-outline" size={14} color="#8a9eb0" />
              <Text style={styles.headquartersContactText}>09-291-5537</Text>
            </View>
            <View style={styles.detailRow}>
              <Icon name="mail-outline" size={14} color="#8a9eb0" />
              <Text style={styles.headquartersContactText}>
                info@nhis.gov.ng
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* State Dropdown Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={stateDropdownVisible}
        onRequestClose={() => setStateDropdownVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.dropdownModalContent}>
            <View style={styles.modalHandle} />
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select State</Text>
              <TouchableOpacity
                onPress={() => setStateDropdownVisible(false)}
                style={styles.modalCloseButton}
              >
                <Icon name="close" size={20} color="#6a7f92" />
              </TouchableOpacity>
            </View>

            <View style={styles.dropdownSearchWrapper}>
              <Icon name="search" size={16} color="#8a9eb0" />
              <TextInput
                style={styles.dropdownSearchInput}
                placeholder="Search state..."
                placeholderTextColor="#a8b5c0"
                value={stateSearch}
                onChangeText={setStateSearch}
              />
              {stateSearch.length > 0 && (
                <TouchableOpacity onPress={() => setStateSearch("")}>
                  <Icon name="close-circle" size={16} color="#c0c8d4" />
                </TouchableOpacity>
              )}
            </View>

            <FlatList
              data={filteredStates}
              keyExtractor={(item) => item.state}
              style={styles.dropdownList}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View style={styles.dropdownEmptyState}>
                  <Text style={styles.dropdownEmptyStateText}>
                    No matching states
                  </Text>
                </View>
              }
              renderItem={({ item }) => {
                const active = item.state === selectedState;
                return (
                  <TouchableOpacity
                    style={[
                      styles.dropdownItem,
                      active && styles.dropdownItemActive,
                    ]}
                    onPress={() => selectState(item.state)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.dropdownItemText,
                        active && styles.dropdownItemTextActive,
                      ]}
                    >
                      {item.state}
                    </Text>
                    {active && (
                      <Icon name="checkmark" size={18} color="#0b3b5c" />
                    )}
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </View>
      </Modal>

      {/* Mail Composer Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={mailModalVisible}
        onRequestClose={() => setMailModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHandle} />
            <View style={styles.modalHeader}>
              <View style={styles.modalTitleGroup}>
                <View style={styles.modalTitleIcon}>
                  <Icon name="paper-plane-outline" size={16} color="#0b3b5c" />
                </View>
                <Text style={styles.modalTitle}>Send Mail</Text>
              </View>
              <TouchableOpacity
                onPress={() => setMailModalVisible(false)}
                style={styles.modalCloseButton}
              >
                <Icon name="close" size={20} color="#6a7f92" />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.modalBody}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>To</Text>
                <TextInput
                  style={[styles.formInput, styles.formInputReadOnly]}
                  value={mailData.to}
                  editable={false}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Subject</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="e.g. Claim Issue #12345"
                  placeholderTextColor="#a8b5c0"
                  value={mailData.subject}
                  onChangeText={(text) =>
                    setMailData({ ...mailData, subject: text })
                  }
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Message</Text>
                <TextInput
                  style={[styles.formInput, styles.messageInput]}
                  placeholder="Describe your issue in detail..."
                  placeholderTextColor="#a8b5c0"
                  multiline
                  numberOfLines={6}
                  value={mailData.body}
                  onChangeText={(text) =>
                    setMailData({ ...mailData, body: text })
                  }
                />
              </View>

              <TouchableOpacity
                style={[
                  styles.sendButton,
                  !canSend && styles.sendButtonDisabled,
                ]}
                onPress={handleSendMail}
                disabled={!canSend}
              >
                <Icon name="paper-plane" size={17} color="white" />
                <Text style={styles.sendButtonText}>Send Mail</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setMailModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
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
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  backButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#e6edf4",
  },
  headerTitleGroup: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  headerIconChip: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: "#eaf3ee",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0b1a2e",
  },
  headerSubtitle: {
    fontSize: 12,
    color: "#8a9eb0",
    marginTop: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  sectionLabel: {
    fontSize: 11.5,
    fontWeight: "700",
    color: "#8a9eb0",
    letterSpacing: 0.6,
    marginBottom: 10,
    marginTop: 4,
    marginLeft: 2,
  },
  dropdownTrigger: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e6edf4",
    marginBottom: 20,
  },
  dropdownTriggerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  dropdownTriggerText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0b1a2e",
  },
  coordinatorCard: {
    backgroundColor: "white",
    padding: 18,
    borderRadius: 16,
    shadowColor: "#0b1a2e",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 1,
    marginBottom: 20,
  },
  coordinatorTopRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#eaf1f7",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  coordinatorInfo: {
    flex: 1,
  },
  coordinatorName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0b1a2e",
  },
  coordinatorRole: {
    fontSize: 12.5,
    color: "#8a9eb0",
    marginTop: 2,
  },
  coordinatorDetails: {
    borderTopWidth: 1,
    borderTopColor: "#f2f5f8",
    paddingTop: 12,
    marginBottom: 14,
    gap: 6,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  detailText: {
    fontSize: 13.5,
    color: "#4a5f72",
  },
  coordinatorActions: {
    flexDirection: "row",
    gap: 10,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  actionMail: {
    backgroundColor: "#0b3b5c",
  },
  actionCall: {
    backgroundColor: "#1a6d8a",
  },
  actionButtonText: {
    color: "white",
    fontSize: 13.5,
    fontWeight: "700",
  },
  headquarters: {
    backgroundColor: "white",
    padding: 18,
    borderRadius: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#0b3b5c",
    marginBottom: 10,
  },
  headquartersHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  headquartersTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0b1a2e",
  },
  headquartersAddressRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 7,
    marginBottom: 12,
  },
  headquartersAddress: {
    fontSize: 13,
    color: "#4a5f72",
    lineHeight: 19,
    flex: 1,
  },
  headquartersContact: {
    flexDirection: "row",
    gap: 18,
  },
  headquartersContactText: {
    fontSize: 13,
    color: "#0b1a2e",
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(11, 26, 46, 0.45)",
    justifyContent: "flex-end",
  },
  dropdownModalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 10,
    height: "70%",
  },
  dropdownSearchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3f7fc",
    borderRadius: 12,
    paddingHorizontal: 12,
    marginTop: 14,
    marginBottom: 10,
    gap: 8,
    borderWidth: 1,
    borderColor: "#e6edf4",
  },
  dropdownSearchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 14,
    color: "#0b1a2e",
  },
  dropdownList: {
    flex: 1,
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 2,
  },
  dropdownItemActive: {
    backgroundColor: "#eaf1f7",
  },
  dropdownItemText: {
    fontSize: 14.5,
    color: "#0b1a2e",
    fontWeight: "500",
  },
  dropdownItemTextActive: {
    fontWeight: "700",
    color: "#0b3b5c",
  },
  dropdownEmptyState: {
    alignItems: "center",
    paddingVertical: 40,
  },
  dropdownEmptyStateText: {
    fontSize: 13,
    color: "#8a9eb0",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 10,
    maxHeight: "90%",
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: "#d0d8e0",
    borderRadius: 4,
    alignSelf: "center",
    marginBottom: 14,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eef4f9",
  },
  modalTitleGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  modalTitleIcon: {
    width: 30,
    height: 30,
    borderRadius: 9,
    backgroundColor: "#eef6fb",
    alignItems: "center",
    justifyContent: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0b1a2e",
  },
  modalCloseButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#f2f5f8",
    alignItems: "center",
    justifyContent: "center",
  },
  modalBody: {
    paddingTop: 16,
    paddingBottom: 20,
  },
  formGroup: {
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 13.5,
    fontWeight: "700",
    color: "#0b1a2e",
    marginBottom: 6,
  },
  formInput: {
    borderWidth: 1.5,
    borderColor: "#e6edf4",
    borderRadius: 14,
    padding: 13,
    fontSize: 14.5,
    color: "#0b1a2e",
    backgroundColor: "#fafcfe",
  },
  formInputReadOnly: {
    backgroundColor: "#f3f7fc",
    color: "#6a7f92",
  },
  messageInput: {
    minHeight: 120,
    textAlignVertical: "top",
  },
  sendButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0b3b5c",
    padding: 15,
    borderRadius: 16,
    gap: 8,
    marginBottom: 10,
  },
  sendButtonDisabled: {
    backgroundColor: "#a8b5c0",
  },
  sendButtonText: {
    color: "white",
    fontSize: 15,
    fontWeight: "700",
  },
  cancelButton: {
    alignItems: "center",
    padding: 14,
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6a7f92",
  },
});
