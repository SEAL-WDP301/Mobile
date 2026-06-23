import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Modal,
  StatusBar,
  Dimensions
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Search,
  Calendar,
  Video,
  MapPin,
  ChevronRight,
  Star,
  X,
  Briefcase,
  Sparkles,
  MessageSquare
} from "lucide-react-native";
import { useTheme } from "@/constants/theme/useTheme";

const { width } = Dimensions.get("window");

const MENTORS = [
  {
    name: "Dr. Linh Tran",
    position: "Principal AI Researcher",
    org: "FPT Software AI Lab",
    expertise: ["LLMs", "Agents"],
    category: "AI Infrastructure",
    initials: "LT",
    rating: 4.9,
  },
  {
    name: "Hoang Pham",
    position: "Staff Engineer",
    org: "VNG Cloud",
    expertise: ["Distributed", "K8s"],
    category: "Cloud & Edge",
    initials: "HP",
    rating: 4.8,
  },
  {
    name: "Mai Vu",
    position: "Product Design Lead",
    org: "MoMo",
    expertise: ["UX", "Design Systems"],
    category: "Devex",
    initials: "MV",
    rating: 4.9,
  },
  {
    name: "Prof. An Nguyen",
    position: "Associate Professor",
    org: "FPT University",
    expertise: ["Algorithms", "Security"],
    category: "Dev Tools",
    initials: "AN",
    rating: 4.7,
  },
];

const CATEGORIES = [
  { label: "All", value: "All" },
  { label: "AI Infra", value: "AI Infrastructure" },
  { label: "Cloud", value: "Cloud & Edge" },
  { label: "Devex", value: "Devex" },
  { label: "Tools", value: "Dev Tools" }
];

const SESSIONS = [
  { mentor: "Dr. Linh Tran", date: "Aug 05 · 19:00", mode: "Online", initials: "LT" },
  { mentor: "Hoang Pham", date: "Aug 07 · 14:30", mode: "Campus α", initials: "HP" },
];

export default function MentorsScreen() {
  const { isDark } = useTheme();
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMentor, setSelectedMentor] = useState<typeof MENTORS[number] | null>(null);

  const colors = {
    bg: isDark ? "#0C0A09" : "#F9F6F0",
    cardBg: isDark ? "rgba(20, 17, 15, 0.75)" : "rgba(255, 255, 255, 0.95)",
    cardBorder: isDark ? "rgba(255, 255, 255, 0.04)" : "rgba(0, 0, 0, 0.05)",
    textPrimary: isDark ? "#FFFFFF" : "#1C1917",
    textSecondary: isDark ? "#A39690" : "#78716C",
    textMuted: isDark ? "#57534E" : "#A8A29E",
    accent: "#f37021",
    subAccent: "#ff9248",
    inputBg: isDark ? "#14110F" : "#FFFFFF",
  };

  // Filtering Logic
  const filteredMentors = MENTORS.filter((m) => {
    const matchesCategory = activeCategory === "All" || m.category === activeCategory;
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.org.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.expertise.some((e) => e.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]} edges={["top"]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Mentors</Text>
        <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>Find your edge.</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ================= SEARCH BAR ================= */}
        <View style={[styles.searchContainer, { backgroundColor: colors.inputBg, borderColor: colors.cardBorder }]}>
          <Search size={18} color={colors.textSecondary} style={styles.searchIcon} />
          <TextInput
            placeholder="Search by name, skill, company..."
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={[styles.searchInput, { color: colors.textPrimary }]}
          />
        </View>

        {/* ================= CATEGORY FILTER CHIPS ================= */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterScrollView}
          contentContainerStyle={styles.filterContent}
        >
          {CATEGORIES.map((c) => {
            const isActive = c.value === activeCategory;
            return (
              <TouchableOpacity
                key={c.label}
                onPress={() => setActiveCategory(c.value)}
                style={[
                  styles.filterChip,
                  {
                    backgroundColor: isActive ? colors.accent : colors.cardBg,
                    borderColor: isActive ? colors.accent : colors.cardBorder,
                  },
                ]}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    {
                      color: isActive ? "#FFFFFF" : colors.textSecondary,
                      fontWeight: isActive ? "700" : "600",
                    },
                  ]}
                >
                  {c.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* ================= UPCOMING SESSIONS ================= */}
        <Text style={[styles.sectionTitle, { color: colors.textPrimary, marginTop: 16, marginBottom: 12 }]}>
          Upcoming sessions
        </Text>
        <View style={styles.sessionsContainer}>
          {SESSIONS.map((s) => (
            <View
              key={s.mentor}
              style={[styles.sessionCard, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}
            >
              <View style={[styles.mentorInitialsBox, { backgroundColor: isDark ? "#292524" : "#E7E5E4" }]}>
                <Text style={[styles.mentorInitials, { color: colors.textPrimary }]}>{s.initials}</Text>
              </View>

              <View style={styles.sessionInfo}>
                <Text style={[styles.sessionMentorName, { color: colors.textPrimary }]}>{s.mentor}</Text>
                <View style={styles.sessionMeta}>
                  <Calendar size={12} color={colors.textSecondary} />
                  <Text style={[styles.sessionMetaText, { color: colors.textSecondary }]}>{s.date}</Text>
                  <Text style={[styles.sessionMetaDivider, { color: colors.textMuted }]}>·</Text>
                  {s.mode === "Online" ? (
                    <Video size={12} color={colors.textSecondary} />
                  ) : (
                    <MapPin size={12} color={colors.textSecondary} />
                  )}
                  <Text style={[styles.sessionMetaText, { color: colors.textSecondary }]}>{s.mode}</Text>
                </View>
              </View>

              <TouchableOpacity
                style={[styles.sessionChevron, { backgroundColor: `${colors.accent}15` }]}
                activeOpacity={0.7}
              >
                <ChevronRight size={16} color={colors.accent} />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* ================= MENTORS GRID ================= */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Recommended for you</Text>
          <Text style={[styles.matchesCount, { color: colors.textSecondary }]}>
            {filteredMentors.length} matches
          </Text>
        </View>

        <View style={styles.mentorsGrid}>
          {filteredMentors.length === 0 ? (
            <View style={[styles.emptyCard, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No mentors match your search.</Text>
            </View>
          ) : (
            filteredMentors.map((m) => (
              <TouchableOpacity
                key={m.name}
                onPress={() => setSelectedMentor(m)}
                style={[styles.mentorCard, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}
                activeOpacity={0.9}
              >
                <View style={styles.mentorRow}>
                  <View style={[styles.mentorInitialsLarge, { backgroundColor: isDark ? "#292524" : "#E7E5E4" }]}>
                    <Text style={[styles.mentorInitialsTextLarge, { color: colors.textPrimary }]}>{m.initials}</Text>
                  </View>

                  <View style={styles.mentorMain}>
                    <View style={styles.mentorNameRow}>
                      <Text style={[styles.mentorName, { color: colors.textPrimary }]} numberOfLines={1}>
                        {m.name}
                      </Text>
                      <View style={styles.ratingRow}>
                        <Star size={12} color={colors.accent} fill={colors.accent} />
                        <Text style={[styles.ratingText, { color: colors.accent }]}>{m.rating}</Text>
                      </View>
                    </View>

                    <Text style={[styles.mentorPos, { color: colors.textSecondary }]} numberOfLines={1}>
                      {m.position} · {m.org}
                    </Text>

                    <View style={styles.mentorExpertise}>
                      <View style={[styles.expertBadge, { backgroundColor: `${colors.accent}15` }]}>
                        <Text style={[styles.expertBadgeText, { color: colors.accent }]}>{m.category}</Text>
                      </View>
                      {m.expertise.map((e) => (
                        <View key={e} style={[styles.expertBadge, { backgroundColor: isDark ? "#292524" : "#E7E5E4" }]}>
                          <Text style={[styles.expertBadgeText, { color: colors.textPrimary }]}>{e}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>

      {/* ================= MENTOR SHEET (MODAL DRAWER) ================= */}
      <Modal
        visible={selectedMentor !== null}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSelectedMentor(null)}
      >
        {selectedMentor && (
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
              {/* Header inside modal */}
              <View style={styles.modalHeader}>
                <View style={styles.modalMentorProfile}>
                  <View style={[styles.modalInitialsBox, { backgroundColor: colors.accent }]}>
                    <Text style={styles.modalInitialsText}>{selectedMentor.initials}</Text>
                  </View>
                  <View>
                    <Text style={[styles.modalMentorName, { color: colors.textPrimary }]}>{selectedMentor.name}</Text>
                    <Text style={[styles.modalMentorPos, { color: colors.textSecondary }]}>
                      {selectedMentor.position}
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  onPress={() => setSelectedMentor(null)}
                  style={[styles.modalCloseBtn, { backgroundColor: isDark ? "#292524" : "#E7E5E4" }]}
                >
                  <X size={16} color={colors.textPrimary} />
                </TouchableOpacity>
              </View>

              <Text style={[styles.modalBio, { color: colors.textSecondary }]}>
                {selectedMentor.name.split(" ")[1]} has spent 12+ years in {selectedMentor.expertise[0]} at top-tier
                orgs and now mentors student teams on shipping production-grade systems.
              </Text>

              {/* Grid Tiles */}
              <View style={styles.tilesGrid}>
                <DetailTile icon={Briefcase} label="Org" value={selectedMentor.org} colors={colors} />
                <DetailTile icon={Sparkles} label="Category" value={selectedMentor.category} colors={colors} />
                <DetailTile icon={MessageSquare} label="Teams" value="6 assigned" colors={colors} />
                <DetailTile icon={Calendar} label="Slots" value="Tue · Thu" colors={colors} />
              </View>

              {/* Actions inside modal */}
              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={[styles.sheetBtn, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.sheetBtnText, { color: colors.textPrimary }]}>View profile</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.sheetBtn, { backgroundColor: colors.accent }]}
                  activeOpacity={0.9}
                >
                  <Text style={[styles.sheetBtnText, { color: "#FFFFFF", fontWeight: "700" }]}>Schedule meeting</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </Modal>
    </SafeAreaView>
  );
}

// Sub-Component: Details Tile
function DetailTile({ icon: IconComponent, label, value, colors }: { icon: any; label: string; value: string; colors: any }) {
  return (
    <View style={[styles.tile, { backgroundColor: colors.inputBg, borderColor: colors.cardBorder }]}>
      <View style={styles.tileHeader}>
        <IconComponent size={12} color={colors.accent} />
        <Text style={[styles.tileLabel, { color: colors.textSecondary }]}>{label}</Text>
      </View>
      <Text style={[styles.tileValue, { color: colors.textPrimary }]} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "900",
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 110,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    paddingHorizontal: 16,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
  },
  filterScrollView: {
    marginTop: 14,
    marginBottom: 6,
    marginHorizontal: -16,
  },
  filterContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterChipText: {
    fontSize: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
  },
  sessionsContainer: {
    gap: 10,
  },
  sessionCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 18,
    borderWidth: 1,
    padding: 12,
  },
  mentorInitialsBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  mentorInitials: {
    fontSize: 14,
    fontWeight: "700",
  },
  sessionInfo: {
    flex: 1,
    marginLeft: 12,
  },
  sessionMentorName: {
    fontSize: 14,
    fontWeight: "600",
  },
  sessionMeta: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  sessionMetaText: {
    fontSize: 10,
    marginLeft: 4,
  },
  sessionMetaDivider: {
    fontSize: 10,
    marginHorizontal: 6,
  },
  sessionChevron: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 24,
    marginBottom: 12,
  },
  matchesCount: {
    fontSize: 11,
  },
  mentorsGrid: {
    gap: 10,
  },
  mentorCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 14,
  },
  mentorRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  mentorInitialsLarge: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  mentorInitialsTextLarge: {
    fontSize: 15,
    fontWeight: "700",
  },
  mentorMain: {
    flex: 1,
    marginLeft: 12,
  },
  mentorNameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  mentorName: {
    fontSize: 15,
    fontWeight: "700",
    flex: 1,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: "700",
  },
  mentorPos: {
    fontSize: 12,
    marginTop: 2,
  },
  mentorExpertise: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 8,
  },
  expertBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 99,
  },
  expertBadgeText: {
    fontSize: 9,
    fontWeight: "700",
  },
  emptyCard: {
    padding: 30,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 13,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  modalContent: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    padding: 20,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalMentorProfile: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  modalInitialsBox: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  modalInitialsText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
  },
  modalMentorName: {
    fontSize: 18,
    fontWeight: "900",
  },
  modalMentorPos: {
    fontSize: 12,
    marginTop: 2,
  },
  modalCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  modalBio: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 16,
  },
  tilesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  tile: {
    width: (width - 50) / 2,
    borderRadius: 16,
    borderWidth: 1,
    padding: 12,
  },
  tileHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  tileLabel: {
    fontSize: 9,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  tileValue: {
    fontSize: 13,
    fontWeight: "700",
    marginTop: 6,
  },
  modalActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 24,
  },
  sheetBtn: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
  },
  sheetBtnText: {
    fontSize: 14,
    fontWeight: "600",
  },
});
