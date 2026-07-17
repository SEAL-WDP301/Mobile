import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react-native";
import ProfileScreenHeader from "@/components/profile/ProfileScreenHeader";
import { useTheme } from "@/constants/theme/useTheme";
import { useEventContext } from "@/contexts/EventContext";
import { usePublicEvents } from "@/hooks/usePublicEvents";
import { getPublicEventById } from "@/services/api/events";
import type { EventFaqItem, PublicEvent } from "@/types/api";

function normalizeFaq(raw: PublicEvent["faq"]): EventFaqItem[] {
  if (!raw) return [];
  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw) as unknown;
      return Array.isArray(parsed) ? normalizeFaq(parsed as EventFaqItem[]) : [];
    } catch {
      return raw.trim()
        ? [{ question: "FAQ", answer: raw.trim() }]
        : [];
    }
  }
  return raw.filter(
    (item) =>
      item &&
      typeof item.question === "string" &&
      typeof item.answer === "string",
  );
}

export default function FaqScreen() {
  const { isDark } = useTheme();
  const { selectedEventId, myEvents } = useEventContext();
  const { events: publicEvents } = usePublicEvents();
  const [event, setEvent] = useState<PublicEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const colors = {
    bg: isDark ? "#11100F" : "#F9F6F0",
    cardBg: isDark ? "#1A1918" : "#FFFFFF",
    textPrimary: isDark ? "#F8F7F5" : "#1C1917",
    textSecondary: isDark ? "#A8A29E" : "#78716C",
    accent: "#F37021",
    border: isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)",
  };

  const eventId =
    selectedEventId ??
    myEvents[0]?.event.id ??
    publicEvents.find((e) => normalizeFaq(e.faq).length > 0)?.id ??
    publicEvents[0]?.id ??
    null;

  useEffect(() => {
    if (!eventId) {
      setEvent(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    getPublicEventById(eventId)
      .then(setEvent)
      .catch(() => setEvent(null))
      .finally(() => setLoading(false));
  }, [eventId]);

  const faqs = useMemo(() => normalizeFaq(event?.faq), [event?.faq]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]} edges={["top", "bottom"]}>
      <ProfileScreenHeader title="Câu hỏi thường gặp" />

      <ScrollView contentContainerStyle={styles.content}>
        {loading ? (
          <ActivityIndicator color={colors.accent} style={{ marginTop: 32 }} />
        ) : !eventId ? (
          <View style={[styles.empty, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
            <HelpCircle size={28} color={colors.textSecondary} />
            <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>
              Chưa có cuộc thi
            </Text>
            <Text style={[styles.emptyBody, { color: colors.textSecondary }]}>
              Tham gia hoặc chọn một cuộc thi để xem FAQ từ ban tổ chức.
            </Text>
          </View>
        ) : (
          <>
            <Text style={[styles.eventName, { color: colors.accent }]}>
              {event?.name ?? "Cuộc thi"}
            </Text>

            {faqs.length === 0 ? (
              <View style={[styles.empty, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
                <HelpCircle size={28} color={colors.textSecondary} />
                <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>
                  Chưa có FAQ
                </Text>
                <Text style={[styles.emptyBody, { color: colors.textSecondary }]}>
                  Ban tổ chức chưa cập nhật câu hỏi thường gặp cho cuộc thi này.
                </Text>
              </View>
            ) : (
              faqs.map((item, index) => {
                const open = openIndex === index;
                return (
                  <View
                    key={`${item.question}-${index}`}
                    style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.border }]}
                  >
                    <TouchableOpacity
                      style={styles.qRow}
                      activeOpacity={0.75}
                      onPress={() => setOpenIndex(open ? null : index)}
                    >
                      <Text style={[styles.question, { color: colors.textPrimary }]}>
                        {item.question}
                      </Text>
                      {open ? (
                        <ChevronUp size={18} color={colors.textSecondary} />
                      ) : (
                        <ChevronDown size={18} color={colors.textSecondary} />
                      )}
                    </TouchableOpacity>
                    {open ? (
                      <Text style={[styles.answer, { color: colors.textSecondary }]}>
                        {item.answer}
                      </Text>
                    ) : null}
                  </View>
                );
              })
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 40, gap: 10 },
  eventName: { fontSize: 12, fontWeight: "800", textTransform: "uppercase", letterSpacing: 0.5 },
  card: { borderRadius: 14, borderWidth: 1, padding: 14 },
  qRow: { flexDirection: "row", alignItems: "flex-start", gap: 10 },
  question: { flex: 1, fontSize: 14, fontWeight: "700", lineHeight: 20 },
  answer: { fontSize: 13, lineHeight: 20, marginTop: 10 },
  empty: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 28,
    alignItems: "center",
    gap: 8,
    marginTop: 12,
  },
  emptyTitle: { fontSize: 16, fontWeight: "800" },
  emptyBody: { fontSize: 13, textAlign: "center", lineHeight: 20 },
});
