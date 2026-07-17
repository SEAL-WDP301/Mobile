import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  Modal,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { X } from "lucide-react-native";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import type { PublicEvent, TeamInfo, Track } from "@/types/api";
import { updateTeamRegistration, transferLeadership } from "@/services/api/teams";
import { ApiError } from "@/services/api/client";

interface TeamManageModalProps {
  visible: boolean;
  onClose: () => void;
  eventId: number;
  event: PublicEvent | null;
  team: TeamInfo;
  isLeader: boolean;
  onSuccess: () => void;
  colors: {
    cardBg: string;
    textPrimary: string;
    textSecondary: string;
    accent: string;
    border: string;
    cardElevated: string;
  };
}

function parseEmails(raw: string): string[] {
  return Array.from(
    new Set(
      raw
        .split(/[,\n;]+/)
        .map((e) => e.trim().toLowerCase())
        .filter(Boolean),
    ),
  );
}

export default function TeamManageModal({
  visible,
  onClose,
  eventId,
  event,
  team,
  isLeader,
  onSuccess,
  colors,
}: TeamManageModalProps) {
  const [teamName, setTeamName] = useState(team.name);
  const [trackId, setTrackId] = useState(team.track?.id ?? 0);
  const [memberEmails, setMemberEmails] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [transferringId, setTransferringId] = useState<number | null>(null);

  const tracks = event?.tracks ?? [];
  const maxMembers = tracks.find((t) => t.id === trackId)?.maxMembersPerTeam ?? 4;

  const acceptedMembers = team.members?.filter((m) => m.status === "accepted") ?? [];
  const pendingMembers = team.members?.filter((m) => m.status === "pending") ?? [];

  useEffect(() => {
    if (!visible) return;
    setTeamName(team.name);
    setTrackId(team.track?.id ?? tracks[0]?.id ?? 0);
    const emails =
      team.members
        ?.filter((m) => m.status === "accepted" && m.role !== "leader")
        .map((m) => m.user.email)
        .join("\n") ?? "";
    setMemberEmails(emails);
  }, [visible, team, tracks]);

  const transferCandidates = useMemo(
    () =>
      acceptedMembers.filter(
        (m) => m.role !== "leader" && m.userId != null,
      ),
    [acceptedMembers],
  );

  const handleSave = async () => {
    if (!isLeader) return;
    if (!teamName.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập tên đội.");
      return;
    }
    if (!trackId) {
      Alert.alert("Lỗi", "Vui lòng chọn track.");
      return;
    }

    const emails = parseEmails(memberEmails);
    if (emails.length + 1 > maxMembers) {
      Alert.alert("Lỗi", `Tối đa ${maxMembers} thành viên/đội (bao gồm trưởng nhóm).`);
      return;
    }

    try {
      setSubmitting(true);
      await updateTeamRegistration(eventId, {
        trackId,
        teamName: teamName.trim(),
        memberEmails: emails,
      });
      onSuccess();
      onClose();
      Alert.alert("Thành công", "Đã cập nhật thông tin đội.");
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : "Không cập nhật được đội.";
      Alert.alert("Lỗi", message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleTransfer = async (newLeaderUserId: number, name: string) => {
    Alert.alert(
      "Chuyển quyền trưởng nhóm",
      `Bạn có chắc muốn chuyển quyền leader cho ${name}?`,
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xác nhận",
          onPress: async () => {
            try {
              setTransferringId(newLeaderUserId);
              await transferLeadership(team.id, newLeaderUserId);
              onSuccess();
              onClose();
              Alert.alert("Thành công", "Đã chuyển quyền trưởng nhóm.");
            } catch (error) {
              const message =
                error instanceof ApiError
                  ? error.message
                  : "Không chuyển được quyền leader.";
              Alert.alert("Lỗi", message);
            } finally {
              setTransferringId(null);
            }
          },
        },
      ],
    );
  };

  const renderTrack = (track: Track) => {
    const selected = track.id === trackId;
    return (
      <TouchableOpacity
        key={track.id}
        style={[
          styles.trackChip,
          {
            borderColor: selected ? colors.accent : colors.border,
            backgroundColor: selected ? `${colors.accent}15` : colors.cardElevated,
          },
        ]}
        onPress={() => setTrackId(track.id)}
      >
        <Text style={{ color: colors.textPrimary, fontWeight: selected ? "700" : "500" }}>
          {track.name}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.sheet, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.textPrimary }]}>
              {isLeader ? "Quản lý đội" : "Thông tin đội"}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <X size={20} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
            <Text style={[styles.label, { color: colors.textSecondary }]}>Tên đội</Text>
            <Input
              value={teamName}
              onChangeText={setTeamName}
              placeholder="Tên đội"
              editable={isLeader}
            />

            <Text style={[styles.label, { color: colors.textSecondary, marginTop: 12 }]}>Track</Text>
            <View style={styles.trackRow}>{tracks.map(renderTrack)}</View>

            {isLeader ? (
              <>
                <Text style={[styles.label, { color: colors.textSecondary, marginTop: 12 }]}>
                  Email thành viên (mỗi dòng một email, tối đa {maxMembers - 1} người ngoài bạn)
                </Text>
                <Input
                  value={memberEmails}
                  onChangeText={setMemberEmails}
                  placeholder="member1@email.com"
                  multiline
                  textAlignVertical={memberEmails.includes("\n") ? "top" : "center"}
                />
                <Text style={[styles.hint, { color: colors.textSecondary }]}>
                  Bỏ email khỏi danh sách để xóa lời mời/thành viên (chỉ khi sự kiện còn active).
                </Text>
              </>
            ) : null}

            {pendingMembers.length > 0 && (
              <>
                <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>ĐANG CHỜ XÁC NHẬN</Text>
                {pendingMembers.map((m, i) => (
                  <Text key={i} style={[styles.pendingItem, { color: colors.textSecondary }]}>
                    {m.user.name} · {m.user.email}
                  </Text>
                ))}
              </>
            )}

            {isLeader && transferCandidates.length > 0 && (
              <>
                <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>CHUYỂN QUYỀN LEADER</Text>
                {transferCandidates.map((m) => (
                  <TouchableOpacity
                    key={m.userId}
                    style={[styles.transferRow, { borderColor: colors.border }]}
                    onPress={() => m.userId && handleTransfer(m.userId, m.user.name)}
                    disabled={transferringId === m.userId}
                  >
                    <Text style={{ color: colors.textPrimary, flex: 1 }}>{m.user.name}</Text>
                    {transferringId === m.userId ? (
                      <ActivityIndicator size="small" color={colors.accent} />
                    ) : (
                      <Text style={{ color: colors.accent, fontWeight: "700" }}>Chuyển</Text>
                    )}
                  </TouchableOpacity>
                ))}
              </>
            )}
          </ScrollView>

          {isLeader && (
            <View style={styles.footer}>
              <Button
                title={submitting ? "Đang lưu..." : "Lưu thay đổi"}
                onPress={handleSave}
                disabled={submitting}
              />
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  sheet: { maxHeight: "90%", borderTopLeftRadius: 24, borderTopRightRadius: 24, borderWidth: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  title: { fontSize: 18, fontWeight: "800" },
  content: { padding: 16, paddingBottom: 32 },
  label: { fontSize: 12, fontWeight: "700", marginBottom: 6 },
  hint: { fontSize: 11, marginTop: 6, lineHeight: 16 },
  trackRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  trackChip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, borderWidth: 1 },
  sectionTitle: { fontSize: 11, fontWeight: "800", marginTop: 16, marginBottom: 8, letterSpacing: 0.5 },
  pendingItem: { fontSize: 13, marginBottom: 4 },
  transferRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 8,
  },
  footer: { padding: 16, paddingBottom: 24 },
});
