export interface Member {
  name: string;
  role: string;
  uni: string;
  status: "Online" | "Offline" | "Idle";
  you?: boolean;
  initials: string;
}

export interface Mentor {
  name: string;
  position: string;
  org: string;
  expertise: string[];
  bio: string;
  assignedTeams: string;
  slots: string;
  nextAppointment?: string;
  rating: number;
}

export interface Activity {
  id: number;
  time: string;
  title: string;
  type: "Workshop" | "Mentoring" | "Pitching" | "Deadline" | "General";
  location: string;
  countdownText: string;
  mentorName?: string;
  isMyTeam: boolean;
  status?: "ongoing" | "upcoming" | "ended" | "changed" | "cancelled";
  description?: string;
  meetingUrl?: string;
  order?: string;
}

export interface Event {
  id: number;
  name: string;
  season: string;
  date: string;
  location: string;
  status: "Active" | "Registration Open" | "Ended";
  currentRound: string;
  myTeam: string;
  track: string;
  theme: string;
  rules: string[];
  criteria: { criterion: string; weight: string; desc: string }[];
  faq: { q: string; a: string }[];
  handbookUrl: string;
  contact: string;
}

export interface Announcement {
  id: number;
  title: string;
  body: string;
  time: string;
  type: "warning" | "success" | "info";
  unread: boolean;
}

export interface JudgeFeedback {
  criterion: string;
  score: number;
  maxScore: number;
  comment: string;
}

export const CURRENT_USER = {
  name: "Tâm Nguyễn",
  studentId: "SE170123",
  email: "tam.nguyen@fpt.edu.vn",
  uni: "FPT University HCM",
  role: "Team Leader",
  avatarInitials: "TN",
  profileCompletion: 85,
  skills: ["React Native", "TypeScript", "UI/UX Design", "Machine Learning"],
  github: "github.com/tamnguyen",
  linkedin: "linkedin.com/in/tamnguyen",
};

export const TEAM_MEMBERS: Member[] = [
  { name: "Tâm Nguyễn", role: "Team Leader / Mobile Dev", uni: "FPT University HCM", status: "Online", you: true, initials: "TN" },
  { name: "Linh Trần", role: "Backend Dev", uni: "FPT University HN", status: "Online", initials: "LT" },
  { name: "Minh Phạm", role: "AI Research / ML", uni: "FPT University HCM", status: "Idle", initials: "MP" },
  { name: "An Lê", role: "Frontend / Web Dev", uni: "FPT University HCM", status: "Offline", initials: "AL" },
];

export const MOCK_MENTOR: Mentor = {
  name: "Nguyễn Văn An",
  position: "Senior AI Architect",
  org: "FPT Software AI Lab",
  expertise: ["Computer Vision", "LLMs in Education", "System Design"],
  bio: "Anh An có hơn 10 năm kinh nghiệm nghiên cứu và phát triển các sản phẩm trí tuệ nhân tạo quy mô lớn tại FPT. Anh đã trực tiếp hướng dẫn hơn 20 đội thi đạt giải cao tại các kỳ Hackathon.",
  assignedTeams: "4 đội",
  slots: "Thứ 3 (14:00 - 17:00) · Thứ 5 (09:00 - 11:30)",
  nextAppointment: "Thứ 3, 30/06 lúc 14:00",
  rating: 4.9,
};

export const COMPETITIONS: Event[] = [
  {
    id: 1,
    name: "SEAL Summer 2026",
    season: "Summer 2026",
    date: "15/06/2026 - 15/07/2026",
    location: "FPT University HCM campus & Online",
    status: "Active",
    currentRound: "Round 1 · Prototype",
    myTeam: "Team Phoenix",
    track: "AI for Education",
    theme: "Ứng dụng Trí tuệ Nhân tạo giải quyết các thách thức trong giáo dục hiện đại.",
    rules: [
      "Mỗi đội thi gồm từ 3-5 thành viên là sinh viên.",
      "Tất cả sản phẩm phải được code trong thời gian diễn ra cuộc thi.",
      "Không được sử dụng mã nguồn đã hoàn thiện trước đó.",
      "Nộp bài đúng hạn qua nền tảng SEAL Web. Bài nộp muộn sẽ bị loại.",
    ],
    criteria: [
      { criterion: "Tính sáng tạo & Đổi mới", weight: "25%", desc: "Ý tưởng có sự độc đáo, giải pháp mới lạ so với các phương pháp hiện tại." },
      { criterion: "Khả năng kỹ thuật", weight: "35%", desc: "Kiến trúc hệ thống, chất lượng code, độ hoàn thiện của prototype và tích hợp AI." },
      { criterion: "Giá trị thực tiễn", weight: "25%", desc: "Khả năng ứng dụng thực tế, giải quyết nỗi đau của học sinh/giáo viên." },
      { criterion: "Pitching & Thuyết trình", weight: "15%", desc: "Kỹ năng thuyết trình, slide rõ ràng và trả lời câu hỏi của ban giám khảo." },
    ],
    faq: [
      { q: "Tôi có thể nộp bài trên Mobile không?", a: "Không, ứng dụng di động chỉ hỗ trợ theo dõi thông tin, tiến độ, nhận xét của giám khảo và check-in. Bạn phải nộp bài trên ứng dụng SEAL Web." },
      { q: "Làm thế nào để liên hệ ban tổ chức khi gặp lỗi kỹ thuật?", a: "Bạn có thể vào tab Cá nhân -> Báo cáo sự cố hoặc liên hệ Hotline BTC: 0901 234 567." },
    ],
    handbookUrl: "https://seal.fpt.edu.vn/handbook-2026.pdf",
    contact: "seal.hcm@fpt.edu.vn",
  },
  {
    id: 2,
    name: "SEAL Winter 2025",
    season: "Winter 2025",
    date: "10/11/2025 - 15/12/2025",
    location: "FPT University HN campus",
    status: "Ended",
    currentRound: "Vòng Chung Kết",
    myTeam: "Team Phoenix",
    track: "Green Tech",
    theme: "Công nghệ xanh bảo vệ môi trường bền vững.",
    rules: [],
    criteria: [],
    faq: [],
    handbookUrl: "",
    contact: "",
  },
  {
    id: 3,
    name: "FPT CodeWar 2025",
    season: "Spring 2025",
    date: "05/03/2025 - 20/03/2025",
    location: "Online",
    status: "Ended",
    currentRound: "Vòng Chung Kết",
    myTeam: "Team Phoenix",
    track: "Algorithms",
    theme: "Giải quyết các bài toán thuật toán tối ưu hóa.",
    rules: [],
    criteria: [],
    faq: [],
    handbookUrl: "",
    contact: "",
  },
];

export const CURRENT_ROUND = {
  label: "VÒNG THI HIỆN TẠI",
  name: "Round 1 · Prototype",
  status: "Đang diễn ra",
  timeLeft: "Còn 2 ngày 4 giờ",
  progress: 0.65,
  submissionStatus: "Đã nộp bài", // 'Đã nộp bài' or 'Chưa nộp bài'
  submissionTime: "26/06/2026 · 18:30",
};

export const ANNOUNCEMENTS: Announcement[] = [
  {
    id: 1,
    title: "Phòng pitching chung kết đã thay đổi",
    body: "Lịch trình pitching chiều nay của bảng AI for Education sẽ chuyển từ Phòng A202 sang Phòng B204 (Tầng 2, Toà nhà Gamma). Vui lòng có mặt trước 15 phút.",
    time: "15 phút trước",
    type: "warning",
    unread: true,
  },
  {
    id: 2,
    title: "Mentor Nguyễn Văn An xác nhận cuộc hẹn",
    body: "Yêu cầu đặt lịch hướng dẫn kỹ thuật của đội bạn vào lúc 14:00 ngày mai đã được mentor xác nhận.",
    time: "2 giờ trước",
    type: "success",
    unread: true,
  },
  {
    id: 3,
    title: "Nhắc nhở: Hạn nộp bài Round 1 còn 2 ngày",
    body: "Hệ thống nộp bài SEAL Web sẽ đóng cổng đúng vào lúc 23:59 ngày 29/06. Vui lòng kiểm tra kỹ mã nguồn và triển khai ứng dụng.",
    time: "1 ngày trước",
    type: "info",
    unread: false,
  },
];

export const TIMELINE_ACTIVITIES: Activity[] = [
  // HÔM NAY (DAY 1)
  {
    id: 1,
    time: "09:00 - 11:30",
    title: "Lễ Khai Mạc & Phổ Biến Luật Thi",
    type: "General",
    location: "Hội trường Gamma",
    countdownText: "Đã kết thúc",
    isMyTeam: false,
    status: "ended",
    description: "Lễ khai mạc chính thức SEAL Summer 2026, giới thiệu ban giám khảo và thể lệ chi tiết các vòng thi.",
  },
  {
    id: 2,
    time: "14:00 - 14:45",
    title: "Technical Workshop: Tích hợp LLM",
    type: "Workshop",
    location: "Online (Google Meet)",
    countdownText: "Bắt đầu sau 45 phút",
    isMyTeam: false,
    status: "upcoming",
    meetingUrl: "https://meet.google.com/abc-defg-hij",
    description: "Hướng dẫn cài đặt, gọi API và tối ưu hóa chi phí khi tích hợp mô hình ngôn ngữ lớn (LLM) vào các sản phẩm giáo dục.",
  },
  {
    id: 3,
    time: "15:30 - 16:30",
    title: "Gặp gỡ Mentor Nguyễn Văn An",
    type: "Mentoring",
    location: "Khu vực Mentor · Bàn số 4",
    countdownText: "Bắp đầu sau 2 giờ",
    mentorName: "Nguyễn Văn An",
    isMyTeam: true,
    status: "upcoming",
    description: "Buổi duyệt thiết kế hệ thống và định hướng thuật toán phân tích bài tập học sinh cùng Mentor của đội.",
  },
  // NGÀY 2 (DAY 2)
  {
    id: 4,
    time: "09:00 - 11:00",
    title: "Workshop: UI/UX & Kể câu chuyện sản phẩm",
    type: "Workshop",
    location: "Phòng Seminar Beta",
    countdownText: "Ngày mai",
    isMyTeam: false,
    status: "upcoming",
    description: "Phương pháp thiết kế trải nghiệm người dùng tối giản cho ứng dụng mobile/web và cách trình bày slide thuyết phục.",
  },
  {
    id: 5,
    time: "14:30 - 15:30",
    title: "Team Phoenix Pitching thử nghiệm",
    type: "Pitching",
    location: "Phòng B204",
    countdownText: "Ngày mai",
    isMyTeam: true,
    status: "upcoming",
    order: "Thứ tự trình bày: 05",
    description: "Thử nghiệm thuyết trình sản phẩm trước hội đồng mentor để nhận góp ý chỉnh sửa trước khi nộp bài chính thức.",
  },
  // NGÀY 3 (DAY 3)
  {
    id: 6,
    time: "23:59",
    title: "Hạn Nộp Bài Round 1 · Prototype",
    type: "Deadline",
    location: "SEAL Web Portal",
    countdownText: "Trong 2 ngày",
    isMyTeam: true,
    status: "upcoming",
    description: "Đóng cổng nhận bài nộp trên hệ thống SEAL Web. Đội thi phải submit mã nguồn GitHub và video demo dài tối đa 3 phút.",
  },
];

export const JUDGE_RESULTS: JudgeFeedback[] = [
  { criterion: "Tính sáng tạo & Đổi mới", score: 8.5, maxScore: 10, comment: "Ý tưởng trợ lý học tập cá nhân hóa rất thực tế, cách tiếp cận tốt." },
  { criterion: "Khả năng kỹ thuật", score: 9.0, maxScore: 10, comment: "Kiến trúc sạch sẽ, tích hợp AI mượt mà và tối ưu hóa API tốt. Cần lưu ý bảo mật dữ liệu học sinh." },
  { criterion: "Giá trị thực tiễn", score: 8.0, maxScore: 10, comment: "Giải pháp giải quyết được vấn đề thực tế, tuy nhiên cần làm rõ mô hình kinh doanh hoặc tính bền vững." },
  { criterion: "Thuyết trình & Pitching", score: 8.5, maxScore: 10, comment: "Slide đẹp, trình bày tự tin. Trả lời câu hỏi phản biện trực diện và có dẫn chứng số liệu tốt." },
];

export const GENERAL_STATS = {
  totalTeams: 280,
  currentRank: 12,
  qualifiedCount: 16,
};
