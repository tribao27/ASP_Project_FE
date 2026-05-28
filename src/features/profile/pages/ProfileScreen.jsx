import { useState } from 'react';
import { Button, message, Tooltip } from 'antd';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProfileScreen({
  currentUser,
  documentsCount,
  storagePercentage,
  avatarUrl,
  onAvatarChange,
  accentColor,
  onAccentColorChange,
}) {
  const [isEditingSchool, setIsEditingSchool] = useState(false);
  const [schoolName, setSchoolName] = useState('Học viện Công nghệ Bưu chính Viễn thông');
  const [tempSchoolName, setTempSchoolName] = useState(schoolName);

  const handleSaveSettings = () => {
    message.success('Đã lưu thông tin hồ sơ thành công!');
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        message.error('Kích thước ảnh không vượt quá 2MB.');
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

  const saveSchool = () => {
    if (!tempSchoolName.trim()) {
      message.error('Tên trường học không được để trống.');
      return;
    }
    setSchoolName(tempSchoolName);
    setIsEditingSchool(false);
    message.success('Cập nhật tên trường học thành công!');
  };

  const colorOptions = [
    { name: 'Cam Thương Hiệu', value: '#ff5c00', glowClass: 'bg-[#ff5c00]', bg: 'bg-[#ff5c00]/10', border: 'border-[#ff5c00]/20' },
    { name: 'Tím Tinh Tú', value: '#a855f7', glowClass: 'bg-[#a855f7]', bg: 'bg-[#a855f7]/10', border: 'border-[#a855f7]/20' },
    { name: 'Xanh Electric', value: '#007aff', glowClass: 'bg-[#007aff]', bg: 'bg-[#007aff]/10', border: 'border-[#007aff]/20' },
    { name: 'Xanh Apple', value: '#34c759', glowClass: 'bg-[#34c759]', bg: 'bg-[#34c759]/10', border: 'border-[#34c759]/20' },
  ];

  const currentTheme = colorOptions.find(c => c.value === accentColor) || colorOptions[0];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  const achievements = [
    { icon: 'bi-lightning-charge-fill', label: 'Tốc độ', desc: 'Đăng tải 10 file đầu tiên', color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
    { icon: 'bi-chat-heart-fill', label: 'Sôi nổi', desc: 'Tạo 5 nhóm thảo luận', color: 'text-pink-500', bg: 'bg-pink-500/10' },
    { icon: 'bi-shield-check', label: 'Xác thực', desc: 'Liên kết email sinh viên', color: 'text-blue-500', bg: 'bg-blue-500/10' },
  ];

  return (
    <div className="flex-1 w-full h-full overflow-y-auto px-4 md:px-8 pb-12 pt-4 text-left select-none relative bg-transparent">
      {/* Title Block */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h2 className="text-[28px] md:text-[32px] font-black text-[#1d1d1f] tracking-tight">Hồ sơ</h2>
        <p className="text-[13px] text-black/50 mt-1 font-medium">
          Quản lý định danh số, không gian làm việc và thống kê học tập
        </p>
      </motion.div>

      <motion.div 
        variants={containerVariants} 
        initial="hidden" 
        animate="show" 
        className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start"
      >
        {/* Left Column: Premium Overview & Theme (xl:col-span-4) */}
        <div className="xl:col-span-4 flex flex-col gap-6">
          
          {/* Glowing Profile Overview Card */}
          <motion.div variants={itemVariants} className="bg-white rounded-[32px] p-6 shadow-sm border border-black/[0.03] flex flex-col items-center text-center relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-full h-32 bg-gradient-to-b from-[var(--color-primary)]/10 to-transparent pointer-events-none" />
            
            <div className="relative mb-6 mt-4">
              <div className="absolute inset-0 bg-[var(--color-primary)] blur-2xl opacity-20 rounded-full scale-110 group-hover:opacity-30 transition-opacity" />
              <div className="relative w-28 h-28 rounded-full overflow-hidden border-[4px] border-white shadow-xl bg-[#f5f5f7]">
                <img
                  alt="Avatar"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  src={avatarUrl}
                />
                <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white text-[10px] font-extrabold transition-opacity duration-300 cursor-pointer backdrop-blur-sm">
                  <i className="bi bi-camera-fill text-[20px] mb-1" />
                  <span>Đổi ảnh</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div className="space-y-1.5 mb-5 relative z-10">
              <div className="flex justify-center mb-2">
                <div className="px-3 py-1 bg-gradient-to-r from-gray-900 to-black rounded-full flex items-center gap-1.5 shadow-lg border border-white/10">
                  <i className="bi bi-stars text-amber-400 text-[12px]" />
                  <span className="text-[10px] font-black tracking-widest uppercase bg-clip-text text-transparent bg-gradient-to-r from-amber-200 to-amber-500">
                    Ultra
                  </span>
                </div>
              </div>
              <h3 className="text-[22px] font-black text-[#1d1d1f] tracking-tight">
                Alex Nguyen
              </h3>
              <p className="text-[14px] font-semibold text-black/40">{currentUser || 'alex@student.edu.vn'}</p>
            </div>
          </motion.div>

          {/* Theme Selector */}
          <motion.div variants={itemVariants} className="bg-white rounded-[32px] border border-black/[0.03] p-6 shadow-sm">
            <h4 className="text-[14px] font-extrabold text-[#1d1d1f] mb-1">Theme hệ thống</h4>
            <p className="text-[12px] font-medium text-black/40 mb-5">Đồng bộ màu sắc toàn bộ dashboard</p>

            <div className="flex justify-between">
              {colorOptions.map((opt) => {
                const isSelected = accentColor === opt.value;
                return (
                  <Tooltip key={opt.value} title={opt.name}>
                    <button
                      onClick={() => {
                        onAccentColorChange(opt.value);
                        message.success(`Đã đồng bộ sang "${opt.name}"!`);
                      }}
                      className={`w-12 h-12 rounded-full ${opt.glowClass} transition-all duration-300 cursor-pointer relative flex items-center justify-center hover:scale-110 shadow-sm
                        ${isSelected ? 'ring-[3px] ring-offset-4 ring-black/10 scale-110 shadow-lg' : 'opacity-80 hover:opacity-100'}
                      `}
                    >
                      {isSelected && (
                        <motion.i 
                          initial={{ scale: 0 }} 
                          animate={{ scale: 1 }} 
                          className="bi bi-check-lg text-white text-[18px] font-bold" 
                        />
                      )}
                    </button>
                  </Tooltip>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Right Column: Dashboard Layout (xl:col-span-8) */}
        <div className="xl:col-span-8 flex flex-col gap-6">
          
          {/* Stats Row */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-6 rounded-[32px] bg-gradient-to-br from-amber-50 to-orange-50/50 border border-amber-500/20 relative overflow-hidden group shadow-sm">
              <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-700" />
              <div className="flex justify-between items-start relative z-10">
                <div>
                  <span className="text-[11px] font-extrabold text-amber-600 uppercase tracking-widest block mb-1">Chuỗi học tập</span>
                  <span className="text-[36px] font-black text-[#1d1d1f] tracking-tight leading-none">14 <span className="text-[14px] text-black/40 font-bold ml-1">ngày</span></span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-amber-500 shadow-sm border border-amber-500/10">
                  <i className="bi bi-fire text-[20px]" />
                </div>
              </div>
            </div>

            <div className={`p-6 rounded-[32px] ${currentTheme.bg} border ${currentTheme.border} relative overflow-hidden group shadow-sm`}>
              <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-[var(--color-primary)]/10 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-700" />
              <div className="flex justify-between items-start relative z-10">
                <div>
                  <span className="text-[11px] font-extrabold text-[var(--color-primary)] uppercase tracking-widest block mb-1">Tài liệu đóng góp</span>
                  <span className="text-[36px] font-black text-[#1d1d1f] tracking-tight leading-none">{documentsCount} <span className="text-[14px] text-black/40 font-bold ml-1">file</span></span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-[var(--color-primary)] shadow-sm border border-[var(--color-primary)]/10">
                  <i className="bi bi-folder-check text-[20px]" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Settings / Information Form */}
          <motion.div variants={itemVariants} className="bg-white rounded-[32px] border border-black/[0.03] p-8 shadow-sm">
            <h4 className="text-[16px] font-black text-[#1d1d1f] mb-6 flex items-center gap-2">
              <i className="bi bi-person-vcard text-[var(--color-primary)]" /> Thông tin cá nhân
            </h4>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-extrabold text-black/40 uppercase tracking-widest block">Họ và Tên</label>
                  <input
                    type="text"
                    defaultValue="Alex Nguyen"
                    className="w-full h-12 bg-[#f9f9fb] border-transparent hover:border-black/10 focus:border-[var(--color-primary)] focus:bg-white rounded-[16px] px-4 text-[#1d1d1f] text-[14px] font-bold outline-none transition-all shadow-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-extrabold text-black/40 uppercase tracking-widest block">Email liên kết</label>
                  <input
                    type="text"
                    defaultValue={currentUser || 'alex@student.edu.vn'}
                    disabled
                    className="w-full h-12 bg-black/[0.02] border border-transparent rounded-[16px] px-4 text-black/40 text-[14px] font-bold outline-none cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Editable School Name Field */}
              <div className="space-y-2">
                <label className="text-[11px] font-extrabold text-black/40 uppercase tracking-widest block">Tên trường học</label>
                <div className={`flex items-center w-full min-h-[48px] rounded-[16px] transition-all px-4 ${isEditingSchool ? 'bg-white border-2 border-[var(--color-primary)] shadow-[0_0_0_4px_var(--color-primary)]/10' : 'bg-[#f9f9fb] border-2 border-transparent hover:border-black/5'}`}>
                  <i className="bi bi-bank text-[16px] text-black/40 mr-3 shrink-0" />
                  {isEditingSchool ? (
                    <input
                      autoFocus
                      type="text"
                      value={tempSchoolName}
                      onChange={(e) => setTempSchoolName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') saveSchool();
                        if (e.key === 'Escape') setIsEditingSchool(false);
                      }}
                      className="flex-1 bg-transparent border-none outline-none text-[#1d1d1f] text-[14px] font-bold py-3"
                      placeholder="Nhập tên trường..."
                    />
                  ) : (
                    <span className="flex-1 text-[#1d1d1f] text-[14px] font-bold py-3 break-words">{schoolName}</span>
                  )}
                  
                  {isEditingSchool ? (
                    <div className="flex gap-1 shrink-0 ml-2">
                      <button onClick={() => setIsEditingSchool(false)} className="w-8 h-8 rounded-lg flex items-center justify-center text-black/40 hover:bg-black/5 transition-colors">
                        <i className="bi bi-x-lg text-[14px]" />
                      </button>
                      <button onClick={saveSchool} className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--color-primary)] bg-[var(--color-primary)]/10 hover:bg-[var(--color-primary)]/20 transition-colors">
                        <i className="bi bi-check-lg text-[16px] font-bold" />
                      </button>
                    </div>
                  ) : (
                    <button onClick={() => { setIsEditingSchool(true); setTempSchoolName(schoolName); }} className="shrink-0 ml-2 w-8 h-8 rounded-lg flex items-center justify-center text-black/40 hover:bg-white hover:shadow-sm hover:text-[#1d1d1f] transition-all">
                      <i className="bi bi-pencil-square text-[14px]" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-10 pt-6 border-t border-black/[0.04] flex justify-end">
              <Button
                type="primary"
                onClick={handleSaveSettings}
                className="h-12 rounded-[16px] font-extrabold text-[14px] px-8 shadow-lg shadow-[var(--color-primary)]/20 border-none transition-transform hover:scale-105"
              >
                Lưu cài đặt
              </Button>
            </div>
          </motion.div>

          {/* Achievement Badges Area */}
          <motion.div variants={itemVariants} className="bg-white rounded-[32px] border border-black/[0.03] p-8 shadow-sm">
            <h4 className="text-[16px] font-black text-[#1d1d1f] mb-6 flex items-center gap-2">
              <i className="bi bi-trophy-fill text-amber-500" /> Huy hiệu đạt được
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {achievements.map((ach, idx) => (
                <div key={idx} className="bg-[#f9f9fb] border border-black/[0.03] rounded-[20px] p-5 flex flex-col items-center text-center hover:bg-white hover:shadow-md transition-all group">
                  <div className={`w-14 h-14 rounded-2xl ${ach.bg} ${ach.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                    <i className={`bi ${ach.icon} text-[24px]`} />
                  </div>
                  <span className="text-[14px] font-extrabold text-[#1d1d1f] mb-1">{ach.label}</span>
                  <span className="text-[11px] font-semibold text-black/40">{ach.desc}</span>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </motion.div>
    </div>
  );
}
