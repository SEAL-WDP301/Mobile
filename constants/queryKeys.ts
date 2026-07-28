/** Query key conventions for student data hooks (invalidate on mutation). */
export const queryKeys = {
  publicEvents: ["public", "events"] as const,
  publicEvent: (eventId: number) => ["public", "events", eventId] as const,
  myEvents: ["student", "my-events"] as const,
  teamStatus: (eventId: number) => ["student", "team-status", eventId] as const,
  workspace: (eventId: number) => ["student", "workspace", eventId] as const,
  pendingInvitations: ["student", "invitations", "pending"] as const,
  mentorFeedback: (eventId: number) => ["student", "mentor-feedback", eventId] as const,
  notifications: ["users", "notifications"] as const,
  profile: ["users", "profile"] as const,
};
