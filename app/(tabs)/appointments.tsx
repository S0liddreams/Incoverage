import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";

/* ---------------------------------------------------------
   CONSTANTS & HELPERS
--------------------------------------------------------- */

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const MONTH_SHORT = MONTH_NAMES.map((m) => m.slice(0, 3));
const DAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

function pad(n: number) {
  return n < 10 ? `0${n}` : `${n}`;
}

function toISODate(year: number, month: number, day: number) {
  // month is 0-indexed
  return `${year}-${pad(month + 1)}-${pad(day)}`;
}

function today() {
  const d = new Date();
  return { year: d.getFullYear(), month: d.getMonth(), day: d.getDate() };
}

function todayISO() {
  const t = today();
  return toISODate(t.year, t.month, t.day);
}

function formatDisplayDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return { day: pad(d), month: MONTH_SHORT[m - 1] };
}

function formatFullDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return `${MONTH_NAMES[m - 1]} ${d}, ${y}`;
}

// "8:00 AM" -> { hours: 8, minutes: 0 } in 24h
function parseTime(time: string) {
  const match = time.match(/(\d+):(\d+)\s?(AM|PM)/i);
  if (!match) return { hours: 0, minutes: 0 };
  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const period = match[3].toUpperCase();
  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;
  return { hours, minutes };
}

function getDateTime(iso: string, time: string) {
  const [y, m, d] = iso.split("-").map(Number);
  const { hours, minutes } = parseTime(time);
  return new Date(y, m - 1, d, hours, minutes);
}

function isPastAppointment(iso: string, time: string) {
  return getDateTime(iso, time).getTime() < Date.now();
}

function generateTimeSlots() {
  const slots: string[] = [];
  for (let hour = 8; hour <= 17; hour++) {
    for (const min of [0, 30]) {
      if (hour === 17 && min === 30) continue; // clinic closes 5:00 PM
      const period = hour < 12 ? "AM" : "PM";
      let displayHour = hour % 12;
      if (displayHour === 0) displayHour = 12;
      slots.push(`${displayHour}:${pad(min)} ${period}`);
    }
  }
  return slots;
}
const TIME_SLOTS = generateTimeSlots();

type Status = "confirmed" | "pending" | "cancelled";

interface Appointment {
  id: string;
  title: string;
  doctor: string;
  location: string;
  isoDate: string;
  time: string;
  status: Status;
}

// Mock data — dated relative to "today" so Upcoming / Past behave correctly
const t = today();
const initialAppointments: Appointment[] = [
  {
    id: "1",
    title: "Cardiology Checkup",
    doctor: "Dr. Okonkwo",
    location: "LUTH Cardiology Unit",
    isoDate: toISODate(t.year, t.month, Math.min(t.day + 7, 27)),
    time: "10:30 AM",
    status: "confirmed",
  },
  {
    id: "2",
    title: "Lab Work - Blood Test",
    doctor: "NHIS Lab",
    location: "NHIS Diagnostic Center",
    isoDate: toISODate(t.year, t.month, Math.min(t.day + 11, 28)),
    time: "8:00 AM",
    status: "pending",
  },
  {
    id: "3",
    title: "Dental Checkup",
    doctor: "Smile Dental",
    location: "Smile Dental Clinic",
    isoDate: toISODate(t.year, t.month, Math.max(t.day - 20, 1)),
    time: "2:00 PM",
    status: "confirmed",
  },
];

function getStatusStyle(status: Status) {
  switch (status) {
    case "confirmed":
      return styles.confirmed;
    case "pending":
      return styles.pending;
    default:
      return styles.cancelled;
  }
}

function getStatusText(status: Status) {
  switch (status) {
    case "confirmed":
      return "Confirmed";
    case "pending":
      return "Pending";
    default:
      return "Cancelled";
  }
}

/* ---------------------------------------------------------
   MINI CALENDAR — reusable month grid
--------------------------------------------------------- */

function MiniCalendar({
  year,
  month,
  selectedDate,
  markedDates,
  onSelectDate,
  onPrevMonth,
  onNextMonth,
}: {
  year: number;
  month: number;
  selectedDate: string | null;
  markedDates: Set<string>;
  onSelectDate: (iso: string) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}) {
  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDayIndex; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const tISO = todayISO();

  return (
    <View style={styles.calendarCard}>
      <View style={styles.calendarHeader}>
        <TouchableOpacity
          onPress={onPrevMonth}
          style={styles.calendarNavButton}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Icon name="chevron-back" size={18} color="#0b3b5c" />
        </TouchableOpacity>
        <Text style={styles.calendarMonthLabel}>
          {MONTH_NAMES[month]} {year}
        </Text>
        <TouchableOpacity
          onPress={onNextMonth}
          style={styles.calendarNavButton}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Icon name="chevron-forward" size={18} color="#0b3b5c" />
        </TouchableOpacity>
      </View>

      <View style={styles.calendarDayLabelsRow}>
        {DAY_LABELS.map((d, i) => (
          <Text key={i} style={styles.calendarDayLabel}>
            {d}
          </Text>
        ))}
      </View>

      <View style={styles.calendarGrid}>
        {cells.map((day, idx) => {
          if (day === null) {
            return <View key={idx} style={styles.calendarCell} />;
          }
          const iso = toISODate(year, month, day);
          const isSelected = iso === selectedDate;
          const isToday = iso === tISO;
          const hasAppt = markedDates.has(iso);
          return (
            <TouchableOpacity
              key={idx}
              style={styles.calendarCell}
              onPress={() => onSelectDate(iso)}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.calendarDayCircle,
                  isToday && !isSelected && styles.calendarDayCircleToday,
                  isSelected && styles.calendarDayCircleSelected,
                ]}
              >
                <Text
                  style={[
                    styles.calendarDayText,
                    isToday && !isSelected && styles.calendarDayTextToday,
                    isSelected && styles.calendarDayTextSelected,
                  ]}
                >
                  {day}
                </Text>
              </View>
              {hasAppt && (
                <View
                  style={[
                    styles.calendarDot,
                    isSelected && styles.calendarDotSelected,
                  ]}
                />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

/* ---------------------------------------------------------
   APPOINTMENT CARD
--------------------------------------------------------- */

function AppointmentCard({
  appt,
  onEdit,
  onDelete,
}: {
  appt: Appointment;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const { day, month } = formatDisplayDate(appt.isoDate);
  return (
    <View style={styles.appointmentCard}>
      <View style={styles.dateBox}>
        <Text style={styles.dateDay}>{day}</Text>
        <Text style={styles.dateMonth}>{month}</Text>
      </View>
      <View style={styles.apptInfo}>
        <Text style={styles.apptTitle}>{appt.title}</Text>
        {!!appt.doctor && (
          <Text style={styles.apptMeta}>
            <Icon name="person" size={13} color="#6a7f92" /> {appt.doctor}
          </Text>
        )}
        <Text style={styles.apptMeta}>
          <Icon name="time" size={13} color="#6a7f92" /> {appt.time}
        </Text>
        {!!appt.location && (
          <Text style={styles.apptMeta}>
            <Icon name="location" size={13} color="#6a7f92" /> {appt.location}
          </Text>
        )}
        <View style={[styles.statusBadge, getStatusStyle(appt.status)]}>
          <Text style={styles.statusText}>{getStatusText(appt.status)}</Text>
        </View>
      </View>
      <View style={styles.cardActionsCol}>
        <TouchableOpacity
          style={styles.cardActionButton}
          onPress={onEdit}
          hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
        >
          <Icon name="create-outline" size={18} color="#0b3b5c" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.cardActionButton}
          onPress={onDelete}
          hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
        >
          <Icon name="trash-outline" size={18} color="#c0392b" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* ---------------------------------------------------------
   MAIN SCREEN
--------------------------------------------------------- */

const emptyForm = {
  title: "",
  doctor: "",
  location: "",
  isoDate: todayISO(),
  time: TIME_SLOTS[0],
};

export default function AppointmentsScreen() {
  const insets = useSafeAreaInsets();
  const [appointments, setAppointments] =
    useState<Appointment[]>(initialAppointments);
  const [selectedTab, setSelectedTab] = useState<"upcoming" | "past">(
    "upcoming",
  );

  // Calendar strip on the main screen — lets a user tap a day to see
  // what's scheduled, independent of the Upcoming / Past tabs.
  const [calYear, setCalYear] = useState(t.year);
  const [calMonth, setCalMonth] = useState(t.month);
  const [dateFilter, setDateFilter] = useState<string | null>(null);

  // Add / edit modal
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [modalCalYear, setModalCalYear] = useState(t.year);
  const [modalCalMonth, setModalCalMonth] = useState(t.month);

  const markedDates = useMemo(
    () => new Set(appointments.map((a) => a.isoDate)),
    [appointments],
  );

  const sorted = useMemo(
    () =>
      [...appointments].sort(
        (a, b) =>
          getDateTime(a.isoDate, a.time).getTime() -
          getDateTime(b.isoDate, b.time).getTime(),
      ),
    [appointments],
  );

  const upcoming = sorted.filter((a) => !isPastAppointment(a.isoDate, a.time));
  const past = [...sorted]
    .filter((a) => isPastAppointment(a.isoDate, a.time))
    .reverse();

  const visibleAppointments = dateFilter
    ? sorted.filter((a) => a.isoDate === dateFilter)
    : selectedTab === "upcoming"
      ? upcoming
      : past;

  const openAddModal = (presetDate?: string) => {
    const isoDate = presetDate ?? dateFilter ?? todayISO();
    const [y, m] = isoDate.split("-").map(Number);
    setEditingId(null);
    setForm({ ...emptyForm, isoDate });
    setModalCalYear(y);
    setModalCalMonth(m - 1);
    setModalVisible(true);
  };

  const openEditModal = (appt: Appointment) => {
    const [y, m] = appt.isoDate.split("-").map(Number);
    setEditingId(appt.id);
    setForm({
      title: appt.title,
      doctor: appt.doctor,
      location: appt.location,
      isoDate: appt.isoDate,
      time: appt.time,
    });
    setModalCalYear(y);
    setModalCalMonth(m - 1);
    setModalVisible(true);
  };

  const closeModal = () => setModalVisible(false);

  const saveAppointment = () => {
    if (!form.title.trim()) {
      Alert.alert("Missing title", "Please give the appointment a title.");
      return;
    }
    if (editingId) {
      setAppointments((prev) =>
        prev.map((a) =>
          a.id === editingId
            ? {
                ...a,
                title: form.title.trim(),
                doctor: form.doctor.trim(),
                location: form.location.trim(),
                isoDate: form.isoDate,
                time: form.time,
              }
            : a,
        ),
      );
      Alert.alert("Saved", "Appointment updated.");
    } else {
      const newAppt: Appointment = {
        id: Date.now().toString(),
        title: form.title.trim(),
        doctor: form.doctor.trim(),
        location: form.location.trim(),
        isoDate: form.isoDate,
        time: form.time,
        status: "pending",
      };
      setAppointments((prev) => [...prev, newAppt]);
      Alert.alert("Scheduled", "Appointment added to your calendar.");
    }
    setModalVisible(false);
  };

  const deleteAppointment = (id: string) => {
    Alert.alert(
      "Delete appointment",
      "Are you sure you want to remove this appointment?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () =>
            setAppointments((prev) => prev.filter((a) => a.id !== id)),
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          <Icon name="calendar" size={22} color="#0b3b5c" /> Appointments
        </Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => openAddModal()}
        >
          <Icon name="add-circle" size={32} color="#0b3b5c" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Month calendar */}
        <MiniCalendar
          year={calYear}
          month={calMonth}
          selectedDate={dateFilter}
          markedDates={markedDates}
          onSelectDate={(iso) =>
            setDateFilter((prev) => (prev === iso ? null : iso))
          }
          onPrevMonth={() => {
            if (calMonth === 0) {
              setCalMonth(11);
              setCalYear((y) => y - 1);
            } else {
              setCalMonth((m) => m - 1);
            }
          }}
          onNextMonth={() => {
            if (calMonth === 11) {
              setCalMonth(0);
              setCalYear((y) => y + 1);
            } else {
              setCalMonth((m) => m + 1);
            }
          }}
        />

        {dateFilter ? (
          <View style={styles.filterChipRow}>
            <View style={styles.filterChip}>
              <Icon name="calendar-outline" size={13} color="#0b3b5c" />
              <Text style={styles.filterChipText}>
                {formatFullDate(dateFilter)}
              </Text>
              <TouchableOpacity onPress={() => setDateFilter(null)}>
                <Icon name="close-circle" size={16} color="#0b3b5c" />
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[
                styles.tab,
                selectedTab === "upcoming" && styles.tabActive,
              ]}
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
        )}

        {visibleAppointments.length === 0 ? (
          <View style={styles.emptyState}>
            <Icon name="calendar-outline" size={52} color="#d0e0ec" />
            <Text style={styles.emptyStateTitle}>
              {dateFilter
                ? "Nothing scheduled this day"
                : selectedTab === "upcoming"
                  ? "No Upcoming Appointments"
                  : "No Past Appointments"}
            </Text>
            <Text style={styles.emptyStateText}>
              {dateFilter
                ? "Tap below to add one for this date."
                : "Your appointments will appear here."}
            </Text>
          </View>
        ) : (
          visibleAppointments.map((appt) => (
            <AppointmentCard
              key={appt.id}
              appt={appt}
              onEdit={() => openEditModal(appt)}
              onDelete={() => deleteAppointment(appt.id)}
            />
          ))
        )}

        <TouchableOpacity
          style={styles.scheduleButton}
          onPress={() => openAddModal(dateFilter ?? undefined)}
        >
          <Icon name="add-circle-outline" size={20} color="white" />
          <Text style={styles.scheduleButtonText}>
            Schedule New Appointment
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Add / Edit Appointment Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={styles.modalKeyboardWrapper}
          >
            <View
              style={[
                styles.modalContent,
                { paddingBottom: Math.max(insets.bottom, 12) },
              ]}
            >
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  <Icon
                    name={editingId ? "create-outline" : "add-circle-outline"}
                    size={20}
                    color="#0b3b5c"
                  />{" "}
                  {editingId ? "Edit Appointment" : "New Appointment"}
                </Text>
                <TouchableOpacity onPress={closeModal}>
                  <Icon name="close" size={26} color="#6a7f92" />
                </TouchableOpacity>
              </View>

              <ScrollView
                style={styles.modalScroll}
                contentContainerStyle={styles.modalScrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              >
                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Appointment Title *</Text>
                  <TextInput
                    style={styles.formInput}
                    placeholder="e.g. Cardiology Checkup"
                    placeholderTextColor="#a8b5c0"
                    value={form.title}
                    onChangeText={(text) =>
                      setForm((f) => ({ ...f, title: text }))
                    }
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Doctor / Hospital</Text>
                  <TextInput
                    style={styles.formInput}
                    placeholder="e.g. Dr. Okonkwo"
                    placeholderTextColor="#a8b5c0"
                    value={form.doctor}
                    onChangeText={(text) =>
                      setForm((f) => ({ ...f, doctor: text }))
                    }
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Location</Text>
                  <TextInput
                    style={styles.formInput}
                    placeholder="e.g. LUTH Cardiology Unit"
                    placeholderTextColor="#a8b5c0"
                    value={form.location}
                    onChangeText={(text) =>
                      setForm((f) => ({ ...f, location: text }))
                    }
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Date *</Text>
                  <MiniCalendar
                    year={modalCalYear}
                    month={modalCalMonth}
                    selectedDate={form.isoDate}
                    markedDates={markedDates}
                    onSelectDate={(iso) =>
                      setForm((f) => ({ ...f, isoDate: iso }))
                    }
                    onPrevMonth={() => {
                      if (modalCalMonth === 0) {
                        setModalCalMonth(11);
                        setModalCalYear((y) => y - 1);
                      } else {
                        setModalCalMonth((m) => m - 1);
                      }
                    }}
                    onNextMonth={() => {
                      if (modalCalMonth === 11) {
                        setModalCalMonth(0);
                        setModalCalYear((y) => y + 1);
                      } else {
                        setModalCalMonth((m) => m + 1);
                      }
                    }}
                  />
                  <Text style={styles.selectedDateLabel}>
                    Selected: {formatFullDate(form.isoDate)}
                  </Text>
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Time *</Text>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.timeSlotRow}
                  >
                    {TIME_SLOTS.map((slot) => {
                      const isSelected = form.time === slot;
                      return (
                        <TouchableOpacity
                          key={slot}
                          style={[
                            styles.timeSlotChip,
                            isSelected && styles.timeSlotChipSelected,
                          ]}
                          onPress={() => setForm((f) => ({ ...f, time: slot }))}
                        >
                          <Text
                            style={[
                              styles.timeSlotChipText,
                              isSelected && styles.timeSlotChipTextSelected,
                            ]}
                          >
                            {slot}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>
                </View>

                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={saveAppointment}
                >
                  <Icon name="checkmark" size={18} color="white" />
                  <Text style={styles.submitButtonText}>
                    {editingId ? "Save Changes" : "Schedule Appointment"}
                  </Text>
                </TouchableOpacity>

                {editingId && (
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => {
                      setModalVisible(false);
                      deleteAppointment(editingId);
                    }}
                  >
                    <Icon name="trash-outline" size={16} color="#c0392b" />
                    <Text style={styles.deleteButtonText}>
                      Delete Appointment
                    </Text>
                  </TouchableOpacity>
                )}
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

/* ---------------------------------------------------------
   STYLES
--------------------------------------------------------- */

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
    paddingBottom: 14,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0b1a2e",
  },
  addButton: {
    padding: 4,
  },

  /* Calendar */
  calendarCard: {
    backgroundColor: "white",
    marginHorizontal: 20,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: "#eef4f9",
    marginBottom: 14,
  },
  calendarHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  calendarNavButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#f2f5f8",
    alignItems: "center",
    justifyContent: "center",
  },
  calendarMonthLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0b1a2e",
  },
  calendarDayLabelsRow: {
    flexDirection: "row",
    marginBottom: 4,
  },
  calendarDayLabel: {
    width: `${100 / 7}%`,
    textAlign: "center",
    fontSize: 11,
    fontWeight: "700",
    color: "#a8b5c0",
  },
  calendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  calendarCell: {
    width: `${100 / 7}%`,
    alignItems: "center",
    paddingVertical: 4,
  },
  calendarDayCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  calendarDayCircleToday: {
    borderWidth: 1.5,
    borderColor: "#0b3b5c",
  },
  calendarDayCircleSelected: {
    backgroundColor: "#0b3b5c",
  },
  calendarDayText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#0b1a2e",
  },
  calendarDayTextToday: {
    color: "#0b3b5c",
    fontWeight: "800",
  },
  calendarDayTextSelected: {
    color: "white",
  },
  calendarDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#0b3b5c",
    marginTop: 2,
  },
  calendarDotSelected: {
    backgroundColor: "#6fcf97",
  },

  /* Date filter chip */
  filterChipRow: {
    paddingHorizontal: 20,
    marginBottom: 14,
  },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 6,
    backgroundColor: "#eaf1f7",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
  },
  filterChipText: {
    fontSize: 12.5,
    fontWeight: "700",
    color: "#0b3b5c",
  },

  /* Tabs */
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

  /* Appointment card */
  appointmentCard: {
    flexDirection: "row",
    alignItems: "flex-start",
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
    marginBottom: 3,
  },
  apptMeta: {
    fontSize: 13,
    color: "#6a7f92",
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: "flex-start",
    marginTop: 8,
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
  cardActionsCol: {
    alignItems: "center",
    gap: 10,
    marginLeft: 8,
  },
  cardActionButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#f2f5f8",
    alignItems: "center",
    justifyContent: "center",
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
    paddingVertical: 48,
    backgroundColor: "white",
    marginHorizontal: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#eef4f9",
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#0b1a2e",
    marginTop: 12,
  },
  emptyStateText: {
    fontSize: 13.5,
    color: "#6a7f92",
    marginTop: 4,
  },

  /* Modal */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalKeyboardWrapper: {
    maxHeight: "90%",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingTop: 20,
    flexShrink: 1,
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
    fontSize: 19,
    fontWeight: "700",
    color: "#0b1a2e",
  },
  modalScroll: {
    paddingTop: 16,
  },
  modalScrollContent: {
    paddingBottom: 24,
  },
  formGroup: {
    marginBottom: 18,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0b1a2e",
    marginBottom: 8,
  },
  formInput: {
    borderWidth: 2,
    borderColor: "#e6edf4",
    borderRadius: 14,
    padding: 14,
    fontSize: 15,
    color: "#0b1a2e",
  },
  selectedDateLabel: {
    fontSize: 12.5,
    color: "#6a7f92",
    marginTop: 8,
    fontWeight: "600",
  },
  timeSlotRow: {
    gap: 8,
    paddingRight: 4,
  },
  timeSlotChip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: "#f2f5f8",
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  timeSlotChipSelected: {
    backgroundColor: "#0b3b5c",
    borderColor: "#0b3b5c",
  },
  timeSlotChipText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#4a5f72",
  },
  timeSlotChipTextSelected: {
    color: "white",
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
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    marginTop: 6,
    marginBottom: 8,
  },
  deleteButtonText: {
    color: "#c0392b",
    fontSize: 14,
    fontWeight: "700",
  },
});
