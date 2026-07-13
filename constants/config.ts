export const WEB_APP_URL = process.env.EXPO_PUBLIC_WEB_URL ?? "";
export const SUPPORT_EMAIL = process.env.EXPO_PUBLIC_SUPPORT_EMAIL ?? "";
export const SUPPORT_PHONE = process.env.EXPO_PUBLIC_SUPPORT_PHONE ?? "";

export function formatParticipantPassId(
  eventYear: number,
  teamId?: number | null,
  userId?: number | null,
): string {
  const suffix = teamId != null
    ? String(teamId).padStart(4, "0")
    : userId != null
      ? String(userId).padStart(4, "0")
      : "----";
  return `SEAL-${eventYear}-${suffix}`;
}

export function formatSupportContact(): string | null {
  const parts: string[] = [];
  if (SUPPORT_EMAIL) parts.push(`Email: ${SUPPORT_EMAIL}`);
  if (SUPPORT_PHONE) parts.push(`Hotline: ${SUPPORT_PHONE}`);
  return parts.length > 0 ? parts.join("\n") : null;
}
