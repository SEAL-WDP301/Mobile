export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function formatEventSeason(season: string, year: number): string {
  const label = season.charAt(0).toUpperCase() + season.slice(1);
  return `${label} ${year}`;
}

export function formatDateRange(
  start?: string | null,
  end?: string | null,
): string {
  if (!start) return "Chưa cập nhật";
  const startDate = new Date(start);
  const startStr = startDate.toLocaleDateString("vi-VN");
  if (!end) return startStr;
  const endStr = new Date(end).toLocaleDateString("vi-VN");
  return `${startStr} - ${endStr}`;
}

export function formatDateTime(value?: string | null): string {
  if (!value) return "—";
  return new Date(value).toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatRelativeTime(value: string): string {
  const diffMs = Date.now() - new Date(value).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "Vừa xong";
  if (minutes < 60) return `${minutes} phút trước`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} giờ trước`;
  const days = Math.floor(hours / 24);
  return `${days} ngày trước`;
}

export function computeTimeLeft(deadline?: string | null): string {
  if (!deadline) return "Chưa có hạn";
  const diff = new Date(deadline).getTime() - Date.now();
  if (diff <= 0) return "Đã hết hạn";
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  if (days > 0) return `Còn ${days} ngày ${hours} giờ`;
  const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return `Còn ${hours} giờ ${mins} phút`;
}

export function computeDeadlineProgress(
  start?: string | null,
  deadline?: string | null,
): number {
  if (!deadline) return 0;
  const end = new Date(deadline).getTime();
  const startMs = start ? new Date(start).getTime() : end - 7 * 86400000;
  const now = Date.now();
  if (now >= end) return 1;
  if (now <= startMs) return 0;
  return Math.min(1, Math.max(0, (now - startMs) / (end - startMs)));
}

export function mapEventStatusLabel(status: string): string {
  switch (status) {
    case "active":
    case "ongoing":
      return "ĐANG DIỄN RA";
    case "closed":
      return "ĐÃ KẾT THÚC";
    case "draft":
      return "NHÁP";
    default:
      return status.toUpperCase();
  }
}

export function mapRoundStatusLabel(status: string): string {
  switch (status) {
    case "open":
    case "ongoing":
      return "Đang diễn ra";
    case "closed":
      return "Đã đóng";
    case "results_published":
      return "Đã công bố kết quả";
    case "not_started":
      return "Chưa mở";
    default:
      return status;
  }
}

export function mapTeamRoleLabel(role: string): string {
  switch (role) {
    case "leader":
      return "Team Leader";
    case "member":
      return "Team Member";
    default:
      return role;
  }
}

export function computeProfileCompletion(user: {
  name?: string;
  email?: string;
  studentProfile?: {
    studentCode?: string;
    universityName?: string | null;
    phone?: string | null;
  } | null;
}): number {
  let score = 0;
  if (user.name) score += 25;
  if (user.email) score += 25;
  if (user.studentProfile?.studentCode) score += 25;
  if (user.studentProfile?.universityName) score += 15;
  if (user.studentProfile?.phone) score += 10;
  return Math.min(100, score);
}

export function mapNotificationType(type: string): string {
  return type
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}
