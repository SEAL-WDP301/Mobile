import React from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Dimensions,
  TouchableOpacity,
  Alert
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { ChevronLeft, QrCode, ShieldAlert, Copy, RefreshCw } from "lucide-react-native";
import { useTheme } from "@/constants/theme/useTheme";
import { useAuth } from "@/contexts/AuthContext";
import { useSelectedEvent } from "@/contexts/EventContext";
import { getInitials } from "@/utils/format";

const { width } = Dimensions.get("window");

export default function ParticipantPassScreen() {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const selectedEvent = useSelectedEvent();

  const displayName = user?.name ?? "—";
  const studentId = user?.studentProfile?.studentCode ?? "—";
  const university = user?.studentProfile?.universityName ?? "—";
  const teamName = selectedEvent?.teamName ?? "—";
  const passId = selectedEvent
    ? `SEAL-${selectedEvent.event.year}-${String(selectedEvent.teamId).padStart(4, "0")}`
    : "SEAL-PASS";

  const colors = {
    bg: isDark ? "#11100F" : "#F9F6F0",
    cardBg: isDark ? "#1A1918" : "#FFFFFF",
    cardElevated: isDark ? "#211F1D" : "#F5F3EF",
    textPrimary: isDark ? "#F8F7F5" : "#1C1917",
    textSecondary: isDark ? "#A8A29E" : "#78716C",
    accent: "#F37021",
    border: isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)",
    qrBg: "#FFFFFF",
  };

  const handleCopyPassId = () => {
    Alert.alert("Sao chép", `Đã sao chép mã số thẻ: ${passId}`);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]} edges={["top", "bottom"]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      {/* ================= HEADER ================= */}
      <View style={[styles.appHeader, { borderBottomColor: colors.border }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ChevronLeft size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Thẻ tham gia cuộc thi</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        {/* ================= PASS DESIGN CARD ================= */}
        <View style={[styles.passCard, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
          
          {/* Brand header */}
          <View style={styles.passHeader}>
            <View style={[styles.logoDot, { backgroundColor: colors.accent }]} />
            <Text style={[styles.passLogoText, { color: colors.textPrimary }]}>SEAL SUMMER 2026</Text>
          </View>

          {/* Simulated QR Code Area */}
          <View style={[styles.qrOuterWrapper, { backgroundColor: colors.qrBg }]}>
            {/* Draw a premium simulated QR code with grid blocks */}
            <View style={styles.qrGrid}>
              <View style={styles.qrRow}>
                <View style={[styles.qrBlock, styles.qrCorner]} />
                <View style={styles.qrBlock} />
                <View style={[styles.qrBlock, styles.qrCorner]} />
              </View>
              <View style={styles.qrRow}>
                <View style={styles.qrBlock} />
                <View style={[styles.qrBlock, { backgroundColor: "#11100F" }]} />
                <View style={styles.qrBlock} />
              </View>
              <View style={styles.qrRow}>
                <View style={[styles.qrBlock, styles.qrCorner]} />
                <View style={styles.qrBlock} />
                <View style={[styles.qrBlock, { backgroundColor: "#11100F", borderBottomRightRadius: 4 }]} />
              </View>
            </View>
            <QrCode size={180} color="#11100F" style={styles.qrOverlayIcon} />
          </View>

          {/* Participant Info */}
          <View style={styles.passDetails}>
            <Text style={[styles.passRoleLabel, { color: colors.accent }]}>
              {selectedEvent?.event.name?.toUpperCase() ?? "SEAL"}
            </Text>
            <Text style={[styles.passNameText, { color: colors.textPrimary }]}>{displayName}</Text>
            <Text style={[styles.passUniText, { color: colors.textSecondary }]}>
              {university} · MSSV: {studentId}
            </Text>

            <View style={styles.divider} />

            <View style={styles.metaGrid}>
              <View style={styles.metaGridItem}>
                <Text style={[styles.metaGridLabel, { color: colors.textSecondary }]}>ĐỘI THI</Text>
                <Text style={[styles.metaGridValue, { color: colors.textPrimary }]}>{teamName}</Text>
              </View>
              <View style={styles.metaGridItem}>
                <Text style={[styles.metaGridLabel, { color: colors.textSecondary }]}>PASS ID</Text>
                <Text style={[styles.metaGridValue, { color: colors.textPrimary }]}>{passId}</Text>
              </View>
            </View>

            <TouchableOpacity 
              style={[styles.passIdRow, { backgroundColor: colors.cardElevated }]}
              activeOpacity={0.7}
              onPress={handleCopyPassId}
            >
              <Text style={[styles.passIdText, { color: colors.textPrimary }]}>ID: SEAL-2026-PT83</Text>
              <Copy size={12} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* ================= INSTRUCTIONS ================= */}
        <View style={styles.instructionsContainer}>
          <ShieldAlert size={16} color={colors.accent} style={{ marginRight: 10, marginTop: 2 }} />
          <Text style={[styles.instructionText, { color: colors.textSecondary }]}>
            Sử dụng mã QR này tại các quầy check-in của SEAL Hackathon để ghi nhận tham gia các buổi Workshop, Pitching hoặc nhận quà tặng từ Ban tổ chức.
          </Text>
        </View>

        <TouchableOpacity 
          style={[styles.refreshBtn, { borderColor: colors.border }]}
          activeOpacity={0.8}
          onPress={() => Alert.alert("Cập nhật", "Đã làm mới mã QR xác thực của bạn.")}
        >
          <RefreshCw size={14} color={colors.textPrimary} style={{ marginRight: 8 }} />
          <Text style={[styles.refreshBtnText, { color: colors.textPrimary }]}>LÀM MỚI THẺ THAM GIA</Text>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  appHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backBtn: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  passCard: {
    width: "100%",
    borderRadius: 24,
    borderWidth: 1,
    padding: 20,
    alignItems: "center",
  },
  passHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    gap: 8,
  },
  logoDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  passLogoText: {
    fontSize: 11,
    fontWeight: "850",
    letterSpacing: 1,
  },
  qrOuterWrapper: {
    width: 220,
    height: 220,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    position: "relative",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  qrGrid: {
    width: "100%",
    height: "100%",
    position: "absolute",
    opacity: 0.05,
    justifyContent: "space-between",
    padding: 12,
  },
  qrRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    height: 32,
  },
  qrBlock: {
    width: 32,
    height: 32,
  },
  qrCorner: {
    borderWidth: 4,
    borderColor: "#11100F",
    borderRadius: 4,
  },
  qrOverlayIcon: {
    zIndex: 2,
  },
  passDetails: {
    width: "100%",
    alignItems: "center",
    marginTop: 20,
  },
  passRoleLabel: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.5,
  },
  passNameText: {
    fontSize: 20,
    fontWeight: "900",
    marginTop: 6,
  },
  passUniText: {
    fontSize: 12,
    marginTop: 2,
    textAlign: "center",
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    width: "100%",
    marginVertical: 14,
  },
  metaGrid: {
    flexDirection: "row",
    width: "100%",
    marginBottom: 16,
  },
  metaGridItem: {
    flex: 1,
    alignItems: "center",
  },
  metaGridLabel: {
    fontSize: 8,
    fontWeight: "750",
    letterSpacing: 0.5,
  },
  metaGridValue: {
    fontSize: 13,
    fontWeight: "700",
    marginTop: 4,
  },
  passIdRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  passIdText: {
    fontSize: 11,
    fontWeight: "700",
  },
  instructionsContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 20,
    paddingHorizontal: 10,
  },
  instructionText: {
    fontSize: 12,
    lineHeight: 16,
    flex: 1,
  },
  refreshBtn: {
    flexDirection: "row",
    alignItems: "center",
    height: 40,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    marginTop: 20,
  },
  refreshBtnText: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.8,
  },
});
