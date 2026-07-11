import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Modal,
  TextInput as RNTextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import { FontAwesome } from "@expo/vector-icons";

// Mock data
const initialHospitals = [
  {
    id: "1",
    name: "Lagos University Teaching Hospital",
    address: "1, Idi-Araba, Surulere, Lagos",
    phone: "01-234-5678",
    accreditation: "accredited",
  },
  {
    id: "2",
    name: "Abuja National Hospital",
    address: "Plot 132, Central District, Abuja",
    phone: "09-876-5432",
    accreditation: "accredited",
  },
  {
    id: "3",
    name: "Port Harcourt Teaching Hospital",
    address: "East-West Road, Port Harcourt",
    phone: "084-123-4567",
    accreditation: "accredited",
  },
];

interface HospitalsScreenProps {
  navigation?: any;
}

export default function HospitalsScreen({ navigation }: HospitalsScreenProps) {
  const [hospitals, setHospitals] = useState(initialHospitals);
  const [searchQuery, setSearchQuery] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [newHospital, setNewHospital] = useState({
    name: "",
    address: "",
    phone: "",
    accreditation: "pending",
  });

  const filteredHospitals = hospitals.filter(
    (h) =>
      h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.address.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const getAccreditationColor = (status: string) => {
    switch (status) {
      case "accredited":
        return "#219653";
      case "pending":
        return "#f2994a";
      default:
        return "#eb5757";
    }
  };

  const getAccreditationIcon = (status: string) => {
    switch (status) {
      case "accredited":
        return "checkmark-circle";
      case "pending":
        return "time-outline";
      default:
        return "close-circle";
    }
  };

  const addHospital = () => {
    if (newHospital.name && newHospital.address) {
      const newId = (hospitals.length + 1).toString();
      setHospitals([...hospitals, { id: newId, ...newHospital }]);
      setNewHospital({
        name: "",
        address: "",
        phone: "",
        accreditation: "pending",
      });
      setModalVisible(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
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
              <FontAwesome name="hospital-o" size={16} color="#0B4D3A" />
            </View>
            <View>
              <Text style={styles.headerTitle}>Hospitals</Text>
              <Text style={styles.headerSubtitle}>
                {filteredHospitals.length} NHIS-accredited facilities
              </Text>
            </View>
          </View>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
          activeOpacity={0.8}
        >
          <Icon name="add" size={20} color="white" />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchWrapper}>
        <Icon
          name="search"
          size={18}
          color="#8a9eb0"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name or location..."
          placeholderTextColor="#8a9eb0"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery("")}>
            <Icon name="close-circle" size={18} color="#c0c8d4" />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.sectionLabel}>NEARBY FACILITIES</Text>

        {filteredHospitals.length === 0 ? (
          <View style={styles.emptyState}>
            <Icon name="search-outline" size={32} color="#c0c8d4" />
            <Text style={styles.emptyStateText}>
              No hospitals match "{searchQuery}"
            </Text>
          </View>
        ) : (
          filteredHospitals.map((hospital) => (
            <View key={hospital.id} style={styles.hospitalCard}>
              <View style={styles.hospitalIcon}>
                <Icon name="medical" size={22} color="#1a6d8a" />
              </View>
              <View style={styles.hospitalInfo}>
                <Text style={styles.hospitalName}>{hospital.name}</Text>
                <View style={styles.hospitalMetaRow}>
                  <Icon name="location-outline" size={13} color="#8a9eb0" />
                  <Text style={styles.hospitalMetaText} numberOfLines={1}>
                    {hospital.address}
                  </Text>
                </View>
                <View style={styles.hospitalMetaRow}>
                  <Icon name="call-outline" size={13} color="#8a9eb0" />
                  <Text style={styles.hospitalMetaText}>{hospital.phone}</Text>
                </View>
                <View
                  style={[
                    styles.accreditationBadge,
                    {
                      backgroundColor:
                        getAccreditationColor(hospital.accreditation) + "18",
                    },
                  ]}
                >
                  <Icon
                    name={getAccreditationIcon(hospital.accreditation)}
                    size={12}
                    color={getAccreditationColor(hospital.accreditation)}
                  />
                  <Text
                    style={[
                      styles.accreditationText,
                      {
                        color: getAccreditationColor(hospital.accreditation),
                      },
                    ]}
                  >
                    {hospital.accreditation.charAt(0).toUpperCase() +
                      hospital.accreditation.slice(1)}
                  </Text>
                </View>
              </View>
            </View>
          ))
        )}

        {/* Rights Section */}
        <Text style={[styles.sectionLabel, { marginTop: 20 }]}>
          KNOW YOUR RIGHTS
        </Text>
        <View style={styles.rightsSection}>
          <View style={[styles.rightsCard, styles.rightsPatient]}>
            <View style={styles.rightsHeader}>
              <Icon name="shield-checkmark" size={17} color="#219653" />
              <Text style={styles.rightsTitle}>Patient Rights</Text>
            </View>
            <RightsRow text="Right to quality healthcare" />
            <RightsRow text="Right to choose a provider" />
            <RightsRow text="Right to information on coverage" />
          </View>

          <View style={[styles.rightsCard, styles.rightsProvider]}>
            <View style={styles.rightsHeader}>
              <FontAwesome name="hospital-o" size={16} color="#1a6d8a" />
              <Text style={styles.rightsTitle}>Provider Rights</Text>
            </View>
            <RightsRow text="Right to timely reimbursement" />
            <RightsRow text="Right to fair claims processing" />
          </View>
        </View>
      </ScrollView>

      {/* Add Hospital Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHandle} />
            <View style={styles.modalHeader}>
              <View style={styles.modalTitleGroup}>
                <View style={styles.modalTitleIcon}>
                  <Icon name="add-circle-outline" size={18} color="#0b3b5c" />
                </View>
                <Text style={styles.modalTitle}>Add Hospital</Text>
              </View>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
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
                <Text style={styles.formLabel}>Hospital Name</Text>
                <RNTextInput
                  style={styles.formInput}
                  placeholder="e.g. Mercy Medical Center"
                  placeholderTextColor="#a8b5c0"
                  value={newHospital.name}
                  onChangeText={(text) =>
                    setNewHospital({ ...newHospital, name: text })
                  }
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Address</Text>
                <RNTextInput
                  style={styles.formInput}
                  placeholder="Full address"
                  placeholderTextColor="#a8b5c0"
                  value={newHospital.address}
                  onChangeText={(text) =>
                    setNewHospital({ ...newHospital, address: text })
                  }
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Phone Number</Text>
                <RNTextInput
                  style={styles.formInput}
                  placeholder="e.g. 080-123-4567"
                  placeholderTextColor="#a8b5c0"
                  keyboardType="phone-pad"
                  value={newHospital.phone}
                  onChangeText={(text) =>
                    setNewHospital({ ...newHospital, phone: text })
                  }
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Accreditation Status</Text>
                <View style={styles.radioGroup}>
                  {["accredited", "pending", "not-accredited"].map((status) => (
                    <TouchableOpacity
                      key={status}
                      style={[
                        styles.radioButton,
                        newHospital.accreditation === status &&
                          styles.radioSelected,
                      ]}
                      onPress={() =>
                        setNewHospital({
                          ...newHospital,
                          accreditation: status as any,
                        })
                      }
                    >
                      <Text
                        style={[
                          styles.radioText,
                          newHospital.accreditation === status &&
                            styles.radioTextSelected,
                        ]}
                      >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <TouchableOpacity
                style={[
                  styles.submitButton,
                  (!newHospital.name || !newHospital.address) &&
                    styles.submitButtonDisabled,
                ]}
                onPress={addHospital}
                disabled={!newHospital.name || !newHospital.address}
              >
                <Icon name="paper-plane" size={16} color="white" />
                <Text style={styles.submitButtonText}>Submit Hospital</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function RightsRow({ text }: { text: string }) {
  return (
    <View style={styles.rightsRow}>
      <Icon name="checkmark" size={13} color="#219653" />
      <Text style={styles.rightsText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f7fc",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 14,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
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
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "#0b3b5c",
    alignItems: "center",
    justifyContent: "center",
  },
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    marginHorizontal: 20,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e6edf4",
    marginBottom: 6,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14.5,
    color: "#0b1a2e",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
  },
  sectionLabel: {
    fontSize: 11.5,
    fontWeight: "700",
    color: "#8a9eb0",
    letterSpacing: 0.6,
    marginBottom: 10,
    marginLeft: 2,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 13,
    color: "#8a9eb0",
    marginTop: 8,
  },
  hospitalCard: {
    flexDirection: "row",
    backgroundColor: "white",
    marginBottom: 10,
    padding: 14,
    borderRadius: 16,
    shadowColor: "#0b1a2e",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 1,
  },
  hospitalIcon: {
    width: 44,
    height: 44,
    backgroundColor: "#eaf3f8",
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  hospitalInfo: {
    flex: 1,
  },
  hospitalName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0b1a2e",
    marginBottom: 4,
  },
  hospitalMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginBottom: 2,
  },
  hospitalMetaText: {
    fontSize: 12.5,
    color: "#6a7f92",
    flexShrink: 1,
  },
  accreditationBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 20,
    gap: 4,
    marginTop: 6,
  },
  accreditationText: {
    fontSize: 11,
    fontWeight: "700",
  },
  rightsSection: {
    gap: 10,
  },
  rightsCard: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: "white",
    borderLeftWidth: 4,
  },
  rightsPatient: {
    borderLeftColor: "#219653",
  },
  rightsProvider: {
    borderLeftColor: "#1a6d8a",
  },
  rightsHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  rightsTitle: {
    fontSize: 14.5,
    fontWeight: "700",
    color: "#0b1a2e",
  },
  rightsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 2,
  },
  rightsText: {
    fontSize: 13,
    color: "#4a5f72",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(11, 26, 46, 0.45)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 10,
    maxHeight: "88%",
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
  radioGroup: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  radioButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 30,
    borderWidth: 1.5,
    borderColor: "#e6edf4",
  },
  radioSelected: {
    borderColor: "#0b3b5c",
    backgroundColor: "#eaf1f7",
  },
  radioText: {
    fontSize: 12.5,
    fontWeight: "600",
    color: "#6a7f92",
  },
  radioTextSelected: {
    color: "#0b3b5c",
    fontWeight: "700",
  },
  submitButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0b3b5c",
    padding: 15,
    borderRadius: 16,
    gap: 8,
    marginTop: 4,
  },
  submitButtonDisabled: {
    backgroundColor: "#a8b5c0",
  },
  submitButtonText: {
    color: "white",
    fontSize: 15,
    fontWeight: "700",
  },
});
