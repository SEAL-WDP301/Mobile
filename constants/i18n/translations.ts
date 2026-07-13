export type Locale = "vi" | "en";

export const translations = {
  vi: {
    profile: {
      title: "Cá nhân",
      subtitle: "Quản lý tài khoản và thiết lập",
      personalInfo: "Thông tin cá nhân & Kỹ năng",
      portfolio: "Portfolio, GitHub & LinkedIn",
      language: "Ngôn ngữ",
      languageVi: "Tiếng Việt",
      languageEn: "English",
      legal: "Điều khoản & Chính sách bảo mật",
      save: "Lưu thay đổi",
      saved: "Đã lưu thành công",
      fullName: "Họ và tên",
      email: "Email",
      studentType: "Loại sinh viên",
      studentTypeFpt: "Sinh viên FPT",
      studentTypeExternal: "Sinh viên ngoài trường",
      studentCode: "Mã sinh viên",
      university: "Trường / Đại học",
      phone: "Số điện thoại",
      skills: "Kỹ năng",
      skillsHint: "Nhập kỹ năng, cách nhau bởi dấu phẩy",
      portfolioUrl: "Portfolio URL",
      githubUrl: "GitHub URL",
      linkedinUrl: "LinkedIn URL",
      readOnly: "Chỉ đọc",
      portfolioHint: "Nhập đường link portfolio, GitHub và LinkedIn của bạn.",
      termsTitle: "Điều khoản sử dụng",
      privacyTitle: "Chính sách bảo mật",
    },
    legal: {
      terms: `SEAL Mobile là ứng dụng hỗ trợ người tham gia theo dõi thông tin cuộc thi, lịch trình, đội nhóm, mentor, thông báo, trạng thái bài nộp và kết quả.

Người dùng cần cung cấp thông tin chính xác khi đăng ký và sử dụng ứng dụng. Mọi hành vi giả mạo thông tin, sử dụng tài khoản của người khác, gây rối hệ thống hoặc vi phạm quy định cuộc thi đều có thể dẫn đến việc hạn chế quyền truy cập.

Ứng dụng mobile chỉ dùng để theo dõi thông tin. Các thao tác quan trọng như nộp bài, chỉnh sửa bài dự thi hoặc quản lý đội nâng cao sẽ được thực hiện trên SEAL Web.

Ban tổ chức có quyền cập nhật lịch trình, quy định, địa điểm, thông báo và kết quả trong suốt quá trình diễn ra cuộc thi.`,
      privacy: `SEAL Mobile thu thập một số thông tin cần thiết để phục vụ quá trình tham gia cuộc thi, bao gồm họ tên, email, mã sinh viên, thông tin đội, lịch tham gia, trạng thái check-in và kết quả cuộc thi.

Thông tin người dùng chỉ được sử dụng cho mục đích quản lý cuộc thi, xác thực người tham gia, gửi thông báo, hỗ trợ mentor, check-in và công bố kết quả.

SEAL không chia sẻ thông tin cá nhân của người dùng cho bên thứ ba nếu không có sự đồng ý, trừ khi cần thiết theo yêu cầu của nhà trường, ban tổ chức hoặc quy định pháp luật.

Người dùng có trách nhiệm bảo mật tài khoản của mình và không chia sẻ thông tin đăng nhập cho người khác.`,
    },
  },
  en: {
    profile: {
      title: "Profile",
      subtitle: "Manage account and settings",
      personalInfo: "Personal info & Skills",
      portfolio: "Portfolio, GitHub & LinkedIn",
      language: "Language",
      languageVi: "Tiếng Việt",
      languageEn: "English",
      legal: "Terms & Privacy Policy",
      save: "Save changes",
      saved: "Saved successfully",
      fullName: "Full name",
      email: "Email",
      studentType: "Student type",
      studentTypeFpt: "FPT student",
      studentTypeExternal: "External student",
      studentCode: "Student ID",
      university: "University",
      phone: "Phone number",
      skills: "Skills",
      skillsHint: "Enter skills separated by commas",
      portfolioUrl: "Portfolio URL",
      githubUrl: "GitHub URL",
      linkedinUrl: "LinkedIn URL",
      readOnly: "Read only",
      portfolioHint: "Enter your portfolio, GitHub, and LinkedIn profile URLs.",
      termsTitle: "Terms of use",
      privacyTitle: "Privacy policy",
    },
    legal: {
      terms: `SEAL Mobile helps participants track competition info, schedules, teams, mentors, notifications, submission status, and results.

You must provide accurate information when registering and using the app. Impersonation, account misuse, system abuse, or rule violations may result in restricted access.

The mobile app is for tracking only. Important actions such as submissions, editing entries, or advanced team management must be done on SEAL Web.

Organizers may update schedules, rules, venues, announcements, and results throughout the competition.`,
      privacy: `SEAL Mobile collects information needed for the competition, including name, email, student ID, team info, schedule, check-in status, and results.

Your data is used only for competition management, participant verification, notifications, mentor support, check-in, and publishing results.

SEAL does not share personal data with third parties without consent, except when required by the university, organizers, or law.

You are responsible for keeping your account credentials secure.`,
    },
  },
} as const;

export type TranslationKeys = typeof translations.vi;
