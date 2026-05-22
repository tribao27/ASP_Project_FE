/**
 * Initial community groups dataset for AI Study Hub.
 */
export const initialGroups = [
  {
    id: 'grp_neural',
    name: 'Neural Architecture Design',
    category: 'Computer Science',
    subject: 'KHOA HỌC MÁY TÍNH',
    description: 'Nhóm chuyên sâu thảo luận về cấu trúc khối chập nơ-ron, Transformers cơ bản và các định luật biến tỉ lệ thu nhỏ tri thức thông minh lớn ngày nay.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCtXKUtHv1z2ZBVa-eWgWZ_mncL8OEQ8CkDhBLuDOYHpC0dqYCloXwxtCln5Jd8QBpFfx_DHTLjwQLT2ojzYRgilemmkSZ1QnaXpMpOfKfJ25RoFRYEJKCMpr_qdH9MSYXl6ri0BH5RRiO8BPcM5bZmkJdLAHlP4-vgrLsE2DGlE8SJMpheCwU-QLKD5_ul58e6nIifl_CB7fN8_eFTin3vdWR2an7vkfUN0TbSXcvso4SnnmkA5x3fP6Vn5Fggn2Bu2inOvUXuR_4',
    owner: 'admin@aihub.edu',
    members: [
      { email: 'admin@aihub.edu', role: 'leader', joinedAt: '2026-05-01' },
      { email: 'vuongbaovipvip@gmail.com', role: 'member', joinedAt: '2026-05-15' },
      { email: 'student1@aihub.edu', role: 'member', joinedAt: '2026-05-16' }
    ],
    pendingRequests: ['alex.nguyen@example.com'],
    documents: [
      { id: 'gdoc_1', name: 'Transformers_Architecture.pdf', type: 'PDF', size: 12.5, uploader: 'admin@aihub.edu', date: '2026-05-10', storageUsed: 12.5 },
      { id: 'gdoc_2', name: 'CNN_Basics.docx', type: 'DOCX', size: 5.2, uploader: 'vuongbaovipvip@gmail.com', date: '2026-05-16', storageUsed: 5.2 }
    ],
    isTopRated: true,
  },
  {
    id: 'grp_ml',
    name: 'Machine Learning Forum',
    category: 'Computer Science',
    subject: 'KHOA HỌC MÁY TÍNH',
    description: 'Nơi kết nối sinh viên trao đổi giải thuật máy học, mô hình hóa dữ liệu ứng dụng, các đề tài kiểm toán và phân loại hồi quy tuyến tính.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBL__MaLnrRAoDtqpn7wHLeaS8IImZk1gvQ0fjuS4DVj1-9iBZwranDAecMvtIzjrou36PWOLLAhSBnK75kmayhTT4gLBS4kD_wwRxTP-6mU0xzjVuprU34I_Oukn217eqsIPN22rQ6s2ITGl9YEtUMfRtpGT1dQqohK2hjUsGLjEe88uraah_rDHbrgZPHir_4W-B3Vj2nRG2wm7oPDyeiTmDpvbjaHrIaaEi8G1-qYlZtWzAKDrGxdrIpze8XDFL5jXrJsx5_kwE',
    owner: 'vuongbaovipvip@gmail.com',
    members: [
      { email: 'vuongbaovipvip@gmail.com', role: 'leader', joinedAt: '2026-05-10' },
      { email: 'sarah.lee@example.com', role: 'member', joinedAt: '2026-05-12' }
    ],
    pendingRequests: ['newbie@example.com'],
    documents: [
      { id: 'gdoc_3', name: 'Regression_Models.xlsx', type: 'XLSX', size: 2.1, uploader: 'vuongbaovipvip@gmail.com', date: '2026-05-14', storageUsed: 2.1 }
    ],
  },
  {
    id: 'grp_history',
    name: 'Modern History Scholars',
    category: 'Humanities',
    subject: 'LỊCH SỬ THẾ GIỚI',
    description: 'Thảo luận về các sự kiện chính trị trong thế kỷ 20, phân tích tài liệu đánh dấu cột mốc văn minh và các phương sách đối ngoại đa chiều.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBzuHBfyEulLDS7NLAlBTQ9ZA581bUaL5q3BbCF5DO-0k1tjHMxj_117W-uFLEiixZeakU2ofejHCdxwnZxRCFP0cJKNHMQjwJvHmMX4JcEqpBOnYEbbWiFLRY2zg2urcYF7O3eOPSVX3eWtcx_eqJS1OSQ49IsPcHEMbdnjp0iGVjj3-ZXTZTERlKX2zK2IgUbXSpRIrGrXhxZRTHZaJAJBNY1_OR0WCzKCRQZ7Uu1f2vdluyMXCqCdt1Hcezg1XgkRQTSYQLkn00',
    owner: 'prof.smith@university.edu',
    members: [
      { email: 'prof.smith@university.edu', role: 'leader', joinedAt: '2026-01-10' }
    ],
    pendingRequests: [],
    documents: [],
  },
  {
    id: 'grp_economics',
    name: 'Applied Economics Club',
    category: 'Economics',
    subject: 'KINH TẾ VĨ MÔ',
    description: 'Chia sẻ giáo trình kinh tế vĩ mô, phân tích mô hình tài chính doanh nghiệp lượng hóa các chỉ số lạm phát tỉ giá hối đoái hữu ích.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD6krzE3AtQi2sFzAnMWe_v_gJkvOoAufK5AkQ69KjZI93tVt2LtsC93gUnckTVBraoUOYKPDKW9YbEGl9LNFBhvXipCNRpTQYNKMwT0DOO8xR_VsG6WrEaLGq06eps26JTFqDaAOOFQjVbnuSJJa7UpUla635EHAKt8kxSOQl2xnbZktmSSevaK_eTWN1vbwhnWXlfhr84X31G0mL8sFryb_xi3vO8KMzRWuYArStJV8sEEv8TnNYZHrB_mwPr62QpuA2eFiiLU-Y',
    owner: 'alex.nguyen@example.com',
    members: [
      { email: 'alex.nguyen@example.com', role: 'leader', joinedAt: '2026-02-15' },
      { email: 'vuongbaovipvip@gmail.com', role: 'member', joinedAt: '2026-03-01' }
    ],
    pendingRequests: [],
    documents: [
      { id: 'gdoc_4', name: 'Macroeconomics_Ch1.pdf', type: 'PDF', size: 8.5, uploader: 'alex.nguyen@example.com', date: '2026-03-05', storageUsed: 8.5 }
    ],
  },
];

