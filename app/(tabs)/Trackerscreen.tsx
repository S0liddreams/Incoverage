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
   DATE HELPERS
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

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function isoToDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function daysBetween(fromISO: string, toISO2: string) {
  const MS = 86400000;
  const a = startOfDay(isoToDate(fromISO)).getTime();
  const b = startOfDay(isoToDate(toISO2)).getTime();
  return Math.round((b - a) / MS);
}

function addDays(iso: string, days: number) {
  const dt = isoToDate(iso);
  dt.setDate(dt.getDate() + days);
  return toISODate(dt.getFullYear(), dt.getMonth(), dt.getDate());
}

function formatDisplay(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${MONTH_SHORT[m - 1]} ${y}`;
}

/* ---------------------------------------------------------
   DATA MODEL
--------------------------------------------------------- */

interface Refill {
  id: string;
  name: string;
  collectedDate: string; // ISO yyyy-mm-dd — day the medication was picked up
  durationDays: number; // how many days the supply is meant to last
}

const initialRefills: Refill[] = [
  {
    id: "1",
    name: "Amoxicillin 500mg",
    collectedDate: addDays(todayISO(), -14),
    durationDays: 21,
  },
  {
    id: "2",
    name: "Lisinopril 10mg",
    collectedDate: addDays(todayISO(), -27),
    durationDays: 30,
  },
];

const DURATION_PRESETS = [
  { label: "7 days", value: 7 },
  { label: "14 days", value: 14 },
  { label: "21 days", value: 21 },
  { label: "1 month", value: 30 },
  { label: "2 months", value: 60 },
  { label: "3 months", value: 90 },
];

type Status = "on-track" | "expiring" | "overdue";

function getRefillStatus(daysRemaining: number, durationDays: number): Status {
  if (daysRemaining <= 0) return "overdue";
  const warnAt = Math.max(3, Math.round(durationDays * 0.15));
  if (daysRemaining <= warnAt) return "expiring";
  return "on-track";
}

function enrichRefill(refill: Refill) {
  const expiryDate = addDays(refill.collectedDate, refill.durationDays);
  const daysRemaining = daysBetween(todayISO(), expiryDate);
  const status = getRefillStatus(daysRemaining, refill.durationDays);
  const percentRemaining = Math.max(
    0,
    Math.min(1, daysRemaining / refill.durationDays),
  );
  return { ...refill, expiryDate, daysRemaining, status, percentRemaining };
}

/* ---------------------------------------------------------
   MINI CALENDAR — for picking the collection date
--------------------------------------------------------- */

function MiniCalendar({
  year,
  month,
  selectedDate,
  onSelectDate,
  onPrevMonth,
  onNextMonth,
}: {
  year: number;
  month: number;
  selectedDate: string;
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
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

/* ---------------------------------------------------------
   REFILL CARD
--------------------------------------------------------- */

function statusMeta(status: Status) {
  switch (status) {
    case "on-track":
      return {
        badgeBg: styles.statusOnTrack,
        textStyle: styles.statusOnTrackText,
        color: "#219653",
        barColor: "#219653",
        icon: "checkmark-circle" as const,
        label: "On Track",
      };
    case "expiring":
      return {
        badgeBg: styles.statusExpiring,
        textStyle: styles.statusExpiringText,
        color: "#b7791f",
        barColor: "#f2994a",
        icon: "warning" as const,
        label: "Expiring Soon",
      };
    default:
      return {
        badgeBg: styles.statusOverdue,
        textStyle: styles.statusOverdueText,
        color: "#c0392b",
        barColor: "#c0392b",
        icon: "alert-circle" as const,
        label: "Finished",
      };
  }
}

function RefillCard({
  refill,
  onEdit,
  onDelete,
}: {
  refill: ReturnType<typeof enrichRefill>;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const meta = statusMeta(refill.status);
  const daysLeftLabel =
    refill.daysRemaining > 0
      ? `${refill.daysRemaining} day${refill.daysRemaining !== 1 ? "s" : ""} left`
      : `Finished ${Math.abs(refill.daysRemaining)} day${
          Math.abs(refill.daysRemaining) !== 1 ? "s" : ""
        } ago`;

  return (
    <View style={[styles.refillCard, { borderLeftColor: meta.barColor }]}>
      <View style={styles.refillHeader}>
        <View style={styles.refillTitleGroup}>
          <View style={styles.refillIconChip}>
            <Icon name="medkit-outline" size={16} color="#0b3b5c" />
          </View>
          <Text style={styles.refillName} numberOfLines={2}>
            {refill.name}
          </Text>
        </View>
        <View style={[styles.refillStatus, meta.badgeBg]}>
          <Icon name={meta.icon} size={13} color={meta.color} />
          <Text style={[styles.refillStatusText, meta.textStyle]}>
            {meta.label}
          </Text>
        </View>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressLabel}>{daysLeftLabel}</Text>
          <Text style={styles.progressValue}>
            of {refill.durationDays} day supply
          </Text>
        </View>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${refill.percentRemaining * 100}%`,
                backgroundColor: meta.barColor,
              },
            ]}
          />
        </View>
      </View>

      <View style={styles.refillDetails}>
        <Text style={styles.refillDetail}>
          <Icon name="calendar-outline" size={13} color="#6a7f92" /> Collected{" "}
          {formatDisplay(refill.collectedDate)}
        </Text>
        <Text style={styles.refillDetail}>
          <Icon name="refresh-outline" size={13} color="#6a7f92" /> Refill by{" "}
          {formatDisplay(refill.expiryDate)}
        </Text>
      </View>

      <View style={styles.refillActionsRow}>
        <TouchableOpacity style={styles.refillActionButton} onPress={onEdit}>
          <Icon name="create-outline" size={15} color="#0b3b5c" />
          <Text style={styles.refillActionText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.refillActionButton} onPress={onDelete}>
          <Icon name="trash-outline" size={15} color="#c0392b" />
          <Text style={[styles.refillActionText, { color: "#c0392b" }]}>
            Remove
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* ---------------------------------------------------------
   MAIN SCREEN
--------------------------------------------------------- */

const emptyForm = {
  name: "",
  collectedDate: todayISO(),
  durationDays: 30,
  customDuration: "",
};

export default function TrackerScreen() {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<"plan" | "refills">("plan");
  const [refills, setRefills] = useState<Refill[]>(initialRefills);

  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [useCustomDuration, setUseCustomDuration] = useState(false);
  const [calYear, setCalYear] = useState(today().year);
  const [calMonth, setCalMonth] = useState(today().month);

  const enrichedRefills = useMemo(
    () =>
      refills
        .map(enrichRefill)
        .sort((a, b) => a.daysRemaining - b.daysRemaining),
    [refills],
  );

  const openAddModal = () => {
    setEditingId(null);
    setForm(emptyForm);
    setUseCustomDuration(false);
    const [y, m] = emptyForm.collectedDate.split("-").map(Number);
    setCalYear(y);
    setCalMonth(m - 1);
    setModalVisible(true);
  };

  const openEditModal = (refill: Refill) => {
    setEditingId(refill.id);
    const isPreset = DURATION_PRESETS.some(
      (p) => p.value === refill.durationDays,
    );
    setForm({
      name: refill.name,
      collectedDate: refill.collectedDate,
      durationDays: refill.durationDays,
      customDuration: isPreset ? "" : String(refill.durationDays),
    });
    setUseCustomDuration(!isPreset);
    const [y, m] = refill.collectedDate.split("-").map(Number);
    setCalYear(y);
    setCalMonth(m - 1);
    setModalVisible(true);
  };

  const closeModal = () => setModalVisible(false);

  const saveRefill = () => {
    if (!form.name.trim()) {
      Alert.alert("Missing name", "Please enter the medication name.");
      return;
    }
    const duration = useCustomDuration
      ? parseInt(form.customDuration, 10)
      : form.durationDays;

    if (!duration || duration <= 0) {
      Alert.alert(
        "Missing duration",
        "Please enter how many days this medication should last.",
      );
      return;
    }

    if (editingId) {
      setRefills((prev) =>
        prev.map((r) =>
          r.id === editingId
            ? {
                ...r,
                name: form.name.trim(),
                collectedDate: form.collectedDate,
                durationDays: duration,
              }
            : r,
        ),
      );
    } else {
      setRefills((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          name: form.name.trim(),
          collectedDate: form.collectedDate,
          durationDays: duration,
        },
      ]);
    }
    setModalVisible(false);
  };

  const deleteRefill = (id: string) => {
    Alert.alert(
      "Remove medication",
      "Stop tracking this medication's refill schedule?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => setRefills((prev) => prev.filter((r) => r.id !== id)),
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          <Icon name="stats-chart" size={22} color="#0b3b5c" /> Plan Tracker
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
                  <View
                    style={[
                      styles.progressFill,
                      { width: "62%", backgroundColor: "#0b3b5c" },
                    ]}
                  />
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
            <View style={styles.refillsSectionHeader}>
              <Text style={styles.sectionTitle}>
                <Icon name="refresh" size={18} color="#0b3b5c" /> Medication
                Refill Tracker
              </Text>
              <Text style={styles.sectionSubtitle}>
                Log when you collected a medication and how long it should last
                — we'll work out what's left.
              </Text>
            </View>

            {enrichedRefills.length === 0 ? (
              <View style={styles.emptyState}>
                <Icon name="medkit-outline" size={48} color="#d0e0ec" />
                <Text style={styles.emptyStateTitle}>
                  No medications tracked yet
                </Text>
                <Text style={styles.emptyStateText}>
                  Add one below to start tracking your supply.
                </Text>
              </View>
            ) : (
              enrichedRefills.map((refill) => (
                <RefillCard
                  key={refill.id}
                  refill={refill}
                  onEdit={() =>
                    openEditModal({
                      id: refill.id,
                      name: refill.name,
                      collectedDate: refill.collectedDate,
                      durationDays: refill.durationDays,
                    })
                  }
                  onDelete={() => deleteRefill(refill.id)}
                />
              ))
            )}

            <TouchableOpacity
              style={styles.requestButton}
              onPress={openAddModal}
            >
              <Icon name="add" size={20} color="white" />
              <Text style={styles.requestButtonText}>Add Medication</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>

      {/* Add / Edit Refill Modal */}
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
                  {editingId ? "Edit Medication" : "Add Medication"}
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
                  <Text style={styles.formLabel}>Medication Name *</Text>
                  <TextInput
                    style={styles.formInput}
                    placeholder="e.g. Amoxicillin 500mg"
                    placeholderTextColor="#a8b5c0"
                    value={form.name}
                    onChangeText={(text) =>
                      setForm((f) => ({ ...f, name: text }))
                    }
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Date Collected *</Text>
                  <MiniCalendar
                    year={calYear}
                    month={calMonth}
                    selectedDate={form.collectedDate}
                    onSelectDate={(iso) =>
                      setForm((f) => ({ ...f, collectedDate: iso }))
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
                  <Text style={styles.selectedDateLabel}>
                    Selected: {formatDisplay(form.collectedDate)}
                  </Text>
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>
                    How long should it last? *
                  </Text>
                  <View style={styles.durationChipWrap}>
                    {DURATION_PRESETS.map((preset) => {
                      const isSelected =
                        !useCustomDuration &&
                        form.durationDays === preset.value;
                      return (
                        <TouchableOpacity
                          key={preset.value}
                          style={[
                            styles.durationChip,
                            isSelected && styles.durationChipSelected,
                          ]}
                          onPress={() => {
                            setUseCustomDuration(false);
                            setForm((f) => ({
                              ...f,
                              durationDays: preset.value,
                            }));
                          }}
                        >
                          <Text
                            style={[
                              styles.durationChipText,
                              isSelected && styles.durationChipTextSelected,
                            ]}
                          >
                            {preset.label}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                    <TouchableOpacity
                      style={[
                        styles.durationChip,
                        useCustomDuration && styles.durationChipSelected,
                      ]}
                      onPress={() => setUseCustomDuration(true)}
                    >
                      <Text
                        style={[
                          styles.durationChipText,
                          useCustomDuration && styles.durationChipTextSelected,
                        ]}
                      >
                        Custom
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {useCustomDuration && (
                    <View style={styles.customDurationRow}>
                      <TextInput
                        style={[styles.formInput, styles.customDurationInput]}
                        placeholder="Number of days"
                        placeholderTextColor="#a8b5c0"
                        keyboardType="number-pad"
                        value={form.customDuration}
                        onChangeText={(text) =>
                          setForm((f) => ({
                            ...f,
                            customDuration: text.replace(/[^0-9]/g, ""),
                          }))
                        }
                      />
                      <Text style={styles.customDurationSuffix}>days</Text>
                    </View>
                  )}
                </View>

                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={saveRefill}
                >
                  <Icon name="checkmark" size={18} color="white" />
                  <Text style={styles.submitButtonText}>
                    {editingId ? "Save Changes" : "Start Tracking"}
                  </Text>
                </TouchableOpacity>

                {editingId && (
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => {
                      setModalVisible(false);
                      deleteRefill(editingId);
                    }}
                  >
                    <Icon name="trash-outline" size={16} color="#c0392b" />
                    <Text style={styles.deleteButtonText}>
                      Remove Medication
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
    fontWeight: "600",
    color: "#0b1a2e",
  },
  progressValue: {
    fontSize: 12,
    fontWeight: "500",
    color: "#6a7f92",
  },
  progressBar: {
    height: 8,
    backgroundColor: "#e6edf4",
    borderRadius: 10,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
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

  refillsSectionHeader: {
    marginHorizontal: 20,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0b1a2e",
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: "#6a7f92",
    lineHeight: 18,
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
    fontSize: 16,
    fontWeight: "700",
    color: "#0b1a2e",
    marginTop: 12,
  },
  emptyStateText: {
    fontSize: 13,
    color: "#6a7f92",
    marginTop: 4,
    textAlign: "center",
    paddingHorizontal: 30,
  },

  refillCard: {
    backgroundColor: "white",
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 16,
    borderLeftWidth: 4,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#eef4f9",
  },
  refillHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
    gap: 8,
  },
  refillTitleGroup: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 10,
  },
  refillIconChip: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "#eaf1f7",
    alignItems: "center",
    justifyContent: "center",
  },
  refillName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0b1a2e",
    flex: 1,
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
  statusOverdue: {
    backgroundColor: "#fbeae8",
  },
  refillStatusText: {
    fontSize: 11,
    fontWeight: "700",
  },
  statusOnTrackText: {
    color: "#219653",
  },
  statusExpiringText: {
    color: "#b7791f",
  },
  statusOverdueText: {
    color: "#c0392b",
  },
  refillDetails: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
    marginTop: 12,
  },
  refillDetail: {
    fontSize: 12.5,
    color: "#6a7f92",
  },
  refillActionsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#f2f5f8",
  },
  refillActionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: "#f7fafd",
  },
  refillActionText: {
    fontSize: 12.5,
    fontWeight: "700",
    color: "#0b3b5c",
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

  /* Calendar (shared look with rest of app) */
  calendarCard: {
    backgroundColor: "#f9fbfd",
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: "#eef4f9",
  },
  calendarHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  calendarNavButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  calendarMonthLabel: {
    fontSize: 14,
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
    fontSize: 10.5,
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
    paddingVertical: 3,
  },
  calendarDayCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
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
    fontSize: 12.5,
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
  selectedDateLabel: {
    fontSize: 12.5,
    color: "#6a7f92",
    marginTop: 8,
    fontWeight: "600",
  },

  /* Duration picker */
  durationChipWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  durationChip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: "#f2f5f8",
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  durationChipSelected: {
    backgroundColor: "#0b3b5c",
    borderColor: "#0b3b5c",
  },
  durationChipText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#4a5f72",
  },
  durationChipTextSelected: {
    color: "white",
  },
  customDurationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 10,
  },
  customDurationInput: {
    flex: 1,
  },
  customDurationSuffix: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6a7f92",
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
