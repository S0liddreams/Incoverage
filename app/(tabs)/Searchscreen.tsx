import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";

/* ---------------------------------------------------------
   MOCK DATA
--------------------------------------------------------- */

const medications = [
  {
    id: "m1",
    category: "Medication",
    name: "Amoxicillin 500mg (21 caps)",
    tariff: 2400,
    coveragePct: 100,
    refills: 3,
    alternatives: ["Amoxil", "Moxatag"],
  },
  {
    id: "m2",
    category: "Medication",
    name: "Malaria Rapid Test Kit",
    tariff: 4200,
    coveragePct: 60,
    refills: 0,
    alternatives: [],
    note: "Requires pre-authorization from your HMO.",
  },
  {
    id: "m3",
    category: "Medication",
    name: "Lisinopril 10mg (30 tabs)",
    tariff: 1800,
    coveragePct: 100,
    refills: 1,
    alternatives: ["Zestril", "Prinivil"],
  },
];

const investigations = [
  {
    id: "i1",
    category: "Investigation",
    name: "Full Blood Count (FBC)",
    tariff: 3500,
    coveragePct: 100,
    turnaround: "Same day",
  },
  {
    id: "i2",
    category: "Investigation",
    name: "Fasting Blood Sugar",
    tariff: 2000,
    coveragePct: 100,
    turnaround: "Same day",
  },
  {
    id: "i3",
    category: "Investigation",
    name: "Abdominal Ultrasound",
    tariff: 12000,
    coveragePct: 70,
    turnaround: "1–2 days",
    note: "Referral letter required from primary provider.",
  },
  {
    id: "i4",
    category: "Investigation",
    name: "Chest X-Ray",
    tariff: 8000,
    coveragePct: 85,
    turnaround: "Same day",
  },
];

const procedures = [
  {
    id: "p1",
    category: "Procedure",
    name: "Appendectomy (Surgery)",
    coveragePct: 80,
    items: [
      { item: "Surgeon's Fee", cost: 150000 },
      { item: "Anesthesia", cost: 45000 },
      { item: "Hospital Stay (2 days)", cost: 80000 },
      { item: "Lab Tests", cost: 25000 },
      { item: "Medication (Post-op)", cost: 18000 },
    ],
  },
];

const NGN = (n: number) => "₦" + Math.round(n).toLocaleString("en-NG");

function splitTariff(tariff: number, coveragePct: number) {
  const covered = Math.round(tariff * (coveragePct / 100));
  const youPay = tariff - covered;
  return { covered, youPay };
}

function getCoverageTone(pct: number) {
  if (pct >= 100) return { color: "#219653", bg: "#eaf6ed" };
  if (pct >= 50) return { color: "#b7791f", bg: "#fef6e7" };
  return { color: "#c0392b", bg: "#fbeae8" };
}

/* ---------------------------------------------------------
   SELECTED ITEM TYPE — normalized so meds, investigations,
   and procedures all sit in one list with one shape
--------------------------------------------------------- */

interface SelectedItem {
  id: string;
  category: string;
  name: string;
  tariff: number;
  coveragePct: number;
}

/* ---------------------------------------------------------
   RESULT CARD — for medications & investigations
--------------------------------------------------------- */

function ResultCard({
  id,
  category,
  title,
  tariff,
  coveragePct,
  metaLeft,
  metaRight,
  note,
  alternatives,
  isSelected,
  onToggle,
}: {
  id: string;
  category: string;
  title: string;
  tariff: number;
  coveragePct: number;
  metaLeft?: string;
  metaRight?: string;
  note?: string;
  alternatives?: string[];
  isSelected: boolean;
  onToggle: () => void;
}) {
  const { covered, youPay } = splitTariff(tariff, coveragePct);
  const tone = getCoverageTone(coveragePct);

  return (
    <View style={[styles.resultCard, isSelected && styles.resultCardSelected]}>
      <View style={styles.medTopRow}>
        <Text style={styles.medName}>{title}</Text>
        <View style={[styles.coverageBadge, { backgroundColor: tone.bg }]}>
          <Icon
            name={
              coveragePct >= 100 ? "checkmark-circle" : "information-circle"
            }
            size={12}
            color={tone.color}
          />
          <Text style={[styles.coverageBadgeText, { color: tone.color }]}>
            {coveragePct}%
          </Text>
        </View>
      </View>

      {(metaLeft || metaRight) && (
        <View style={styles.medMetaRow}>
          {metaLeft && (
            <View style={styles.medMetaItem}>
              <Icon name="pricetag-outline" size={12} color="#8a9eb0" />
              <Text style={styles.medMetaText}>{metaLeft}</Text>
            </View>
          )}
          {metaLeft && metaRight && <View style={styles.medMetaDot} />}
          {metaRight && (
            <View style={styles.medMetaItem}>
              <Icon name="time-outline" size={12} color="#8a9eb0" />
              <Text style={styles.medMetaText}>{metaRight}</Text>
            </View>
          )}
        </View>
      )}

      <View style={styles.resultBottomRow}>
        <View>
          <Text style={styles.tariffSmallLabel}>You'd pay</Text>
          <Text style={styles.tariffSmallValue}>{NGN(youPay)}</Text>
        </View>
        <TouchableOpacity
          style={[styles.addButton, isSelected && styles.addButtonSelected]}
          onPress={onToggle}
          activeOpacity={0.8}
        >
          <Icon
            name={isSelected ? "checkmark" : "add"}
            size={15}
            color={isSelected ? "white" : "#0b3b5c"}
          />
          <Text
            style={[
              styles.addButtonText,
              isSelected && styles.addButtonTextSelected,
            ]}
          >
            {isSelected ? "Added" : "Add to estimate"}
          </Text>
        </TouchableOpacity>
      </View>

      {alternatives && alternatives.length > 0 && (
        <View style={styles.altRow}>
          <Icon name="sync-outline" size={12} color="#146c8f" />
          <Text style={styles.altText}>Similar: {alternatives.join(", ")}</Text>
        </View>
      )}

      {note && (
        <View style={styles.noteRow}>
          <Icon name="information-circle-outline" size={13} color="#b7791f" />
          <Text style={styles.noteText}>{note}</Text>
        </View>
      )}
    </View>
  );
}

/* ---------------------------------------------------------
   PROCEDURE CARD
--------------------------------------------------------- */

function ProcedureCard({
  proc,
  isOpen,
  onToggleOpen,
  isSelected,
  onToggleSelect,
}: {
  proc: (typeof procedures)[0];
  isOpen: boolean;
  onToggleOpen: () => void;
  isSelected: boolean;
  onToggleSelect: () => void;
}) {
  const total = proc.items.reduce((sum, i) => sum + i.cost, 0);
  const { covered, youPay } = splitTariff(total, proc.coveragePct);

  return (
    <View style={[styles.procCard, isSelected && styles.resultCardSelected]}>
      <TouchableOpacity
        style={styles.procHeader}
        onPress={onToggleOpen}
        activeOpacity={0.7}
      >
        <View style={styles.procHeaderLeft}>
          <View style={styles.procIconChip}>
            <Icon name="medical-outline" size={16} color="#0b3b5c" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.procName}>{proc.name}</Text>
            <Text style={styles.procSub}>
              {proc.items.length} items · NHIS covers {proc.coveragePct}%
            </Text>
          </View>
        </View>
        <Icon
          name={isOpen ? "chevron-up" : "chevron-down"}
          size={17}
          color="#8a9eb0"
        />
      </TouchableOpacity>

      {isOpen && (
        <View style={styles.procBody}>
          <Text style={styles.procBodyLabel}>Itemized tariff</Text>
          {proc.items.map((item, index) => (
            <View key={index} style={styles.procItemRow}>
              <Text style={styles.procItemLabel}>{item.item}</Text>
              <Text style={styles.procItemCost}>{NGN(item.cost)}</Text>
            </View>
          ))}
          <View style={styles.procDivider} />
          <View style={styles.calcRow}>
            <Text style={styles.calcLabel}>Total tariff</Text>
            <Text style={styles.calcTotal}>{NGN(total)}</Text>
          </View>
        </View>
      )}

      <View style={styles.procFooter}>
        <View>
          <Text style={styles.tariffSmallLabel}>You'd pay</Text>
          <Text style={styles.tariffSmallValue}>{NGN(youPay)}</Text>
        </View>
        <TouchableOpacity
          style={[styles.addButton, isSelected && styles.addButtonSelected]}
          onPress={onToggleSelect}
          activeOpacity={0.8}
        >
          <Icon
            name={isSelected ? "checkmark" : "add"}
            size={15}
            color={isSelected ? "white" : "#0b3b5c"}
          />
          <Text
            style={[
              styles.addButtonText,
              isSelected && styles.addButtonTextSelected,
            ]}
          >
            {isSelected ? "Added" : "Add to estimate"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* ---------------------------------------------------------
   MAIN SCREEN
--------------------------------------------------------- */

type Tab = "medications" | "investigations" | "procedures";

export default function SearchScreen() {
  const [tab, setTab] = useState<Tab>("medications");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedProcedure, setExpandedProcedure] = useState<string | null>(
    "p1",
  );
  const [selected, setSelected] = useState<SelectedItem[]>([]);
  const [summaryVisible, setSummaryVisible] = useState(false);

  const filteredMedications = medications.filter((m) =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );
  const filteredInvestigations = investigations.filter((i) =>
    i.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );
  const filteredProcedures = procedures.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const isSelected = (id: string) => selected.some((s) => s.id === id);

  const toggleSelect = (item: SelectedItem) => {
    setSelected((prev) =>
      prev.some((s) => s.id === item.id)
        ? prev.filter((s) => s.id !== item.id)
        : [...prev, item],
    );
  };

  const removeSelected = (id: string) => {
    setSelected((prev) => prev.filter((s) => s.id !== id));
  };

  const clearAll = () => setSelected([]);

  // Running totals — recalculated automatically as selection changes.
  // Each item's covered/youPay is derived from splitTariff, which already
  // resolves to covered = 0 (and youPay = full tariff) whenever coveragePct
  // is 0, so the summed totals below stay consistent with what's shown
  // per-item in the modal.
  const totals = useMemo(() => {
    return selected.reduce(
      (acc, item) => {
        const { covered, youPay } = splitTariff(item.tariff, item.coveragePct);
        return {
          tariff: acc.tariff + item.tariff,
          covered: acc.covered + covered,
          youPay: acc.youPay + youPay,
        };
      },
      { tariff: 0, covered: 0, youPay: 0 },
    );
  }, [selected]);

  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: "medications", label: "Medications", icon: "medkit-outline" },
    { key: "investigations", label: "Investigations", icon: "flask-outline" },
    { key: "procedures", label: "Procedures", icon: "calculator-outline" },
  ];

  const placeholderByTab: Record<Tab, string> = {
    medications: "Search a medication...",
    investigations: "Search a lab test or scan...",
    procedures: "Search a procedure...",
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerIconChip}>
          <Icon name="shield-checkmark-outline" size={18} color="#0B4D3A" />
        </View>
        <View style={styles.headerTextGroup}>
          <Text style={styles.headerTitle}>Service Coverage</Text>
          <Text style={styles.headerSubtitle}>
            Add items to build your cost estimate
          </Text>
        </View>
      </View>

      {/* Segmented Tabs */}
      <View style={styles.tabRow}>
        {tabs.map((t) => (
          <TouchableOpacity
            key={t.key}
            style={[styles.tabButton, tab === t.key && styles.tabButtonActive]}
            onPress={() => setTab(t.key)}
            activeOpacity={0.8}
          >
            <Icon
              name={t.icon}
              size={14}
              color={tab === t.key ? "white" : "#6a7f92"}
            />
            <Text
              style={[
                styles.tabButtonText,
                tab === t.key && styles.tabButtonTextActive,
              ]}
              numberOfLines={1}
            >
              {t.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Search Input */}
      <View style={styles.searchWrapper}>
        <Icon
          name="search"
          size={18}
          color="#8a9eb0"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder={placeholderByTab[tab]}
          placeholderTextColor="#8a9eb0"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery("")}>
            <Icon name="close-circle" size={17} color="#c0c8d4" />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          selected.length > 0 && { paddingBottom: 110 },
        ]}
      >
        {/* MEDICATIONS */}
        {tab === "medications" &&
          (filteredMedications.length === 0 ? (
            <EmptyState query={searchQuery} label="medications" />
          ) : (
            filteredMedications.map((med) => (
              <ResultCard
                key={med.id}
                id={med.id}
                category={med.category}
                title={med.name}
                tariff={med.tariff}
                coveragePct={med.coveragePct}
                metaRight={`${med.refills} refill${med.refills !== 1 ? "s" : ""} left`}
                note={med.note}
                alternatives={med.alternatives}
                isSelected={isSelected(med.id)}
                onToggle={() =>
                  toggleSelect({
                    id: med.id,
                    category: med.category,
                    name: med.name,
                    tariff: med.tariff,
                    coveragePct: med.coveragePct,
                  })
                }
              />
            ))
          ))}

        {/* INVESTIGATIONS */}
        {tab === "investigations" &&
          (filteredInvestigations.length === 0 ? (
            <EmptyState query={searchQuery} label="investigations" />
          ) : (
            filteredInvestigations.map((inv) => (
              <ResultCard
                key={inv.id}
                id={inv.id}
                category={inv.category}
                title={inv.name}
                tariff={inv.tariff}
                coveragePct={inv.coveragePct}
                metaRight={inv.turnaround}
                note={inv.note}
                isSelected={isSelected(inv.id)}
                onToggle={() =>
                  toggleSelect({
                    id: inv.id,
                    category: inv.category,
                    name: inv.name,
                    tariff: inv.tariff,
                    coveragePct: inv.coveragePct,
                  })
                }
              />
            ))
          ))}

        {/* PROCEDURES */}
        {tab === "procedures" &&
          (filteredProcedures.length === 0 ? (
            <EmptyState query={searchQuery} label="procedures" />
          ) : (
            filteredProcedures.map((proc) => {
              const total = proc.items.reduce((sum, i) => sum + i.cost, 0);
              return (
                <ProcedureCard
                  key={proc.id}
                  proc={proc}
                  isOpen={expandedProcedure === proc.id}
                  onToggleOpen={() =>
                    setExpandedProcedure(
                      expandedProcedure === proc.id ? null : proc.id,
                    )
                  }
                  isSelected={isSelected(proc.id)}
                  onToggleSelect={() =>
                    toggleSelect({
                      id: proc.id,
                      category: proc.category,
                      name: proc.name,
                      tariff: total,
                      coveragePct: proc.coveragePct,
                    })
                  }
                />
              );
            })
          ))}
      </ScrollView>

      {/* Sticky estimate bar */}
      {selected.length > 0 && (
        <TouchableOpacity
          style={styles.estimateBar}
          onPress={() => setSummaryVisible(true)}
          activeOpacity={0.9}
        >
          <View style={styles.estimateBarLeft}>
            <View style={styles.estimateCountBubble}>
              <Text style={styles.estimateCountText}>{selected.length}</Text>
            </View>
            <View>
              <Text style={styles.estimateBarLabel}>
                {selected.length} item{selected.length !== 1 ? "s" : ""}{" "}
                selected
              </Text>
              <Text style={styles.estimateBarAmount}>
                You pay {NGN(totals.youPay)}
              </Text>
            </View>
          </View>
          <View style={styles.estimateBarRight}>
            <Text style={styles.estimateBarViewText}>View estimate</Text>
            <Icon name="chevron-forward" size={16} color="white" />
          </View>
        </TouchableOpacity>
      )}

      {/* Summary Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={summaryVisible}
        onRequestClose={() => setSummaryVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHandle} />
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Your Estimate</Text>
              <TouchableOpacity
                onPress={() => setSummaryVisible(false)}
                style={styles.modalCloseButton}
              >
                <Icon name="close" size={20} color="#6a7f92" />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.modalBody}
              showsVerticalScrollIndicator={false}
            >
              {selected.length === 0 ? (
                <View style={styles.emptyState}>
                  <Icon name="cart-outline" size={28} color="#c0c8d4" />
                  <Text style={styles.emptyStateText}>Nothing added yet</Text>
                </View>
              ) : (
                <>
                  <Text style={styles.procBodyLabel}>
                    {selected.length} ITEM{selected.length !== 1 ? "S" : ""}
                  </Text>

                  {/* Every selected item, each showing its own tariff,
                      what NHIS covers (₦0 when coveragePct is 0), and
                      what the user is expected to pay for that item. */}
                  {selected.map((item) => {
                    const { covered, youPay } = splitTariff(
                      item.tariff,
                      item.coveragePct,
                    );
                    return (
                      <View key={item.id} style={styles.summaryItemCard}>
                        <View style={styles.summaryItemTopRow}>
                          <View style={{ flex: 1 }}>
                            <Text style={styles.summaryItemCategory}>
                              {item.category.toUpperCase()}
                            </Text>
                            <Text style={styles.summaryItemName}>
                              {item.name}
                            </Text>
                          </View>
                          <TouchableOpacity
                            onPress={() => removeSelected(item.id)}
                            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                          >
                            <Icon
                              name="trash-outline"
                              size={16}
                              color="#c0392b"
                            />
                          </TouchableOpacity>
                        </View>

                        <View style={styles.summaryItemBreakdown}>
                          <View style={styles.summaryItemStat}>
                            <Text style={styles.summaryItemStatLabel}>
                              Tariff
                            </Text>
                            <Text style={styles.summaryItemStatValue}>
                              {NGN(item.tariff)}
                            </Text>
                          </View>
                          <View style={styles.summaryItemStatDivider} />
                          <View style={styles.summaryItemStat}>
                            <Text style={styles.summaryItemStatLabel}>
                              NHIS covers ({item.coveragePct}%)
                            </Text>
                            <Text
                              style={[
                                styles.summaryItemStatValue,
                                {
                                  color: covered > 0 ? "#219653" : "#8a9eb0",
                                },
                              ]}
                            >
                              {NGN(covered)}
                            </Text>
                          </View>
                          <View style={styles.summaryItemStatDivider} />
                          <View style={styles.summaryItemStat}>
                            <Text style={styles.summaryItemStatLabel}>
                              You pay
                            </Text>
                            <Text
                              style={[
                                styles.summaryItemStatValue,
                                styles.summaryItemPay,
                              ]}
                            >
                              {NGN(youPay)}
                            </Text>
                          </View>
                        </View>
                      </View>
                    );
                  })}

                  <View style={styles.procDivider} />

                  {/* Grand total calculation — sum of every selected item */}
                  <View style={styles.calcRow}>
                    <Text style={styles.calcLabel}>Total tariff</Text>
                    <Text style={styles.calcTotal}>{NGN(totals.tariff)}</Text>
                  </View>
                  <View style={styles.calcRow}>
                    <View style={styles.calcLabelRow}>
                      <View style={styles.dotGreen} />
                      <Text style={styles.calcLabelSmall}>NHIS covers</Text>
                    </View>
                    <Text style={styles.calcGreen}>{NGN(totals.covered)}</Text>
                  </View>
                  <View style={styles.calcRow}>
                    <View style={styles.calcLabelRow}>
                      <View style={styles.dotAmber} />
                      <Text style={styles.calcLabelSmall}>You pay</Text>
                    </View>
                    <Text style={styles.calcAmber}>{NGN(totals.youPay)}</Text>
                  </View>

                  <View style={styles.grandTotalCard}>
                    <Icon name="wallet-outline" size={18} color="white" />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.grandTotalLabel}>
                        Total to pay for {selected.length} item
                        {selected.length !== 1 ? "s" : ""}
                      </Text>
                      <Text style={styles.grandTotalValue}>
                        {NGN(totals.youPay)}
                      </Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    style={styles.clearAllButton}
                    onPress={clearAll}
                  >
                    <Icon name="trash-outline" size={14} color="#c0392b" />
                    <Text style={styles.clearAllText}>Clear all</Text>
                  </TouchableOpacity>
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function EmptyState({ query, label }: { query: string; label: string }) {
  return (
    <View style={styles.emptyState}>
      <Icon name="search-outline" size={28} color="#c0c8d4" />
      <Text style={styles.emptyStateText}>
        {query ? `No ${label} match "${query}"` : `No ${label} found`}
      </Text>
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
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 14,
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
  headerTextGroup: { flex: 1 },
  headerTitle: { fontSize: 20, fontWeight: "800", color: "#0b1a2e" },
  headerSubtitle: { fontSize: 11.5, color: "#8a9eb0", marginTop: 1 },

  tabRow: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginBottom: 14,
    backgroundColor: "#e9eef4",
    borderRadius: 14,
    padding: 4,
    gap: 4,
  },
  tabButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    paddingVertical: 10,
    borderRadius: 11,
  },
  tabButtonActive: { backgroundColor: "#0b3b5c" },
  tabButtonText: { fontSize: 11.5, fontWeight: "700", color: "#6a7f92" },
  tabButtonTextActive: { color: "white" },

  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    marginHorizontal: 20,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e6edf4",
    marginBottom: 6,
  },
  searchIcon: { marginRight: 10 },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14.5,
    color: "#0b1a2e",
  },

  scrollContent: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 32 },

  emptyState: { alignItems: "center", paddingVertical: 44 },
  emptyStateText: { fontSize: 13, color: "#8a9eb0", marginTop: 8 },

  // Result card (Medications / Investigations)
  resultCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1.5,
    borderColor: "transparent",
    shadowColor: "#0b1a2e",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  resultCardSelected: {
    borderColor: "#0b3b5c",
    backgroundColor: "#f7fafd",
  },
  medTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 6,
    gap: 8,
  },
  medName: { fontSize: 14.5, fontWeight: "700", color: "#0b1a2e", flex: 1 },
  coverageBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
  },
  coverageBadgeText: { fontSize: 10.5, fontWeight: "700" },
  medMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  medMetaItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  medMetaDot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: "#c0c8d4",
  },
  medMetaText: { fontSize: 12, color: "#6a7f92" },

  resultBottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  tariffSmallLabel: { fontSize: 10.5, color: "#8a9eb0", fontWeight: "600" },
  tariffSmallValue: {
    fontSize: 15,
    fontWeight: "800",
    color: "#0b1a2e",
    marginTop: 1,
  },

  addButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: "#eaf1f7",
  },
  addButtonSelected: { backgroundColor: "#219653" },
  addButtonText: { fontSize: 12, fontWeight: "700", color: "#0b3b5c" },
  addButtonTextSelected: { color: "white" },

  altRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 10 },
  altText: { fontSize: 12, color: "#146c8f", fontWeight: "500", flex: 1 },
  noteRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 7,
    backgroundColor: "#fef6e7",
    padding: 9,
    borderRadius: 10,
    marginTop: 10,
  },
  noteText: { fontSize: 12, color: "#8a5a10", flex: 1, lineHeight: 16 },

  // Procedure card
  procCard: {
    backgroundColor: "white",
    borderRadius: 16,
    marginBottom: 10,
    borderWidth: 1.5,
    borderColor: "transparent",
    shadowColor: "#0b1a2e",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
    overflow: "hidden",
  },
  procHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 14,
  },
  procHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 12,
  },
  procIconChip: {
    width: 38,
    height: 38,
    borderRadius: 11,
    backgroundColor: "#eaf1f7",
    alignItems: "center",
    justifyContent: "center",
  },
  procName: { fontSize: 14.5, fontWeight: "700", color: "#0b1a2e" },
  procSub: { fontSize: 11.5, color: "#8a9eb0", marginTop: 2 },
  procBody: { paddingHorizontal: 14, paddingBottom: 10 },
  procBodyLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#a8b5c0",
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  procItemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f7f9",
    borderStyle: "dashed",
  },
  procItemLabel: { fontSize: 13, color: "#4a5f72" },
  procItemCost: { fontSize: 13, fontWeight: "600", color: "#0b1a2e" },
  procDivider: {
    height: 1,
    backgroundColor: "#0b1a2e",
    marginVertical: 12,
    opacity: 0.08,
  },
  calcRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  calcLabel: { fontSize: 13.5, fontWeight: "700", color: "#0b1a2e" },
  calcTotal: { fontSize: 15, fontWeight: "800", color: "#0b1a2e" },
  calcLabelRow: { flexDirection: "row", alignItems: "center", gap: 7 },
  calcLabelSmall: { fontSize: 13, color: "#4a5f72", fontWeight: "500" },
  calcGreen: { fontSize: 14, fontWeight: "700", color: "#219653" },
  calcAmber: { fontSize: 14, fontWeight: "700", color: "#b7591f" },
  dotGreen: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#6fcf97",
  },
  dotAmber: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#f2994a",
  },

  procFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#f2f5f8",
  },

  // Sticky estimate bar
  estimateBar: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 16,
    backgroundColor: "#0b3b5c",
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#0b1a2e",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  estimateBarLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  estimateCountBubble: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
  },
  estimateCountText: { color: "white", fontWeight: "800", fontSize: 13 },
  estimateBarLabel: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 11.5,
    fontWeight: "600",
  },
  estimateBarAmount: {
    color: "white",
    fontSize: 15,
    fontWeight: "800",
    marginTop: 1,
  },
  estimateBarRight: { flexDirection: "row", alignItems: "center", gap: 3 },
  estimateBarViewText: { color: "white", fontSize: 12, fontWeight: "700" },

  // Modal
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
    maxHeight: "85%",
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
  modalTitle: { fontSize: 18, fontWeight: "800", color: "#0b1a2e" },
  modalCloseButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#f2f5f8",
    alignItems: "center",
    justifyContent: "center",
  },
  modalBody: { paddingTop: 16, paddingBottom: 24 },

  // Per-item card in the estimate summary — shows tariff, NHIS covered
  // amount, and the amount the user is expected to pay, side by side.
  summaryItemCard: {
    backgroundColor: "#f9fbfd",
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#eef2f6",
  },
  summaryItemTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  summaryItemCategory: {
    fontSize: 9.5,
    fontWeight: "800",
    color: "#a8b5c0",
    letterSpacing: 0.4,
    marginBottom: 2,
  },
  summaryItemName: { fontSize: 13.5, fontWeight: "700", color: "#0b1a2e" },
  summaryItemBreakdown: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  summaryItemStat: { flex: 1, alignItems: "center" },
  summaryItemStatDivider: {
    width: 1,
    height: 28,
    backgroundColor: "#eef2f6",
  },
  summaryItemStatLabel: {
    fontSize: 9.5,
    color: "#8a9eb0",
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 3,
  },
  summaryItemStatValue: {
    fontSize: 13,
    fontWeight: "800",
    color: "#0b1a2e",
  },
  summaryItemPay: { color: "#b7591f" },

  grandTotalCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#0b3b5c",
    borderRadius: 16,
    padding: 16,
    marginTop: 14,
  },
  grandTotalLabel: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 12,
    fontWeight: "600",
  },
  grandTotalValue: {
    color: "white",
    fontSize: 22,
    fontWeight: "800",
    marginTop: 2,
  },

  clearAllButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 14,
    marginTop: 8,
  },
  clearAllText: { fontSize: 13, fontWeight: "700", color: "#c0392b" },
});
