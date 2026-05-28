// Admin Dashboard Mock Data
// Centralized data for the Admin Overview SPA

const getPastDate = (minutesAgo) => new Date(Date.now() - minutesAgo * 60000).toISOString();

export const ADMIN_USERS = [
  { id: '1', name: 'Alex Rivera', email: 'alex.rivera@university.edu', role: 'Admin', status: 'Active', joined: '2024-01-15', avatar: null },
  { id: '2', name: 'Minh Trần', email: 'minh.tran@student.edu.vn', role: 'Tutor', status: 'Active', joined: '2024-03-22', avatar: null },
  { id: '3', name: 'Sarah Lê', email: 'sarah.le@student.edu.vn', role: 'Student', status: 'Active', joined: '2024-05-10', avatar: null },
  { id: '4', name: 'Kevin Vũ', email: 'kevin.vu@student.edu.vn', role: 'Student', status: 'Pending', joined: '2024-06-01', avatar: null },
  { id: '5', name: 'Linh Nguyễn', email: 'linh.nguyen@student.edu.vn', role: 'Student', status: 'Active', joined: '2024-07-14', avatar: null },
  { id: '6', name: 'Đức Phạm', email: 'duc.pham@student.edu.vn', role: 'Tutor', status: 'Suspended', joined: '2024-02-28', avatar: null },
  { id: '7', name: 'Hà Trương', email: 'ha.truong@student.edu.vn', role: 'Student', status: 'Active', joined: '2024-08-03', avatar: null },
  { id: '8', name: 'Bảo Hoàng', email: 'bao.hoang@student.edu.vn', role: 'Student', status: 'Active', joined: '2024-09-11', avatar: null },
];

export const ADMIN_DOCS = [
  { id: 'doc1', name: 'Giáo trình Machine Learning Nâng Cao.pdf', category: 'Giáo trình', owner: 'Alex Rivera', size: '24.5 MB', uploadedAt: getPastDate(120), status: 'Approved' },
  { id: 'doc2', name: 'Bài tập Xác suất Thống kê - Chương 5.docx', category: 'Bài tập', owner: 'Minh Trần', size: '3.2 MB', uploadedAt: getPastDate(300), status: 'Approved' },
  { id: 'doc3', name: 'Slide Kiến Trúc Máy Tính.pptx', category: 'Slide bài giảng', owner: 'Sarah Lê', size: '18.7 MB', uploadedAt: getPastDate(1440), status: 'Approved' },
  { id: 'doc4', name: 'Đề thi thử Lập Trình Web - HK2.pdf', category: 'Bài tập', owner: 'Kevin Vũ', size: '1.8 MB', uploadedAt: getPastDate(2880), status: 'Pending' },
  { id: 'doc5', name: 'Tài liệu Hệ Điều Hành Linux.pdf', category: 'Giáo trình', owner: 'Linh Nguyễn', size: '45.0 MB', uploadedAt: getPastDate(4320), status: 'Approved' },
];

export const ACTIVITY_DATA = [
  { day: 'T2', queries: 4200 },
  { day: 'T3', queries: 5800 },
  { day: 'T4', queries: 3900 },
  { day: 'T5', queries: 7100 },
  { day: 'T6', queries: 6300 },
  { day: 'T7', queries: 8500 },
  { day: 'CN', queries: 5200 },
];

export const SYSTEM_LOGS_INITIAL = [
  { time: getPastDate(1), level: 'INFO', message: '[AUTH] User sarah.le@student.edu.vn logged in successfully' },
  { time: getPastDate(3), level: 'INFO', message: '[UPLOAD] File "ML_Chapter5.pdf" uploaded by minh.tran (3.2MB)' },
  { time: getPastDate(5), level: 'WARN', message: '[QUOTA] User kevin.vu storage at 89% capacity' },
  { time: getPastDate(8), level: 'INFO', message: '[AI] Gemini API request processed in 245ms' },
  { time: getPastDate(12), level: 'ERROR', message: '[API] Rate limit exceeded for endpoint /api/v1/summarize' },
  { time: getPastDate(15), level: 'INFO', message: '[SYSTEM] Nightly backup completed successfully' },
  { time: getPastDate(20), level: 'INFO', message: '[AUTH] Admin alex.rivera@university.edu session started' },
  { time: getPastDate(30), level: 'WARN', message: '[SECURITY] Failed login attempt from IP 103.45.67.89' },
];

export const GEMINI_SAMPLE_QUESTIONS = [
  'Tóm tắt nội dung chương 1 của tài liệu Machine Learning',
  'So sánh thuật toán KNN và SVM trong phân loại dữ liệu',
  'Giải thích khái niệm Backpropagation trong Neural Network',
  'Liệt kê 5 ứng dụng thực tế của NLP trong giáo dục',
];
