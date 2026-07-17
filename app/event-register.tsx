import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { ChevronLeft, Users, User } from "lucide-react-native";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useTheme } from "@/constants/theme/useTheme";
import { useEventContext } from "@/contexts/EventContext";
import { useTeamStatus } from "@/hooks/useTeamStatus";
import { getPublicEventById } from "@/services/api/events";
import { registerIndividual, registerTeam } from "@/services/api/teams";
import { ApiError } from "@/services/api/client";
import { isEventRegistrationOpen } from "@/utils/eventRegistration";
import type { PublicEvent, Track } from "@/types/api";

type RegisterMode = "individual" | "team";

function parseEmails(raw: string): string[] {
  return Array.from(
    new Set(
      raw
        .split(/[,\n;]+/)
        .map((email) => email.trim().toLowerCase())
        .filter(Boolean),
    ),
  );
}

export default function EventRegisterScreen() {
  const { isDark } = useTheme();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const eventId = id ? parseInt(id, 10) : null;

  const { refreshMyEvents, setSelectedEventId } = useEventContext();
  const { data: teamStatus, loading: loadingStatus, refresh: refreshStatus } =
    useTeamStatus(eventId);

  const [event, setEvent] = useState<PublicEvent | null>(null);
  const [loadingEvent, setLoadingEvent] = useState(true);
  const [mode, setMode] = useState<RegisterMode>("team");
  const [trackId, setTrackId] = useState<number | null>(null);
  const [skills, setSkills] = useState("");
  const [teamName, setTeamName] = useState("");
  const [memberEmails, setMemberEmails] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const hasTeam = !!teamStatus?.teamInfo?.team;
  const tracks = event?.tracks ?? [];
  const selectedTrack = tracks.find((t) => t.id === trackId) ?? null;
  const maxMembers = selectedTrack?.maxMembersPerTeam ?? 4;

  const colors = {
    bg: isDark ? "#11100F" : "#F9F6F0",
    cardBg: isDark ? "#1A1918" : "#FFFFFF",
    textPrimary: isDark ? "#F8F7F5" : "#1C1917",
    textSecondary: isDark ? "#A8A29E" : "#78716C",
    accent: "#F37021",
    border: isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)",
  };

  useEffect(() => {
    if (!eventId) {
      setLoadingEvent(false);
      return;
    }
    setLoadingEvent(true);
    getPublicEventById(eventId)
      .then((data) => {
        setEvent(data);
        if (data.tracks?.[0]) {
          setTrackId(data.tracks[0].id);
        }
      })
      .catch(() => setEvent(null))
      .finally(() => setLoadingEvent(false));
  }, [eventId]);

  useEffect(() => {
    const savedSkills = teamStatus?.individualRegistration?.skills;
    if (savedSkills) setSkills(savedSkills);
  }, [teamStatus?.individualRegistration?.skills]);

  const registrationOpen = event ? isEventRegistrationOpen(event) : false;

  const canRegister = useMemo(() => {
    if (!eventId || !trackId || hasTeam || !registrationOpen) return false;
    if (mode === "individual") return true;
    return teamName.trim().length >= 2;
  }, [eventId, trackId, hasTeam, mode, teamName, registrationOpen]);

  const handleSubmit = async () => {
    if (!canRegister || submitting || !eventId || !trackId) return;

    if (mode === "team") {
      const emails = parseEmails(memberEmails);
      if (emails.length + 1 > maxMembers) {
        Alert.alert(
          "Quá số thành viên",
          `Track này cho phép tối đa ${maxMembers} thành viên (bao gồm trưởng nhóm).`,
        );
        return;
      }

      try {
        setSubmitting(true);
        await registerTeam(eventId, {
          trackId,
          teamName: teamName.trim(),
          memberEmails: emails,
        });
        await refreshMyEvents();
        await refreshStatus();
        setSelectedEventId(eventId);
        Alert.alert(
          "Đăng ký thành công",
          emails.length > 0
            ? "Đội đã được tạo. Lời mời đã gửi tới các thành viên."
            : "Đội đã được tạo. Bạn có thể mời thêm thành viên sau.",
          [{ text: "OK", onPress: () => router.replace("/(tabs)/teams") }],
        );
      } catch (error) {
        const message =
          error instanceof ApiError ? error.message : "Không đăng ký được đội thi.";
        Alert.alert("Đăng ký thất bại", message);
      } finally {
        setSubmitting(false);
      }
      return;
    }

    try {
      setSubmitting(true);
      await registerIndividual(eventId, {
        trackId,
        skills: skills.trim() || undefined,
      });
      await refreshMyEvents();
      await refreshStatus();
      setSelectedEventId(eventId);
      Alert.alert("Đăng ký thành công", "Bạn đã đăng ký cá nhân. Hãy tạo hoặc tham gia đội khi sẵn sàng.", [
        { text: "OK", onPress: () => router.replace("/(tabs)/teams") },
      ]);
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : "Không đăng ký được cuộc thi.";
      Alert.alert("Đăng ký thất bại", message);
    } finally {
      setSubmitting(false);
    }
  };

  const renderTrackOption = (track: Track) => {
    const selected = track.id === trackId;
    return (
      <TouchableOpacity
        key={track.id}
        style={[
          styles.trackOption,
          {
            backgroundColor: selected ? `${colors.accent}15` : colors.cardBg,
            borderColor: selected ? colors.accent : colors.border,
          },
        ]}
        onPress={() => setTrackId(track.id)}
        activeOpacity={0.85}
      >
        <Text style={[styles.trackName, { color: colors.textPrimary }]}>{track.name}</Text>
        {track.description ? (
          <Text style={[styles.trackDesc, { color: colors.textSecondary }]} numberOfLines={2}>
            {track.description}
          </Text>
        ) : null}
        {track.maxMembersPerTeam ? (
          <Text style={[styles.trackMeta, { color: colors.textSecondary }]}>
            Tối đa {track.maxMembersPerTeam} thành viên/đội
          </Text>
        ) : null}
      </TouchableOpacity>
    );
  };

  if (!eventId) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
        <Text style={{ color: colors.textPrimary, textAlign: "center", marginTop: 40 }}>
          Không tìm thấy cuộc thi.
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]} edges={["top", "bottom"]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ChevronLeft size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Đăng ký cuộc thi</Text>
        <View style={{ width: 32 }} />
      </View>

      {loadingEvent || loadingStatus ? (
        <ActivityIndicator color={colors.accent} style={{ marginTop: 40 }} />
      ) : (
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Text style={[styles.eventName, { color: colors.textPrimary }]}>
            {event?.name ?? "Cuộc thi"}
          </Text>
          <Text style={[styles.hint, { color: colors.textSecondary }]}>
            Chọn hình thức đăng ký và bảng đấu (track) phù hợp với đội của bạn.
          </Text>

          {hasTeam ? (
            <View style={[styles.noticeBox, { backgroundColor: `${colors.accent}12`, borderColor: `${colors.accent}40` }]}>
              <Text style={[styles.noticeText, { color: colors.accent }]}>
                Bạn đã có đội trong cuộc thi này: {teamStatus?.teamInfo?.team.name}
              </Text>
            </View>
          ) : !registrationOpen ? (
            <View style={[styles.noticeBox, { backgroundColor: `${colors.accent}12`, borderColor: `${colors.accent}40` }]}>
              <Text style={[styles.noticeText, { color: colors.accent }]}>
                Đăng ký đã đóng hoặc sự kiện không còn trong giai đoạn active.
              </Text>
            </View>
          ) : (
            <>
              <View style={[styles.modeRow, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
                <TouchableOpacity
                  style={[styles.modeBtn, mode === "team" && { backgroundColor: colors.accent }]}
                  onPress={() => setMode("team")}
                >
                  <Users size={16} color={mode === "team" ? "#FFF" : colors.textSecondary} />
                  <Text style={[styles.modeLabel, { color: mode === "team" ? "#FFF" : colors.textSecondary }]}>
                    Tạo đội
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modeBtn, mode === "individual" && { backgroundColor: colors.accent }]}
                  onPress={() => setMode("individual")}
                >
                  <User size={16} color={mode === "individual" ? "#FFF" : colors.textSecondary} />
                  <Text style={[styles.modeLabel, { color: mode === "individual" ? "#FFF" : colors.textSecondary }]}>
                    Cá nhân
                  </Text>
                </TouchableOpacity>
              </View>

              <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>BẢNG ĐẤU (TRACK)</Text>
              {tracks.length === 0 ? (
                <Text style={[styles.hint, { color: colors.textSecondary }]}>
                  Cuộc thi chưa mở track đăng ký.
                </Text>
              ) : (
                tracks.map(renderTrackOption)
              )}

              {mode === "team" ? (
                <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
                  <Text style={[styles.label, { color: colors.textSecondary }]}>Tên đội</Text>
                  <Input
                    value={teamName}
                    onChangeText={setTeamName}
                    placeholder="Nhập tên đội"
                    autoCapitalize="words"
                  />

                  <Text style={[styles.label, { color: colors.textSecondary, marginTop: 16 }]}>
                    Email thành viên (tùy chọn)
                  </Text>
                  <Text style={[styles.fieldHint, { color: colors.textSecondary }]}>
                    Nhập email thành viên, phân tách bằng dấu phẩy hoặc xuống dòng. Tối đa {maxMembers - 1} người mời.
                  </Text>
                  <TextInput
                    value={memberEmails}
                    onChangeText={setMemberEmails}
                    placeholder="email1@example.com, email2@example.com"
                    placeholderTextColor={colors.textSecondary}
                    style={[
                      styles.textArea,
                      {
                        color: colors.textPrimary,
                        backgroundColor: isDark ? "#2A2826" : "#EFECE6",
                        borderColor: colors.border,
                      },
                    ]}
                    multiline
                    autoCapitalize="none"
                    keyboardType="email-address"
                  />
                </View>
              ) : (
                <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
                  <Text style={[styles.label, { color: colors.textSecondary }]}>Kỹ năng (tùy chọn)</Text>
                  <TextInput
                    value={skills}
                    onChangeText={setSkills}
                    placeholder="React Native, UI/UX, Machine Learning..."
                    placeholderTextColor={colors.textSecondary}
                    style={[
                      styles.textArea,
                      {
                        color: colors.textPrimary,
                        backgroundColor: isDark ? "#2A2826" : "#EFECE6",
                        borderColor: colors.border,
                      },
                    ]}
                    multiline
                  />
                  <Text style={[styles.fieldHint, { color: colors.textSecondary, marginTop: 8 }]}>
                    Đăng ký cá nhân giúp BTC biết track bạn quan tâm. Bạn vẫn cần tạo hoặc tham gia đội để thi.
                  </Text>
                </View>
              )}

              <Button
                title={submitting ? "Đang đăng ký..." : mode === "team" ? "Tạo đội & đăng ký" : "Đăng ký cá nhân"}
                onPress={handleSubmit}
                loading={submitting}
              />
            </>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backBtn: { width: 32, height: 32, justifyContent: "center", alignItems: "center" },
  headerTitle: { flex: 1, textAlign: "center", fontSize: 15, fontWeight: "800" },
  content: { padding: 16, paddingBottom: 40, gap: 12 },
  eventName: { fontSize: 20, fontWeight: "800" },
  hint: { fontSize: 13, lineHeight: 20 },
  noticeBox: { borderWidth: 1, borderRadius: 12, padding: 14 },
  noticeText: { fontSize: 13, fontWeight: "600", lineHeight: 18 },
  modeRow: {
    flexDirection: "row",
    borderWidth: 1,
    borderRadius: 14,
    padding: 4,
    gap: 6,
  },
  modeBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    height: 42,
    borderRadius: 10,
  },
  modeLabel: { fontSize: 13, fontWeight: "700" },
  sectionTitle: { fontSize: 11, fontWeight: "800", letterSpacing: 0.8, marginTop: 4 },
  trackOption: { borderWidth: 1, borderRadius: 14, padding: 14 },
  trackName: { fontSize: 14, fontWeight: "700" },
  trackDesc: { fontSize: 12, marginTop: 4, lineHeight: 18 },
  trackMeta: { fontSize: 11, marginTop: 6 },
  card: { borderWidth: 1, borderRadius: 16, padding: 16 },
  label: { fontSize: 12, fontWeight: "700", marginBottom: 8, textTransform: "uppercase" },
  fieldHint: { fontSize: 12, lineHeight: 18, marginBottom: 8 },
  textArea: {
    minHeight: 96,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    textAlignVertical: "top",
  },
});
