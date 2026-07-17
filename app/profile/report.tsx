import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
  Linking,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ProfileScreenHeader from "@/components/profile/ProfileScreenHeader";
import Button from "@/components/ui/Button";
import { useTheme } from "@/constants/theme/useTheme";
import { useAuth } from "@/contexts/AuthContext";
import { useEventContext } from "@/contexts/EventContext";
import { usePublicEvents } from "@/hooks/usePublicEvents";
import { SUPPORT_EMAIL, SUPPORT_PHONE } from "@/constants/config";
import type { EventContactItem, PublicEvent } from "@/types/api";

function normalizeContact(raw: PublicEvent["contact"]): EventContactItem[] {
  if (!raw) return [];
  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw) as unknown;
      return Array.isArray(parsed) ? (parsed as EventContactItem[]) : [];
    } catch {
      return [];
    }
  }
  return raw;
}

function pickSupportEmail(contacts: EventContactItem[]): string | null {
  const withEmail = contacts.find((c) => c.email?.trim());
  return withEmail?.email?.trim() ?? null;
}

export default function ReportFeedbackScreen() {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const { selectedEventId, myEvents } = useEventContext();
  const { events: publicEvents } = usePublicEvents();

  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const colors = {
    bg: isDark ? "#11100F" : "#F9F6F0",
    cardBg: isDark ? "#1A1918" : "#FFFFFF",
    inputBg: isDark ? "#2A2826" : "#EFECE6",
    textPrimary: isDark ? "#F8F7F5" : "#1C1917",
    textSecondary: isDark ? "#A8A29E" : "#78716C",
    accent: "#F37021",
    border: isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)",
  };

  const event = useMemo(() => {
    const id = selectedEventId ?? myEvents[0]?.event.id ?? null;
    if (!id) return publicEvents[0] ?? null;
    return publicEvents.find((e) => e.id === id) ?? publicEvents[0] ?? null;
  }, [selectedEventId, myEvents, publicEvents]);

  const eventEmail = pickSupportEmail(normalizeContact(event?.contact));
  const toEmail = SUPPORT_EMAIL || eventEmail || "";

  const handleSend = async () => {
    if (!subject.trim() || !message.trim()) {
      Alert.alert("Thiếu thông tin", "Vui lòng nhập tiêu đề và nội dung.");
      return;
    }
    if (!toEmail) {
      Alert.alert(
        "Chưa có email hỗ trợ",
        "Cấu hình EXPO_PUBLIC_SUPPORT_EMAIL trong .env hoặc cập nhật contact trên cuộc thi.",
      );
      return;
    }

    const body = [
      message.trim(),
      "",
      "---",
      `Người gửi: ${user?.name ?? "—"} (${user?.email ?? "—"})`,
      `Cuộc thi: ${event?.name ?? "—"}`,
      SUPPORT_PHONE ? `Hotline: ${SUPPORT_PHONE}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    const url = `mailto:${encodeURIComponent(toEmail)}?subject=${encodeURIComponent(
      `[SEAL Mobile] ${subject.trim()}`,
    )}&body=${encodeURIComponent(body)}`;

    try {
      setSending(true);
      const canOpen = await Linking.canOpenURL(url);
      if (!canOpen) {
        Alert.alert("Không mở được email", `Gửi thủ công tới: ${toEmail}`);
        return;
      }
      await Linking.openURL(url);
    } catch {
      Alert.alert("Lỗi", "Không mở được ứng dụng email trên thiết bị.");
    } finally {
      setSending(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]} edges={["top", "bottom"]}>
      <ProfileScreenHeader title="Báo cáo / Góp ý" />

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={[styles.hint, { color: colors.textSecondary }]}>
          Nội dung sẽ mở ứng dụng email trên thiết bị và gửi tới ban tổ chức
          {toEmail ? ` (${toEmail})` : ""}. Không có API báo cáo riêng trên backend.
        </Text>

        <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>Tiêu đề</Text>
          <TextInput
            value={subject}
            onChangeText={setSubject}
            placeholder="Ví dụ: Lỗi nộp bài / Góp ý UI"
            placeholderTextColor={colors.textSecondary}
            style={[
              styles.input,
              {
                color: colors.textPrimary,
                backgroundColor: colors.inputBg,
                borderColor: colors.border,
              },
            ]}
          />

          <Text style={[styles.label, { color: colors.textSecondary, marginTop: 14 }]}>
            Nội dung
          </Text>
          <TextInput
            value={message}
            onChangeText={setMessage}
            placeholder="Mô tả sự cố hoặc ý kiến đóng góp..."
            placeholderTextColor={colors.textSecondary}
            multiline
            style={[
              styles.textArea,
              {
                color: colors.textPrimary,
                backgroundColor: colors.inputBg,
                borderColor: colors.border,
              },
            ]}
            textAlignVertical="top"
          />
        </View>

        <Button
          title={sending ? "Đang mở email..." : "Gửi qua email"}
          onPress={handleSend}
          loading={sending}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 40, gap: 14 },
  hint: { fontSize: 13, lineHeight: 20 },
  card: { borderRadius: 16, borderWidth: 1, padding: 16 },
  label: {
    fontSize: 11,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginBottom: 8,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 15,
  },
  textArea: {
    minHeight: 140,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
  },
});
