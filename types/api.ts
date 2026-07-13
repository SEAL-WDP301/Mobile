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
}

export interface StakeholderProfile {
  id: number;
  jobTitle?: string | null;
  organization?: string | null;
  bio?: string | null;
}

export interface SignInResponse {
  accessToken: string;
  user: AuthUser;
}

export interface PublicEvent {
  id: number;
  name: string;
  description?: string | null;
  season: string;
  year: number;
  status: string;
  registrationDeadline?: string | null;
  startDate?: string | null;
  tracks?: Track[];
  rounds?: Round[];
}

export interface Track {
  id: number;
  name: string;
  description?: string | null;
<<<<<<< HEAD
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
=======
>>>>>>> 12c1d04f4a77f81e50344195c7411b286fd976e6
}

export interface Round {
  id: number;
  roundNumber: number;
  name: string;
  status: string;
  submissionType?: string;
  submissionDeadline?: string | null;
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
<<<<<<< HEAD
  githubRepoUrl?: string | null;
=======
>>>>>>> 12c1d04f4a77f81e50344195c7411b286fd976e6
  track?: Track;
  members?: TeamMemberEntry[];
  mentorAssignments?: MentorAssignment[];
}

export interface RegistrationStatus {
<<<<<<< HEAD
  individualRegistration?: StudentRegistration | null;
=======
  individualRegistration?: unknown;
>>>>>>> 12c1d04f4a77f81e50344195c7411b286fd976e6
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
}

export interface WorkspaceOverview {
  team: TeamInfo & { event?: { id: number; name: string } };
  role: string;
  canSubmit: boolean;
  roundSubmissions: RoundSubmissionEntry[];
  currentActiveRound?: Round | null;
  latestSubmission?: Submission | null;
  mentorFeedbacks?: MentorFeedback[];
}

export interface MentorFeedback {
  id: number;
  content: string;
  status: string;
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
