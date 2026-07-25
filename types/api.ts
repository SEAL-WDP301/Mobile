export interface ApiSuccessResponse<T> {
  success: true;
  message: string;
  data: T;
  timestamp: string;
}

export interface ApiErrorResponse {
  success: false;
  statusCode: number;
  message: string | string[];
  errors?: unknown[];
  timestamp: string;
}

export interface AuthUser {
  id: number;
  email: string;
  name: string;
  role: string;
  avatarUrl?: string | null;
  isActive: boolean;
  studentProfile?: StudentProfile | null;
  stakeholderProfile?: StakeholderProfile | null;
}

export interface StudentProfile {
  id: number;
  studentType: string;
  studentCode: string;
  universityName?: string | null;
  phone?: string | null;
  githubUsername?: string | null;
}

export interface StakeholderProfile {
  id: number;
  jobTitle?: string | null;
  organization?: string | null;
  experience?: string | null;
  achievements?: string | null;
  bio?: string | null;
  isPublic?: boolean;
}

export interface SignInResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

export interface EventFaqItem {
  question: string;
  answer: string;
}

export interface EventContactItem {
  label?: string;
  name?: string;
  email?: string;
  phone?: string;
  detail?: string;
  responseTime?: string;
}

export interface PublicEvent {
  id: number;
  name: string;
  description?: string | null;
  season: string;
  year: number;
  status: string;
  imageUrl?: string | null;
  image_url?: string | null;
  registrationDeadline?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  end_date?: string | null;
  githubOrgUrl?: string | null;
  location?: string | null;
  rules?: string | null;
  faq?: EventFaqItem[] | string | null;
  contact?: EventContactItem[] | string | null;
  tracks?: Track[];
  prizes?: EventPrize[];
  rounds?: Round[];
  eventAchievements?: EventAchievement[];
  _count?: { teams: number; submissions: number };
}

export interface EventPrize {
  id: number;
  name: string;
  description?: string | null;
  quantity: number;
}

export interface EventAchievement {
  id: number;
  name: string;
  track?: Pick<Track, "id" | "name"> | null;
  award?: Pick<EventPrize, "id" | "name" | "description"> | null;
}

export interface Track {
  id: number;
  name: string;
  description?: string | null;
  maxMembersPerTeam?: number | null;
}

export interface StudentRegistration {
  id: number;
  userId: number;
  eventId: number;
  trackId: number;
  hasTeam: boolean;
  skills?: string | null;
  createdAt: string;
}

export interface RegisterIndividualPayload {
  trackId: number;
  skills?: string;
}

export interface RegisterTeamPayload {
  trackId: number;
  teamName: string;
  memberEmails: string[];
}

export interface RegisteredTeam {
  id: number;
  name: string;
  status: string;
  eventId: number;
  trackId: number;
}

export interface Round {
  id: number;
  roundNumber: number;
  name: string;
  status: string;
  submissionType?: string;
  submissionDeadline?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  maxFileSizeMb?: number | null;
  isTrackSpecific?: boolean;
}

export interface MyEventEntry {
  teamId: number;
  teamName: string;
  teamStatus: string;
  event: {
    id: number;
    name: string;
    season: string;
    year: number;
    status: string;
  };
}

export interface TeamMemberUser {
  email: string;
  name: string;
  avatarUrl?: string | null;
}

export interface TeamMemberEntry {
  userId?: number;
  role: string;
  status: string;
  user: TeamMemberUser;
}

export interface MentorAssignment {
  mentor: {
    id: number;
    name: string;
    email: string;
    avatarUrl?: string | null;
    stakeholderProfile?: StakeholderProfile | null;
  };
}

export interface TeamInfo {
  id: number;
  name: string;
  status: string;
  githubRepoUrl?: string | null;
  track?: Track;
  members?: TeamMemberEntry[];
  mentorAssignments?: MentorAssignment[];
  award?: EventPrize | null;
}

export interface RegistrationStatus {
  individualRegistration?: StudentRegistration | null;
  teamInfo?: {
    role: string;
    status: string;
    team: TeamInfo;
  } | null;
}

export interface RoundSubmissionEntry {
  round: Round;
  teamRound?: { status: string; score?: number | null } | null;
  submission?: Submission | null;
  canSubmit: boolean;
  canView: boolean;
  lockReason?: string | null;
}

export interface Submission {
  id: number;
  githubUrl?: string | null;
  fileUrl?: string | null;
  description?: string | null;
  submittedAt: string;
  status: string;
  scores?: SubmissionScore[];
}

export interface SubmissionScore {
  id: number;
  scoreValue: number | string;
  comment?: string | null;
  criterion: {
    id: number;
    name: string;
    maxScore: number | string;
    weight: number | string;
  };
  judge: {
    id: number;
    name: string;
    avatarUrl?: string | null;
  };
}

export interface WorkspaceOverview {
  team: TeamInfo & { event?: { id: number; name: string } };
  role: string;
  canSubmit: boolean;
  roundSubmissions: RoundSubmissionEntry[];
  currentActiveRound?: Round | null;
  latestSubmission?: Submission | null;
  mentorFeedbacks?: MentorFeedback[];
  isEliminated?: boolean;
}

export interface ParticipantHistoryEntry {
  id: number;
  name: string;
  status: string;
  event: PublicEvent;
  track?: Track | null;
  award?: EventPrize | null;
}

export interface ProfileHistory {
  hackerHistory: ParticipantHistoryEntry[];
  judgeHistory: unknown[];
  mentorHistory: unknown[];
}

export type FeedbackStatus = "unread" | "acknowledged" | "completed";

export interface MentorFeedback {
  id: number;
  content: string;
  status: FeedbackStatus;
  createdAt: string;
  mentor?: {
    id: number;
    name: string;
    stakeholderProfile?: StakeholderProfile | null;
  };
  submission?: { round?: Round };
}

export interface AppNotification {
  id: number;
  type: string;
  title: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  actionUrl?: string | null;
  event?: { name: string } | null;
}

export interface TeamInvitation {
  teamId: number;
  teamName: string;
  eventName: string;
  leaderName: string;
}

export interface ChatMessageSender {
  id: number;
  name: string;
  avatarUrl?: string | null;
  role: string;
}

export interface ChatMessageRead {
  id: number;
  userId: number;
  readAt: string;
  user?: {
    id: number;
    name: string;
    avatarUrl?: string | null;
  };
}

export interface TeamChatMessage {
  id: number;
  teamId: number;
  senderId: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  isEdited: boolean;
  isDeleted: boolean;
  sender: ChatMessageSender;
  reads?: ChatMessageRead[];
}

export interface MentorChatMessage extends TeamChatMessage {
  mentorId: number;
}
