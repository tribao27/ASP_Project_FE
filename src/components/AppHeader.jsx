/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Badge, Popover } from 'antd';
import { motion, AnimatePresence } from 'framer-motion';

const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    title: 'Tài liệu "Giải tích 1" đã được AI phân tích xong',
    time: '5 phút trước',
    isRead: false,
    icon: 'bi-check2-circle text-[#32d74b]',
    bg: 'bg-[#32d74b]/10'
  },
  {
    id: 2,
    title: 'Nguyễn Văn A vừa yêu cầu tham gia nhóm "Luyện thi TOEIC"',
    time: '2 giờ trước',
    isRead: false,
    icon: 'bi-person-plus text-[#007aff]',
    bg: 'bg-[#007aff]/10'
  },
  {
    id: 3,
    title: 'Hệ thống sẽ bảo trì vào 23:00 tối nay',
    time: '1 ngày trước',
    isRead: true,
    icon: 'bi-info-circle text-[#ff8a00]',
    bg: 'bg-[#ff8a00]/10'
  }
];

const OLDER_NOTIFICATIONS = [
  {
    id: 4,
    title: 'Trợ lý AI đã tóm tắt xong 50 trang tài liệu "Triết học Mác-Lênin"',
    time: '2 ngày trước',
    isRead: true,
    icon: 'bi-file-earmark-text text-[#007aff]',
    bg: 'bg-[#007aff]/10'
  },
  {
    id: 5,
    title: 'Nhóm "Đồ án Tốt nghiệp" vừa tải lên 3 tài liệu mới',
    time: '3 ngày trước',
    isRead: true,
    icon: 'bi-cloud-arrow-up text-[#ff5c00]',
    bg: 'bg-[#ff5c00]/10'
  },
  {
    id: 6,
    title: 'Dung lượng lưu trữ của bạn sắp đầy (Đã dùng 95%)',
    time: '4 ngày trước',
    isRead: true,
    icon: 'bi-exclamation-triangle text-[#ff3b30]',
    bg: 'bg-[#ff3b30]/10'
  },
  {
    id: 7,
    title: 'Bạn đã đạt mốc 10.000 điểm cống hiến cộng đồng!',
    time: '1 tuần trước',
    isRead: true,
    icon: 'bi-trophy text-[#ffd60a]',
    bg: 'bg-[#ffd60a]/10'
  }
];

/**
 * Shared Header Toolbar — Ultra-Premium Minimalist Stripe/Linear style.
 * Includes elegant keyboard shortcut badge (⌘K), dynamic border glows using accentColor,
 * and a premium double ringed avatar layout.
 */
export default function AppHeader({
  searchTerm,
  onSearchChange,
  avatarUrl,
  accentColor = '#ff5c00',
  onToggleMobileMenu,
  children,
}) {
  const [isFocused, setIsFocused] = useState(false);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggleExpand = () => {
    if (!isExpanded) {
      setNotifications(prev => [...prev, ...OLDER_NOTIFICATIONS]);
      setIsExpanded(true);
    } else {
      setNotifications(prev => prev.filter(n => !OLDER_NOTIFICATIONS.find(o => o.id === n.id)));
      setIsExpanded(false);
    }
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const notificationContent = (
    <div className="w-[340px] p-1 font-sans flex flex-col transition-all duration-300">
      <div className="flex items-center justify-between px-3 py-2 border-b border-black/5 mb-2 shrink-0">
        <h3 className="font-bold text-[14px] text-black tracking-tight">Thông báo</h3>
        <button 
          onClick={markAllAsRead}
          className="text-[11px] font-semibold text-[#ff5c00] hover:text-[#ff8a00] transition-colors cursor-pointer"
        >
          Đánh dấu đã đọc
        </button>
      </div>
      
      <div className={`flex flex-col overflow-y-auto px-1 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-black/10 hover:[&::-webkit-scrollbar-thumb]:bg-black/20 [&::-webkit-scrollbar-thumb]:rounded-full transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-[450px]' : 'max-h-[260px]'}`}>
        <AnimatePresence>
          {notifications.map((noti) => (
            <motion.div 
              key={noti.id}
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: 'auto', marginBottom: 4 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              className={`flex gap-3 items-start p-3 rounded-xl cursor-pointer transition-colors ${noti.isRead ? 'hover:bg-black/5' : 'bg-black/[0.02] hover:bg-black/[0.04]'}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${noti.bg}`}>
                <i className={`bi ${noti.icon} text-[14px]`} />
              </div>
              <div className="flex-1">
                <p className={`text-[12.5px] leading-snug ${noti.isRead ? 'text-black/60 font-medium' : 'text-black font-bold'}`}>
                  {noti.title}
                </p>
                <p className="text-[10px] font-bold text-black/30 uppercase tracking-widest mt-1">
                  {noti.time}
                </p>
              </div>
              {!noti.isRead && (
                <div className="w-2 h-2 rounded-full bg-[#ff5c00] shrink-0 mt-1.5 shadow-[0_0_8px_rgba(255,92,0,0.6)]" />
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="px-2 pt-2 mt-1 border-t border-black/5 shrink-0">
        <button 
          onClick={handleToggleExpand}
          className="w-full py-2.5 text-[12px] font-bold text-black/40 hover:text-black hover:bg-black/[0.03] rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2"
        >
          {isExpanded ? (
            <>Thu gọn <i className="bi bi-chevron-up text-[10px]" /></>
          ) : (
            <>Xem tất cả <i className="bi bi-chevron-down text-[10px]" /></>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <motion.header 
      initial={{ opacity: 0, y: -15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="flex gap-4 justify-between items-center w-full bg-transparent select-none"
    >
      {/* Background radial accent glow light */}
      <div 
        className="absolute top-0 right-1/4 w-80 h-80 rounded-full blur-[110px] pointer-events-none -z-10 transition-colors duration-500" 
        style={{ backgroundColor: `${accentColor}06` }}
      />

      <div className="flex items-center gap-3 w-full max-w-sm">
        {/* Mobile Hamburger Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onToggleMobileMenu}
          className="md:hidden w-10 h-10 rounded-full flex items-center justify-center bg-white border border-black/5 shadow-sm text-black/60 hover:text-black shrink-0 cursor-pointer"
        >
          <i className="bi bi-list text-[18px]" />
        </motion.button>

        {/* Modern Capsule Search Bar */}
        <div className="relative w-full">
        <motion.div
          animate={{
            borderColor: isFocused ? accentColor : 'rgba(0, 0, 0, 0.05)',
            boxShadow: isFocused 
              ? `0 0 20px ${accentColor}12`
              : '0 0 0px rgba(0, 0, 0, 0)',
            scale: isFocused ? 1.015 : 1
          }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-white border shadow-sm transition-all relative"
        >
          <i 
            className="bi bi-search transition-colors duration-300 text-[13px] shrink-0" 
            style={{ color: isFocused ? accentColor : 'rgba(0, 0, 0, 0.35)' }}
          />
          
          <input
            type="text"
            placeholder="Tìm tài liệu, giáo trình học tập..."
            value={searchTerm || ''}
            onChange={(e) => onSearchChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="w-full bg-transparent border-none text-black text-[12.5px] font-semibold placeholder-black/30 outline-none pr-12"
          />

          <div className="absolute right-4 flex items-center gap-1.5 pointer-events-none">
            <AnimatePresence mode="wait">
              {searchTerm ? (
                <motion.button
                  key="clear-btn"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={() => onSearchChange('')}
                  className="text-black/35 hover:text-black pointer-events-auto cursor-pointer flex items-center justify-center mr-1"
                >
                  <i className="bi bi-x-circle-fill text-[12.5px]" />
                </motion.button>
              ) : (
                <motion.div
                  key="k-badge"
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.85 }}
                  className="px-2 py-0.5 rounded-md bg-black/[0.04] border border-black/[0.03] text-[9.5px] font-black text-black/30 tracking-tight flex items-center gap-0.5 select-none"
                >
                  <span>⌘</span>
                  <span>K</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
      </div>

      <div className="flex items-center gap-4.5">
        {children}

        {/* Premium Notifications Bell */}
        <Popover 
          content={notificationContent} 
          trigger="click" 
          placement="bottomRight"
          styles={{ body: { borderRadius: '20px', padding: '8px', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)' } }}
        >
          <Badge dot={notifications.some(n => !n.isRead)} color={accentColor} offset={[-1.5, 1.5]}>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-8.5 h-8.5 bg-white hover:bg-black/[0.015] rounded-full text-black/60 hover:text-black transition-colors border border-black/[0.04] shadow-sm flex items-center justify-center cursor-pointer relative"
            >
              <i className="bi bi-bell text-[14px]" />
            </motion.button>
          </Badge>
        </Popover>

        <div className="h-4.5 w-[1.5px] bg-black/[0.06] mx-0.5" />

        {/* Premium Double Ringed Circular Profile Avatar */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-8.5 h-8.5 rounded-full overflow-hidden shadow-sm flex items-center justify-center bg-white cursor-pointer relative p-[1.5px] transition-all"
          style={{ border: `1.5px solid ${accentColor}30` }}
        >
          <div className="w-full h-full rounded-full overflow-hidden">
            <img 
              src={avatarUrl} 
              alt="Avatar" 
              className="w-full h-full object-cover" 
            />
          </div>
        </motion.div>
      </div>
    </motion.header>
  );
}
