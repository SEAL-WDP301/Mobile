import React, { useRef, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Send } from "lucide-react-native";
import { useTheme } from "@/constants/theme/useTheme";
import { useAuth } from "@/contexts/AuthContext";
import { useUnifiedTeamChat, type UnifiedChatMessage } from "@/hooks/useUnifiedTeamChat";
import { formatDateTime, getInitials } from "@/utils/format";

interface TeamChatPanelProps {
  teamId: number;
  mentorId?: number | null;
  subtitle?: string;
}

export default function TeamChatPanel({
  teamId,
  mentorId,
  subtitle: subtitleOverride,
}: TeamChatPanelProps) {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const [draft, setDraft] = useState("");
  const listRef = useRef<FlatList<UnifiedChatMessage>>(null);

  const { messages, loading, sending, error, sendMessage, subtitle } = useUnifiedTeamChat({
    teamId,
    mentorId,
  });
  const displaySubtitle = subtitleOverride ?? subtitle;

  const colors = {
    bg: isDark ? "#11100F" : "#F9F6F0",
    cardBg: isDark ? "#1A1918" : "#FFFFFF",
    textPrimary: isDark ? "#F8F7F5" : "#1C1917",
    textSecondary: isDark ? "#A8A29E" : "#78716C",
    accent: "#F37021",
    border: isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)",
    mineBg: "#F37021",
    otherBg: isDark ? "#2A2826" : "#EFECE6",
  };

  const handleSend = async () => {
    const text = draft.trim();
    if (!text || sending) return;
    setDraft("");
    try {
      await sendMessage(text);
      requestAnimationFrame(() => {
        listRef.current?.scrollToEnd({ animated: true });
      });
    } catch {
      setDraft(text);
    }
  };

  const renderItem = ({ item }: { item: UnifiedChatMessage }) => {
    const isMine = item.senderId === user?.id;
    const displayContent = item.isDeleted ? "Tin nhắn đã bị xóa" : item.content;

    return (
      <View style={[styles.messageRow, isMine ? styles.messageRowMine : styles.messageRowOther]}>
        {!isMine && (
          <View style={[styles.avatar, { backgroundColor: colors.accent }]}>
            <Text style={styles.avatarText}>{getInitials(item.sender.name)}</Text>
          </View>
        )}
        <View style={[styles.bubble, { backgroundColor: isMine ? colors.mineBg : colors.otherBg }]}>
          {!isMine && (
            <Text style={[styles.senderName, { color: colors.accent }]}>{item.sender.name}</Text>
          )}
          <Text style={[styles.messageText, { color: isMine ? "#FFF" : colors.textPrimary }]}>
            {displayContent}
          </Text>
          <Text style={[styles.timeText, { color: isMine ? "rgba(255,255,255,0.75)" : colors.textSecondary }]}>
            {formatDateTime(item.createdAt)}
            {item.isEdited ? " · đã sửa" : ""}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.bg }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 88 : 0}
    >
      {displaySubtitle ? (
        <View style={[styles.subtitleBar, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
          <Text style={[styles.subtitleText, { color: colors.textSecondary }]}>{displaySubtitle}</Text>
        </View>
      ) : null}

      {loading ? (
        <View style={styles.centerState}>
          <ActivityIndicator color={colors.accent} />
          <Text style={[styles.stateText, { color: colors.textSecondary }]}>Đang tải tin nhắn...</Text>
        </View>
      ) : (
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(item) => `${item.channel}-${item.id}`}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
          ListEmptyComponent={
            <View style={styles.centerState}>
              <Text style={[styles.stateText, { color: colors.textSecondary }]}>
                Chưa có tin nhắn nào. Hãy gửi lời chào!
              </Text>
            </View>
          }
        />
      )}

      {error ? <Text style={[styles.errorText, { color: "#EF4444" }]}>{error}</Text> : null}

      <View style={[styles.composer, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
        <TextInput
          value={draft}
          onChangeText={setDraft}
          placeholder="Nhắn tin..."
          placeholderTextColor={colors.textSecondary}
          style={[styles.input, { color: colors.textPrimary }]}
          multiline
          maxLength={2000}
        />
        <TouchableOpacity
          style={[styles.sendBtn, { backgroundColor: colors.accent, opacity: draft.trim() && !sending ? 1 : 0.5 }]}
          onPress={handleSend}
          disabled={!draft.trim() || sending}
        >
          {sending ? (
            <ActivityIndicator color="#FFF" size="small" />
          ) : (
            <Send size={18} color="#FFF" />
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  subtitleBar: {
    borderBottomWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  subtitleText: { fontSize: 12, lineHeight: 18 },
  listContent: { padding: 16, paddingBottom: 8, flexGrow: 1 },
  centerState: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24, gap: 8 },
  stateText: { fontSize: 13, textAlign: "center" },
  messageRow: { flexDirection: "row", marginBottom: 12, maxWidth: "88%" },
  messageRowMine: { alignSelf: "flex-end" },
  messageRowOther: { alignSelf: "flex-start" },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
    marginTop: 2,
  },
  avatarText: { color: "#FFF", fontSize: 11, fontWeight: "800" },
  bubble: { borderRadius: 16, paddingHorizontal: 12, paddingVertical: 10 },
  senderName: { fontSize: 11, fontWeight: "700", marginBottom: 4 },
  messageText: { fontSize: 14, lineHeight: 20 },
  timeText: { fontSize: 10, marginTop: 6 },
  errorText: { fontSize: 12, paddingHorizontal: 16, paddingBottom: 6 },
  composer: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
    borderTopWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  input: {
    flex: 1,
    minHeight: 42,
    maxHeight: 120,
    fontSize: 15,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  sendBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
  },
});
