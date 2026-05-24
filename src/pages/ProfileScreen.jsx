/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Button, message, Tooltip, Avatar } from 'antd';
import { motion } from 'framer-motion';

/**
 * Premium ProfileScreen (Cài đặt hệ thống) Redesign.
 * Highly aesthetic Apple-inspired controls, sleek glassmorphic containers,
 * gorgeous physics-based iridescent ID Card, and gamified student streak indicators.
 */
export default function ProfileScreen({
  currentUser,
  documentsCount,
  storagePercentage,
  avatarUrl,
  onAvatarChange,
  accentColor,
  onAccentColorChange,
}) {
  const handleSaveSettings = () => {
    message.success('Đã đồng bộ cập nhật tài khoản sinh viên thành công!');
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        message.error('Kích thước ảnh đại diện không vượt quá 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        onAvatarChange(reader.result);
        message.success('Cập nhật ảnh đại diện mới thành công!');
      };
      reader.readAsDataURL(file);
    }
  };

  const colorOptions = [
    { name: 'Cam thương hiệu', value: '#ff5c00', glowClass: 'bg-[#ff5c00]' },
    { name: 'Tím tinh tú', value: '#a855f7', glowClass: 'bg-[#a855f7]' },
    { name: 'Xanh Electric', value: '#007aff', glowClass: 'bg-[#007aff]' },
    { name: 'Xanh Apple', value: '#34c759', glowClass: 'bg-[#34c759]' },
  ];

  return (
    <div className="flex-1 w-full h-full overflow-y-auto px-3 sm:px-4 md:px-8 pb-10 pt-3 sm:pt-4 text-left select-none relative bg-transparent">
      <div>
        
        {/* Title Block */}
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-[#1d1d1f]">Cấu hình hệ thống</h2>
            <p className="text-[11px] sm:text-xs text-black/40 mt-0.5 font-semibold">
              Tùy chỉnh định danh số học thuật, thay đổi màu chủ đạo và thiết lập ảnh đại diện
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-stretch">
          
          {/* Left Column: Premium ID & Avatar (lg:col-span-5) */}
          <div className="lg:col-span-5 flex flex-col gap-4 sm:gap-6 justify-start">
            
            {/* Avatar Uploader Glass Panel */}
            <div className="bg-white rounded-3xl border border-black/[0.04] p-5.5 shadow-sm text-left">
              <span className="text-[10px] font-black text-black/35 uppercase tracking-widest block mb-4">Cập nhật ảnh đại diện</span>
              
              <div className="flex items-center gap-4.5">
                {/* Rounded Interactive Avatar Card */}
                <div className="relative group cursor-pointer w-22 h-22 rounded-2xl overflow-hidden border border-black/10 shadow-md flex-shrink-0 bg-[#f5f5f7]">
                  <img
                    alt="Avatar"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    src={avatarUrl}
                  />
                  <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white text-[10px] font-extrabold transition-opacity duration-300 cursor-pointer">
                    <i className="bi bi-camera-fill text-[16px] mb-1 animate-bounce" />
                    <span>Thay ảnh</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="text-left space-y-1.5 flex-1">
                  <h4 className="text-[13.5px] font-extrabold text-[#1d1d1f]">Ảnh hồ sơ của bạn</h4>
                  <p className="text-[11px] text-black/40 font-semibold leading-relaxed">
                    Hỗ trợ định dạng JPG, PNG, GIF dưới 2MB. Ảnh sẽ được tự động đồng bộ trên toàn bộ thanh công cụ học tập.
                  </p>
                  
                  <div className="flex gap-2 pt-1">
                    <label className="inline-flex items-center gap-1.5 text-[10.5px] font-bold text-[#ff5c00] hover:text-[#ff8a00] cursor-pointer bg-[#ff5c00]/8 border border-[#ff5c00]/15 rounded-full px-3 py-1 transition-colors duration-250">
                      <i className="bi bi-upload" /> Tải ảnh lên
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Apple Wallet-like 3D Reflective Student ID Card */}
            <div className="space-y-3.5">
              <span className="text-[10px] font-black text-black/35 uppercase tracking-widest block">Thẻ định danh số học thuật</span>

              <motion.div
                whileHover={{ rotateY: 8, rotateX: -6, scale: 1.015, y: -2 }}
                transition={{ type: 'spring', stiffness: 350, damping: 18 }}
                className="w-full aspect-[1.58/1] bg-gradient-to-br from-[#1c1c1e] via-[#0c0c0d] to-[#010102] rounded-[24px] border border-white/[0.06] p-5.5 shadow-2xl relative overflow-hidden group select-none flex flex-col justify-between"
                style={{ perspective: 1200 }}
              >
                {/* Iridescent gloss gradients */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-[#ff5c00]/10 rounded-full blur-3xl pointer-events-none group-hover:bg-[#ff5c00]/15 transition-colors duration-500" />
                <div className="absolute bottom-0 left-0 w-28 h-28 bg-[#007aff]/5 rounded-full blur-2xl pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/[0.02] to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[11.5px] font-black text-[#ff5c00] tracking-wider uppercase block">AI STUDY HUB</span>
                    <span className="text-[7.5px] font-bold text-white/35 tracking-widest uppercase block mt-0.5">STUDENT IDENTITY CARD</span>
                  </div>
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-white/20 shadow-md">
                    <img
                      src={avatarUrl}
                      alt="Mini Avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <div className="space-y-3 text-left">
                  <div>
                    <span className="text-[8px] font-bold text-white/25 uppercase tracking-widest block">Họ và Tên</span>
                    <span className="text-[15px] font-extrabold text-white tracking-tight">Alex Nguyen</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-[8px] font-bold text-white/25 uppercase tracking-widest block">Lớp học phần</span>
                      <span className="text-[11.5px] font-extrabold text-white/85">CNTT-K22.A</span>
                    </div>
                    <div>
                      <span className="text-[8px] font-bold text-white/25 uppercase tracking-widest block">Mã số sinh viên</span>
                      <span className="text-[11.5px] font-extrabold text-white/85 font-mono">B22DCCN123</span>
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-5.5 right-5.5 px-3 py-0.5 rounded-full bg-[#ff5c00]/10 border border-[#ff5c00]/25 text-[7.5px] font-black text-[#ff5c00] uppercase tracking-widest">
                  Pro Student
                </div>
              </motion.div>
            </div>

            {/* Accent Theme Color Picker */}
            <div className="bg-white rounded-3xl border border-black/[0.04] p-5.5 shadow-sm text-left space-y-3.5">
              <div>
                <span className="text-[10px] font-black text-black/35 uppercase tracking-widest block">Tùy chọn màu sắc chủ đạo</span>
                <p className="text-[11px] text-black/40 font-semibold mt-1 leading-relaxed">
                  Thay đổi hệ màu thương hiệu để đồng bộ tức thì lên tất cả các thanh trạng thái, nút bấm và dải màu hệ thống
                </p>
              </div>

              <div className="flex gap-3.5">
                {colorOptions.map((opt) => {
                  const isSelected = accentColor === opt.value;
                  return (
                    <Tooltip key={opt.value} title={opt.name}>
                      <button
                        onClick={() => {
                          onAccentColorChange(opt.value);
                          message.success(`Đã đồng bộ màu chủ đạo sang "${opt.name}"!`);
                        }}
                        className={`w-9 h-9 rounded-full ${opt.glowClass} border-[3px] transition-all duration-300 cursor-pointer relative flex items-center justify-center ${
                          isSelected ? 'border-black scale-110 shadow-lg shadow-black/10' : 'border-transparent hover:scale-105'
                        }`}
                      >
                        {isSelected && (
                          <i className="bi bi-check-lg text-white text-[13px] font-bold" />
                        )}
                      </button>
                    </Tooltip>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Right Column: Premium Form inputs & Details (lg:col-span-7) */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-6">
            
            {/* Gamified study streak indicator to make web alive */}
            <div className="bg-gradient-to-r from-[#ff8a00]/4 to-[#ff5c00]/4 rounded-3xl border border-[#ff5c00]/10 p-5.5 text-left relative overflow-hidden flex items-center justify-between gap-6 shadow-sm group">
              <div className="absolute top-0 right-0 w-36 h-36 bg-[#ff5c00]/5 rounded-full blur-3xl pointer-events-none" />
              
              <div className="space-y-1.5 flex-1 pr-4">
                <span className="bg-[#ff5c00]/10 border border-[#ff5c00]/20 text-[#ff5c00] font-black text-[9px] px-2.5 py-0.5 rounded-full uppercase tracking-wider inline-block">
                  Tiến trình học tập tuần này
                </span>
                <h3 className="text-[17px] font-black text-[#1d1d1f] leading-tight tracking-tight">Học tập liên tục 3 ngày 🔥</h3>
                <p className="text-[12px] text-black/50 font-semibold leading-relaxed">
                  Hiệu suất của bạn đang cao hơn **89%** sinh viên cùng khóa học. Hãy liên kết tài liệu với trợ lý AI hàng ngày để duy trì thói quen nhé!
                </p>
              </div>
              
              <motion.div 
                whileHover={{ scale: 1.05, rotate: 5 }}
                className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-[#ff8a00] to-[#ff5c00] flex flex-col items-center justify-center text-white shadow-md orange-glow flex-shrink-0 cursor-pointer"
              >
                <i className="bi bi-fire text-[22px]" />
              </motion.div>
            </div>

            {/* System Config Input Form Container */}
            <div className="bg-white rounded-2xl sm:rounded-3xl border border-black/[0.04] p-5 sm:p-6 md:p-7 shadow-sm text-left space-y-4 sm:space-y-5.5">
              <span className="text-[10px] font-black text-black/35 uppercase tracking-widest block border-b border-black/[0.02] pb-2">
                Thông tin định danh người dùng
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4.5">
                <div className="space-y-1.5 text-left">
                  <label className="text-[9.5px] font-black text-black/40 uppercase tracking-widest block">Họ và Tên</label>
                  <input
                    type="text"
                    defaultValue="Alex Nguyen"
                    className="w-full bg-[#f4f4f7] border border-black/[0.02] focus:border-black/10 focus:bg-white rounded-xl px-4 py-2.5 text-black text-[13px] font-semibold outline-none transition-all shadow-inner"
                  />
                </div>
                <div className="space-y-1.5 text-left">
                  <label className="text-[9.5px] font-black text-black/40 uppercase tracking-widest block">Hòm thư sinh viên</label>
                  <input
                    type="text"
                    defaultValue={currentUser || 'vuongbaovipvip@gmail.com'}
                    disabled
                    className="w-full bg-black/[0.005] border border-black/[0.04] rounded-xl px-4 py-2.5 text-black/35 text-[13px] font-semibold outline-none cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4.5">
                <div className="space-y-1.5 text-left">
                  <label className="text-[9.5px] font-black text-black/40 uppercase tracking-widest block">Mã số sinh viên</label>
                  <input
                    type="text"
                    defaultValue="B22DCCN123"
                    className="w-full bg-[#f4f4f7] border border-black/[0.02] focus:border-black/10 focus:bg-white rounded-xl px-4 py-2.5 text-black text-[13px] font-semibold outline-none transition-all shadow-inner"
                  />
                </div>
                <div className="space-y-1.5 text-left">
                  <label className="text-[9.5px] font-black text-black/40 uppercase tracking-widest block">Học viện liên kết</label>
                  <input
                    type="text"
                    defaultValue="Học viện Công nghệ Bưu chính Viễn thông"
                    className="w-full bg-[#f4f4f7] border border-black/[0.02] focus:border-black/10 focus:bg-white rounded-xl px-4 py-2.5 text-black text-[13px] font-semibold outline-none transition-all shadow-inner"
                  />
                </div>
              </div>

              {/* Dynamic Account Premium Status widget */}
              <div className="space-y-2 pt-2 text-left">
                <label className="text-[9.5px] font-black text-black/40 uppercase tracking-widest block">Hạn mức lưu trữ tài nguyên</label>
                
                <div className="p-4 bg-gradient-to-r from-[#ff8a00]/4 to-[#ff5c00]/4 rounded-2xl border border-[#ff5c00]/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-black text-[#ff5c00] uppercase tracking-wider bg-[#ff5c00]/8 border border-[#ff5c00]/15 rounded-full px-3 py-0.5 inline-block">
                      Gói học thuật Pro Student
                    </span>
                    <p className="text-[12px] text-black/55 font-semibold leading-relaxed">
                      Bạn đang sở hữu giới hạn 50 MB dung lượng lưu trữ tối đa cùng đặc quyền liên kết trợ lý AI phân tích tài liệu không giới hạn tốc độ.
                    </p>
                  </div>
                  
                  <Button 
                    type="primary" 
                    size="small" 
                    className="rounded-xl font-bold text-[11px] h-8 px-4 flex-shrink-0 cursor-pointer shadow-md shadow-orange-500/10"
                  >
                    Gia hạn gói
                  </Button>
                </div>
              </div>

              <div className="pt-5.5 border-t border-black/[0.03] flex justify-end gap-3">
                <Button className="rounded-xl font-extrabold text-[12px] border-black/10 hover:border-black/20 h-9 cursor-pointer">
                  Khôi phục mặc định
                </Button>
                <Button
                  type="primary"
                  onClick={handleSaveSettings}
                  className="rounded-xl font-extrabold text-[12.5px] h-9 cursor-pointer"
                >
                  Đồng bộ cập nhật
                </Button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
