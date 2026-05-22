import { Progress, Tooltip } from 'antd';
import { motion } from 'framer-motion';

/**
 * Main Sidebar Navigation for Authenticated Views.
 * Apple-inspired sleek light design with glowing features.
 * Profile widget removed as requested.
 */
export default function Sidebar({
  currentView,
  onNavigate,
  onLogout,
  currentUser,
  storagePercentage,
  documentsCount,
  deletedDocsCount = 0,
  accentColor,
  isMobileMenuOpen,
  onCloseMobileMenu,
}) {
  const menuItems = [
    {
      key: 'dashboard',
      icon: 'bi-folder2',
      label: 'Trang chủ',
    },
    {
      key: 'community',
      icon: 'bi-people',
      label: 'Nhóm học tập',
    },
    {
      key: 'ai',
      icon: 'bi-stars',
      label: 'Trợ lý AI',
    },
  ];

  return (
    <aside 
      className={`w-[260px] bg-white border-r border-black/5 flex flex-col px-4 py-6 fixed h-full left-0 top-0 z-50 select-none overflow-y-auto transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isMobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0'
      }`}
    >
      {/* Background ambient lighting */}
      <div className="absolute -top-12 -left-12 w-48 h-48 bg-[#ff5c00]/2 rounded-full blur-[80px] pointer-events-none" />

      {/* Mobile Close Button */}
      <button 
        onClick={onCloseMobileMenu}
        className="md:hidden absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-black/5 text-black/50 hover:text-black hover:bg-black/10 transition-colors z-50 cursor-pointer"
      >
        <i className="bi bi-x-lg text-[14px]" />
      </button>

      {/* Brand Logo */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        onClick={() => onNavigate('landing')}
        className="flex items-center gap-3 px-3 py-3 mb-8 cursor-pointer group rounded-xl bg-black/[0.01] border border-black/5 hover:border-black/10 transition-all"
      >
        <div className="w-9 h-9 bg-gradient-to-br from-[#ff8a00] to-[#ff5c00] rounded-xl flex items-center justify-center text-white shadow-lg orange-glow group-hover:rotate-6 transition-all duration-300">
          <i className="bi bi-book text-[16px]" />
        </div>
        <div>
          <span className="font-bold text-black text-[14px] tracking-tight block group-hover:text-[#ff5c00] transition-colors">
            AI Study Hub
          </span>
          <span className="text-[9px] font-semibold text-white bg-gradient-to-r from-[#ff8a00] to-[#ff5c00] px-2 py-0.5 rounded-full inline-block mt-1 tracking-wide uppercase shadow-sm">
            Học tập 4.0
          </span>
        </div>
      </motion.div>

      {/* Navigation List */}
      <nav className="flex-1 space-y-1.5">
        {menuItems.map((item) => {
          const isActive = currentView === item.key;
          return (
            <motion.button
              key={item.key}
              whileHover={{ x: 4, backgroundColor: 'rgba(0, 0, 0, 0.02)' }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                onNavigate(item.key);
                onCloseMobileMenu && onCloseMobileMenu();
              }}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all w-full text-left cursor-pointer text-[13px] relative overflow-hidden group ${
                isActive 
                  ? 'text-white font-semibold shadow-md orange-glow' 
                  : 'text-black/60 hover:text-black font-medium'
              }`}
              style={{
                background: isActive ? `linear-gradient(135deg, ${accentColor} 0%, ${accentColor}dd 100%)` : 'transparent',
              }}
            >
              {isActive && (
                <motion.div 
                  layoutId="activeIndicator"
                  className="absolute left-0 top-0 bottom-0 w-1 bg-white"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <i className={`bi ${item.icon} text-[16px] transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-white' : 'text-black/40 group-hover:text-[#ff5c00]'}`} />
              <span className="tracking-tight">{item.label}</span>
            </motion.button>
          );
        })}
      </nav>

      {/* Bottom info section */}
      <div className="mt-auto space-y-4 pt-5 border-t border-black/5 relative">
        
        {/* Storage limit card */}
        <div className="bg-black/[0.01] rounded-2xl p-4 border border-black/5 relative overflow-hidden">
          <div className="absolute right-0 bottom-0 w-24 h-24 bg-[#ff5c00]/2 rounded-full blur-xl pointer-events-none" />
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] font-semibold text-black/40 tracking-wider uppercase">
              Bộ nhớ đám mây
            </span>
            <span className="text-[11px] font-bold text-[#ff5c00] bg-[#ff5c00]/10 px-2 py-0.5 rounded-full">
              {storagePercentage.toFixed(0)}%
            </span>
          </div>
          <Progress
            percent={storagePercentage}
            showInfo={false}
            strokeColor={accentColor}
            trailColor="rgba(0, 0, 0, 0.04)"
            size="small"
            className="mb-2"
          />
          <p className="text-[10px] font-medium text-black/55">
            {(documentsCount * 2.8).toFixed(1)} MB / 50.0 MB
          </p>
        </div>

        {/* Extra actions */}
        <div className="space-y-1">
          <Tooltip title="Thiết lập & Cài đặt hệ thống" placement="right">
            <motion.button
              whileHover={{ x: 4, backgroundColor: 'rgba(0, 0, 0, 0.02)' }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                onNavigate('profile');
                onCloseMobileMenu && onCloseMobileMenu();
              }}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all w-full text-left cursor-pointer text-[12px] font-medium ${
                currentView === 'profile' 
                  ? 'bg-black/[0.02] text-[#ff5c00] border border-[#ff5c00]/20' 
                  : 'text-black/50 hover:text-black'
              }`}
            >
              <i className="bi bi-gear text-[14px]" /> Cài đặt hệ thống
            </motion.button>
          </Tooltip>

          <Tooltip title="Tài liệu đã xóa tạm thời" placement="right">
            <motion.button
              whileHover={{ x: 4, backgroundColor: 'rgba(0, 0, 0, 0.02)' }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                onNavigate('trash');
                onCloseMobileMenu && onCloseMobileMenu();
              }}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all w-full text-left cursor-pointer text-[12px] font-medium ${
                currentView === 'trash' 
                  ? 'bg-black/[0.02] text-[#ff5c00] border border-[#ff5c00]/20' 
                  : 'text-black/50 hover:text-black'
              }`}
            >
              <i className="bi bi-trash3 text-[14px]" />
              <span className="flex-1">Thùng rác</span>
              {deletedDocsCount > 0 && (
                <span className="text-[9px] font-bold text-white bg-red-500 rounded-full px-1.5 py-0.5">
                  {deletedDocsCount}
                </span>
              )}
            </motion.button>
          </Tooltip>

          <motion.button
            whileHover={{ backgroundColor: 'rgba(255, 59, 48, 0.08)' }}
            whileTap={{ scale: 0.98 }}
            onClick={onLogout}
            className="flex items-center gap-3 px-4 py-2.5 text-red-500 hover:text-red-400 rounded-xl transition-all w-full text-left cursor-pointer text-[12px] font-medium mt-2"
          >
            <i className="bi bi-box-arrow-left text-[14px]" /> Đăng xuất ({currentUser?.split('@')[0] || 'guest'})
          </motion.button>
        </div>
      </div>
    </aside>
  );
}
