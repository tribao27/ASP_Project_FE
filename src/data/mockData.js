// Thư viện Mock Data tập trung cho toàn dự án
// Sử dụng chuẩn thời gian ISO 8601 để tương thích với Backend

// Lấy thời điểm hiện tại trừ đi số phút để mô phỏng dữ liệu "Mới đây"
const getPastDate = (minutesAgo) => new Date(Date.now() - minutesAgo * 60000).toISOString();

export const MOCK_USERS = [
  { id: '1', mssv: 'ADMIN', email: 'admin@admin.com', name: 'System Admin', role: 'admin', status: 'active', joined: '2023-01-01T08:00:00Z', cloudUsed: 120, cloudLimit: 5000 },
  { id: '2', mssv: 'SV001', email: 'vuongbaovipvip@gmail.com', name: 'Vương Bảo', role: 'user', status: 'active', joined: '2023-05-15T09:30:00Z', cloudUsed: 850, cloudLimit: 1000 },
  { id: '3', mssv: 'SV002', email: 'alex.nguyen@university.edu.vn', name: 'Alex Nguyen', role: 'user', status: 'active', joined: '2023-06-20T14:15:00Z', cloudUsed: 980, cloudLimit: 1000 },
  { id: '4', mssv: 'SV003', email: 'student01@abc.edu.vn', name: 'Học Viên 01', role: 'user', status: 'banned', joined: '2023-08-01T10:45:00Z', cloudUsed: 45, cloudLimit: 1000 },
];

export const MOCK_SYSTEM_DOCS = [
  { id: 'd1', name: 'Giáo trình Triết học.pdf', format: 'pdf', subject: 'Triết học', owner: 'vuongbaovipvip@gmail.com', ownerName: 'Vương Bảo', size: '15 MB', uploadedAt: '2023-10-12T08:30:00Z' },
  { id: 'd2', name: 'Dataset AI.csv', format: 'csv', subject: 'Trí tuệ nhân tạo', owner: 'alex.nguyen@university.edu.vn', ownerName: 'Alex Nguyen', size: '200 MB', uploadedAt: '2023-10-13T14:15:00Z' },
  { id: 'd3', name: 'Slide Kỹ Thuật Lập Trình.pptx', format: 'pptx', subject: 'Kỹ Thuật Lập Trình', owner: 'vuongbaovipvip@gmail.com', ownerName: 'Vương Bảo', size: '5 MB', uploadedAt: '2023-10-14T09:00:00Z' },
  { id: 'd4', name: 'Đề thi thử Lịch Sử Đảng.docx', format: 'docx', subject: 'Lịch sử Đảng', owner: 'student01@abc.edu.vn', ownerName: 'Học Viên 01', size: '2 MB', uploadedAt: '2023-10-15T11:20:00Z' },
];

export const MOCK_LOGS = [
  { action: 'AI Chatbot', user: 'Alex Nguyen', detail: 'Chat hỏi đáp về Dataset AI', time: getPastDate(5), icon: 'bi-robot', color: 'purple' },
  { action: 'Cloud Upload', user: 'Vương Bảo', detail: 'Tải lên Bài tập lớn.zip (50MB)', time: getPastDate(12), icon: 'bi-cloud-arrow-up', color: 'blue' },
  { action: 'Authentication', user: 'Học Viên 01', detail: 'Đăng nhập thất bại (Tài khoản bị khóa)', time: getPastDate(60), icon: 'bi-shield-lock', color: 'red' },
  { action: 'Admin Action', user: 'System Admin', detail: 'Nâng cấp dung lượng cho Vương Bảo lên 5GB', time: getPastDate(120), icon: 'bi-hdd-network', color: 'orange' },
];

export const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    title: 'Phân tích tài liệu hoàn tất',
    desc: 'AI đã hoàn thành phân tích "Giáo trình Triết học.pdf"',
    time: getPastDate(5),
    icon: 'bi-robot',
    color: 'text-purple-500',
    bg: 'bg-purple-500/10'
  },
  {
    id: 2,
    title: 'Hệ thống cập nhật',
    desc: 'Bảo trì máy chủ dự kiến vào 00:00 đêm nay.',
    time: getPastDate(120),
    icon: 'bi-shield-exclamation',
    color: 'text-[#ff5c00]',
    bg: 'bg-[#ff5c00]/10'
  }
];

export const OLDER_NOTIFICATIONS = [
  {
    id: 4,
    title: 'Trợ lý AI đã tóm tắt xong 50 trang tài liệu "Triết học Mác-Lênin"',
    time: getPastDate(2880), // 2 days ago
    isRead: true,
    icon: 'bi-file-earmark-text text-[#007aff]',
    bg: 'bg-[#007aff]/10'
  },
  {
    id: 5,
    title: 'Nhóm "Đồ án Tốt nghiệp" vừa tải lên 3 tài liệu mới',
    time: getPastDate(4320), // 3 days ago
    isRead: true,
    icon: 'bi-cloud-arrow-up text-[#ff5c00]',
    bg: 'bg-[#ff5c00]/10'
  },
  {
    id: 6,
    title: 'Dung lượng lưu trữ của bạn sắp đầy (Đã dùng 95%)',
    time: getPastDate(5760), // 4 days ago
    isRead: true,
    icon: 'bi-exclamation-triangle text-[#ff3b30]',
    bg: 'bg-[#ff3b30]/10'
  },
  {
    id: 7,
    title: 'Bạn đã đạt mốc 10.000 điểm cống hiến cộng đồng!',
    time: getPastDate(10080), // 1 week ago
    isRead: true,
    icon: 'bi-trophy text-[#ffd60a]',
    bg: 'bg-[#ffd60a]/10'
  }
];
