import type { PublicEvent } from "@/types/api";

export function isRegistrationDeadlinePassed(event: PublicEvent): boolean {
  if (!event.registrationDeadline) return false;
  return new Date(event.registrationDeadline).getTime() <= Date.now();
}

export function isEventRegistrationOpen(event: PublicEvent): boolean {
  const activeStatus = event.status === "active" || event.status === "ongoing";
  if (!activeStatus) return false;
  return !isRegistrationDeadlinePassed(event);
}

export function mapTeamStatusLabel(status?: string | null): string {
  switch (status) {
    case "approved":
      return "Đã duyệt";
    case "pending":
      return "Chờ duyệt";
    case "rejected":
      return "Bị từ chối";
    case "disqualified":
      return "Bị loại";
    default:
      return status ?? "—";
  }
}

export function mapTeamRoundStatusLabel(status?: string | null): string {
  switch (status) {
    case "competing":
      return "Đang thi đấu";
    case "advanced":
      return "Vượt vòng";
    case "eliminated":
      return "Bị loại";
    default:
      return status ?? "—";
  }
}
