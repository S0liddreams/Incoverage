import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";

// Mock data
const initialAppointments = [
  {
    id: "1",
    title: "Cardiology Checkup",
    doctor: "Dr. Okonkwo",
    date: "18",
    month: "Mar",
    time: "10:30 AM",
    status: "confirmed" as const,
    location: "LUTH Cardiology Unit",
  },
  {
    id: "2",
    title: "Lab Work - Blood Test",
    doctor: "NHIS Lab",
    date: "22",
    month: "Mar",
    time: "08:00 AM",
    status: "pending" as const,
    location: "NHIS Diagnostic Center",
  },
  {
    id: "3",
    title: "Dental Checkup",
    doctor: "Smile Dental",
    date: "05",
    month: "Apr",
    time: "02:00 PM",
    status: "pending" as const,
    location: "Smile Dental Clinic",
  },
];

export default function AppointmentsScreen() {
  const [appointments, setAppointments] = useState(initialAppointments);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTab, setSelectedTab] = useState<"upcoming" | "past">(
    "upcoming",
  );
  const [newAppointment, setNewAppointment] = useState({
    title: "",
    doctor: "",
    date: "",
    time: "",
    location: "",
  });

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "confirmed":
        return styles.confirmed;
      case "pending":
        return styles.pending;
      default:
        return styles.cancelled;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "confirmed":
        return "Confirmed";
      case "pending":
        return "Pending";
      default:
        return "Cancelled";
    }
  };

  const addAppointment = () => {
    if (newAppointment.title && newAppointment.date) {
      const newId = (appointments.length + 1).toString();
      setAppointments([
        ...appointments,
        {
          id: newId,
          ...newAppointment,
          month: "Mar", // Default for demo
          status: "pending",
        },
      ]);
      setNewAppointment({
        title: "",
        doctor: "",
        date: "",
        time: "",
        location: "",
      });
      setModalVisible(false);
      Alert.alert("Success", "Appointment scheduled successfully!");
    } else {
      Alert.alert("Error", "Please fill in at least the title and date.");
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          <Icon name="calendar" size={24} color="#0b3b5c" /> Appointments
        </Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <Icon name="add-circle" size={32} color="#0b3b5c" />
        </TouchableOpacity>
      </View>

      {/* Tab Switcher */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === "upcoming" && styles.tabActive]}
          onPress={() => setSelectedTab("upcoming")}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === "upcoming" && styles.tabTextActive,
            ]}
          >
            Upcoming
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === "past" && styles.tabActive]}
          onPress={() => setSelectedTab("past")}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === "past" && styles.tabTextActive,
            ]}
          >
            Past
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {selectedTab === "upcoming" ? (
          appointments.map((appt) => (
            <View key={appt.id} style={styles.appointmentCard}>
              <View style={styles.dateBox}>
                <Text style={styles.dateDay}>{appt.date}</Text>
                <Text style={styles.dateMonth}>{appt.month}</Text>
              </View>
              <View style={styles.apptInfo}>
                <Text style={styles.apptTitle}>{appt.title}</Text>
                <Text style={styles.apptDoctor}>
                  <Icon name="person" size={14} color="#6a7f92" /> {appt.doctor}
                </Text>
                <Text style={styles.apptTime}>
                  <Icon name="time" size={14} color="#6a7f92" /> {appt.time}
                </Text>
                <Text style={styles.apptLocation}>
                  <Icon name="location" size={14} color="#6a7f92" />{" "}
                  {appt.location}
                </Text>
              </View>
              <View>
                <View style={[styles.statusBadge, getStatusStyle(appt.status)]}>
                  <Text style={styles.statusText}>
                    {getStatusText(appt.status)}
                  </Text>
                </View>
                <TouchableOpacity style={styles.actionButton}>
                  <Icon name="ellipsis-vertical" size={20} color="#6a7f92" />
                </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Icon name="calendar-outline" size={60} color="#d0e0ec" />
            <Text style={styles.emptyStateTitle}>No Past Appointments</Text>
            <Text style={styles.emptyStateText}>
              Your past appointments will appear here.
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.scheduleButton}
          onPress={() => setModalVisible(true)}
        >
          <Icon name="calendar-plus" size={20} color="white" />
          <Text style={styles.scheduleButtonText}>
            Schedule New Appointment
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Add Appointment Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                <Icon name="calendar-plus" size={22} color="#0b3b5c" /> New
                Appointment
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Icon name="close" size={28} color="#6a7f92" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Appointment Title *</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="e.g. Cardiology Checkup"
                  value={newAppointment.title}
                  onChangeText={(text) =>
                    setNewAppointment({ ...newAppointment, title: text })
                  }
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Doctor/Hospital</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="e.g. Dr. Okonkwo"
                  value={newAppointment.doctor}
                  onChangeText={(text) =>
                    setNewAppointment({ ...newAppointment, doctor: text })
                  }
                />
              </View>

              <View style={styles.formRow}>
                <View style={[styles.formGroup, styles.formHalf]}>
                  <Text style={styles.formLabel}>Date *</Text>
                  <TextInput
                    style={styles.formInput}
                    placeholder="e.g. 25"
                    keyboardType="numeric"
                    value={newAppointment.date}
                    onChangeText={(text) =>
                      setNewAppointment({ ...newAppointment, date: text })
                    }
                  />
                </View>
                <View style={[styles.formGroup, styles.formHalf]}>
                  <Text style={styles.formLabel}>Time</Text>
                  <TextInput
                    style={styles.formInput}
                    placeholder="e.g. 10:30 AM"
                    value={newAppointment.time}
                    onChangeText={(text) =>
                      setNewAppointment({ ...newAppointment, time: text })
                    }
                  />
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Location</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="e.g. LUTH Cardiology Unit"
                  value={newAppointment.location}
                  onChangeText={(text) =>
                    setNewAppointment({ ...newAppointment, location: text })
                  }
                />
              </View>

              <TouchableOpacity
                style={styles.submitButton}
                onPress={addAppointment}
              >
                <Icon name="checkmark" size={18} color="white" />
                <Text style={styles.submitButtonText}>
                  Schedule Appointment
                </Text>
              </TouchableOpacity>
            </View>
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
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0b1a2e",
  },
  addButton: {
    padding: 4,
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
  appointmentCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    marginHorizontal: 20,
    marginBottom: 10,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#eef4f9",
  },
  dateBox: {
    backgroundColor: "#0b3b5c",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: "center",
    minWidth: 48,
    marginRight: 14,
  },
  dateDay: {
    color: "white",
    fontSize: 20,
    fontWeight: "800",
    lineHeight: 24,
  },
  dateMonth: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 11,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  apptInfo: {
    flex: 1,
  },
  apptTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0b1a2e",
  },
  apptDoctor: {
    fontSize: 13,
    color: "#6a7f92",
    marginTop: 2,
  },
  apptTime: {
    fontSize: 13,
    color: "#6a7f92",
    marginTop: 2,
  },
  apptLocation: {
    fontSize: 13,
    color: "#6a7f92",
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: "flex-start",
    marginBottom: 4,
  },
  confirmed: {
    backgroundColor: "#d4edda",
  },
  pending: {
    backgroundColor: "#fff3cd",
  },
  cancelled: {
    backgroundColor: "#f8d7da",
  },
  statusText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#155724",
  },
  actionButton: {
    padding: 4,
    alignSelf: "center",
  },
  scheduleButton: {
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
  scheduleButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 60,
    backgroundColor: "white",
    marginHorizontal: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#eef4f9",
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0b1a2e",
    marginTop: 12,
  },
  emptyStateText: {
    fontSize: 14,
    color: "#6a7f92",
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    maxHeight: "90%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eef4f9",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0b1a2e",
  },
  modalBody: {
    paddingTop: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  formRow: {
    flexDirection: "row",
    gap: 10,
  },
  formHalf: {
    flex: 1,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0b1a2e",
    marginBottom: 6,
  },
  formInput: {
    borderWidth: 2,
    borderColor: "#e6edf4",
    borderRadius: 14,
    padding: 14,
    fontSize: 15,
    color: "#0b1a2e",
  },
  submitButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0b3b5c",
    padding: 16,
    borderRadius: 16,
    gap: 10,
    marginTop: 8,
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },
});
