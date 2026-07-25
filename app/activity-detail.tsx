import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Award, Calendar, ChevronLeft, Trophy } from "lucide-react-native";
import { useTheme } from "@/constants/theme/useTheme";
import { getProfileHistory } from "@/services/api/users";
import type { ParticipantHistoryEntry } from "@/types/api";
import { formatEventSeason, mapEventStatusLabel } from "@/utils/format";

export default function ActivityDetailScreen() {
  const { isDark } = useTheme();
  const [items, setItems] = useState<ParticipantHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const colors = {
    bg: isDark ? "#11100F" : "#F9F6F0",
    cardBg: isDark ? "#1A1918" : "#FFFFFF",
    cardElevated: isDark ? "#211F1D" : "#F5F3EF",
    textPrimary: isDark ? "#F8F7F5" : "#1C1917",
    textSecondary: isDark ? "#A8A29E" : "#78716C",
    accent: "#F37021",
    success: "#10B981",
    border: isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)",
  };

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);
    try {
      const history = await getProfileHistory();
      setItems(history.hackerHistory);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Không tải được lịch sử tham gia.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]} edges={["top", "bottom"]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      <View style={[styles.appHeader, { borderBottomColor: colors.border }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ChevronLeft size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Lịch sử tham gia</Text>
        <View style={{ width: 24 }} />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={colors.accent} style={{ marginTop: 64 }} />
      ) : (
        <ScrollView
          contentContainerStyle={styles.content}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => void load(true)}
              tintColor={colors.accent}
            />
          }
        >
          {error ? (
            <View style={[styles.emptyCard, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
              <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>Không tải được dữ liệu</Text>
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>{error}</Text>
            </View>
          ) : items.length === 0 ? (
            <View style={[styles.emptyCard, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
              <Calendar size={32} color={colors.accent} />
              <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>Chưa có cuộc thi</Text>
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                Các đội và thành tích của bạn sẽ xuất hiện tại đây.
              </Text>
            </View>
          ) : (
            items.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.border }]}
                activeOpacity={0.85}
                onPress={() =>
                  router.push({
                    pathname: "/event-detail",
                    params: { id: String(item.event.id) },
                  })
                }
              >
                <View style={styles.cardHeader}>
                  <View style={[styles.icon, { backgroundColor: `${colors.accent}15` }]}>
                    <Award size={20} color={colors.accent} />
                  </View>
                  <View style={styles.headerText}>
                    <Text style={[styles.eventName, { color: colors.textPrimary }]}>
                      {item.event.name}
                    </Text>
                    <Text style={[styles.meta, { color: colors.textSecondary }]}>
                      {formatEventSeason(item.event.season, item.event.year)}
                    </Text>
                  </View>
                </View>

                <View style={[styles.teamBox, { backgroundColor: colors.cardElevated }]}>
                  <Text style={[styles.teamName, { color: colors.textPrimary }]}>{item.name}</Text>
                  <Text style={[styles.meta, { color: colors.textSecondary }]}>
                    {item.track?.name ?? "Chưa có track"} · {mapEventStatusLabel(item.event.status)}
                  </Text>
                </View>

                {item.award ? (
                  <View style={[styles.awardBox, { borderColor: `${colors.success}40` }]}>
                    <Trophy size={16} color={colors.success} />
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.awardName, { color: colors.success }]}>{item.award.name}</Text>
                      {item.award.description ? (
                        <Text style={[styles.meta, { color: colors.textSecondary }]}>
                          {item.award.description}
                        </Text>
                      ) : null}
                    </View>
                  </View>
                ) : null}
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  appHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backBtn: { width: 32, height: 32, justifyContent: "center", alignItems: "center" },
  headerTitle: { fontSize: 16, fontWeight: "800", textTransform: "uppercase", letterSpacing: 0.5 },
  content: { padding: 16, paddingBottom: 40, gap: 12 },
  emptyCard: { borderRadius: 20, borderWidth: 1, padding: 32, alignItems: "center", gap: 8 },
  emptyTitle: { fontSize: 17, fontWeight: "800", textAlign: "center" },
  emptyText: { fontSize: 13, lineHeight: 19, textAlign: "center" },
  card: { borderRadius: 20, borderWidth: 1, padding: 16, gap: 12 },
  cardHeader: { flexDirection: "row", alignItems: "center", gap: 12 },
  icon: { width: 42, height: 42, borderRadius: 12, justifyContent: "center", alignItems: "center" },
  headerText: { flex: 1 },
  eventName: { fontSize: 16, fontWeight: "800" },
  meta: { fontSize: 12, lineHeight: 18, marginTop: 2 },
  teamBox: { borderRadius: 12, padding: 12 },
  teamName: { fontSize: 14, fontWeight: "700" },
  awardBox: { flexDirection: "row", alignItems: "center", gap: 10, borderWidth: 1, borderRadius: 12, padding: 12 },
  awardName: { fontSize: 13, fontWeight: "800" },
});
