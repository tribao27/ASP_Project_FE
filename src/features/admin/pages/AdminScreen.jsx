// AI Study Hub — Admin Panel (Dashboard-synced theme)
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tooltip } from 'antd';
import { motion, AnimatePresence } from 'framer-motion';
import { SYSTEM_LOGS_INITIAL } from '../mock/admin.mock.js';

import DashboardTab from '../components/DashboardTab.jsx';
import UsersTab from '../components/UsersTab.jsx';
import ContentTab from '../components/ContentTab.jsx';
import AnalyticsTab from '../components/AnalyticsTab.jsx';
import SettingsTab from '../components/SettingsTab.jsx';
import ReportModal from '../components/ReportModal.jsx';

const NAV_ITEMS = [
  { id: 'dashboard', icon: 'bi-grid-1x2-fill', label: 'Tổng quan' },
  { id: 'users', icon: 'bi-people-fill', label: 'Người dùng' },
  { id: 'content', icon: 'bi-folder2-open', label: 'Tài liệu' },
  { id: 'analytics', icon: 'bi-bar-chart-line-fill', label: 'Thống kê & AI' },
  { id: 'settings', icon: 'bi-sliders', label: 'Cài đặt' },
];

export default function AdminScreen({ onLogout }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showReport, setShowReport] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [systemLogs, setSystemLogs] = useState(SYSTEM_LOGS_INITIAL);
  const navigate = useNavigate();

  const addLog = useCallback((level, message) => {
    setSystemLogs(prev => [{ time: new Date().toISOString(), level, message }, ...prev]);
  }, []);

  const handleNav = (id) => { setActiveTab(id); setMobileMenu(false); };
  const sidebarW = isCollapsed ? 'w-[72px]' : 'w-[260px]';

  const renderTab = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardTab />;
      case 'users': return <UsersTab onLog={addLog} />;
      case 'content': return <ContentTab onLog={addLog} />;
      case 'analytics': return <AnalyticsTab systemLogs={systemLogs} onLog={addLog} />;
      case 'settings': return <SettingsTab onLog={addLog} />;
      default: return <DashboardTab />;
    }
  };

  return (
    <div className="flex h-screen max-h-screen bg-white text-[#1d1d1f] font-sans overflow-hidden">

      {/* ═══ SIDEBAR ═══ */}
      <aside className={`${sidebarW} bg-white border-r border-black/5 flex-col shrink-0 z-30 hidden md:flex sidebar-transition select-none relative`}>
        {/* Ambient glow */}
        <div className="absolute -top-12 -left-12 w-48 h-48 bg-[var(--color-primary)]/[0.02] rounded-full blur-[80px] pointer-events-none" />

        {/* Collapse toggle */}
        <Tooltip title={isCollapsed ? 'Mở rộng' : 'Thu gọn'} placement="right">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:flex absolute top-7 -right-[14px] w-[28px] h-[28px] items-center justify-center rounded-full bg-white text-black/50 hover:text-[var(--color-primary)] transition-all z-[60] cursor-pointer border border-black/[0.08] shadow-md hover:shadow-lg hover:shadow-[var(--color-primary)]/10 hover:border-[var(--color-primary)]/30 hover:scale-110 active:scale-95"
          >
            <i className={`bi ${isCollapsed ? 'bi-layout-sidebar-inset-reverse' : 'bi-layout-sidebar-inset'} text-[13px]`} />
          </button>
        </Tooltip>

        {/* Brand */}
        <div className={`flex items-center gap-3 ${isCollapsed ? 'px-3 py-5 justify-center' : 'px-4 py-5'} border-b border-black/5`}>
          <div className="w-9 h-9 bg-gradient-to-br from-[#ff8a00] to-[#ff5c00] rounded-xl flex items-center justify-center text-white shadow-lg shadow-[var(--color-primary)]/20 shrink-0">
            <i className="bi bi-shield-lock-fill text-[16px]" />
          </div>
          {!isCollapsed && (
            <div className="sidebar-text-fade">
              <span className="font-bold text-[14px] text-[#1d1d1f] tracking-tight block">AI Study Hub</span>
              <span className="text-[9px] font-bold text-white bg-gradient-to-r from-[#ff8a00] to-[#ff5c00] px-2 py-0.5 rounded-full inline-block mt-0.5 tracking-wide uppercase shadow-sm">Quản trị viên</span>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
          {NAV_ITEMS.map(item => {
            const isActive = activeTab === item.id;
            const btn = (
              <motion.button
                key={item.id}
                whileHover={{ x: isCollapsed ? 0 : 3, backgroundColor: 'rgba(0,0,0,0.02)' }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleNav(item.id)}
                className={`w-full flex items-center ${isCollapsed ? 'justify-center px-0' : 'px-4'} gap-3 py-3 rounded-xl transition-all text-[13px] relative overflow-hidden group cursor-pointer ${isActive ? 'text-white font-semibold shadow-md' : 'text-black/60 hover:text-black font-medium'}`}
                style={{ background: isActive ? `linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary) 100%)` : 'transparent' }}
              >
                {isActive && <motion.div layoutId="adminActiveNav" className="absolute left-0 top-0 bottom-0 w-1 bg-white" transition={{ type: 'spring', stiffness: 380, damping: 30 }} />}
                <i className={`bi ${item.icon} text-[16px] transition-transform duration-300 group-hover:scale-110 shrink-0 ${isActive ? 'text-white' : 'text-black/40 group-hover:text-[var(--color-primary)]'}`} />
                {!isCollapsed && <span className="tracking-tight sidebar-text-fade">{item.label}</span>}
              </motion.button>
            );
            return isCollapsed ? <Tooltip key={item.id} title={item.label} placement="right">{btn}</Tooltip> : <div key={item.id}>{btn}</div>;
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="px-3 py-4 space-y-2 border-t border-black/5">
          {!isCollapsed ? (
            <button onClick={() => setShowReport(true)} className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#ff8a00] to-[#ff5c00] text-white text-[12px] font-bold cursor-pointer hover:opacity-90 active:scale-[0.98] transition-all shadow-md shadow-[var(--color-primary)]/15 flex items-center justify-center gap-1.5">
              <i className="bi bi-file-earmark-bar-graph text-[13px]" /> Tạo Báo Cáo
            </button>
          ) : (
            <Tooltip title="Tạo Báo Cáo" placement="right">
              <button onClick={() => setShowReport(true)} className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#ff8a00] to-[#ff5c00] text-white flex items-center justify-center cursor-pointer hover:opacity-90 active:scale-[0.98] transition-all shadow-md">
                <i className="bi bi-file-earmark-bar-graph text-[14px]" />
              </button>
            </Tooltip>
          )}

          {(() => {
            const logoutBtn = (
              <motion.button
                whileHover={{ backgroundColor: 'rgba(255,59,48,0.08)' }}
                whileTap={{ scale: 0.98 }}
                onClick={() => { onLogout?.(); navigate('/admin/login'); }}
                className={`flex items-center ${isCollapsed ? 'justify-center px-0' : 'px-4'} gap-3 py-2.5 text-red-500 hover:text-red-400 rounded-xl transition-all w-full text-left cursor-pointer text-[12px] font-medium`}
              >
                <i className="bi bi-box-arrow-left text-[14px] shrink-0" />
                {!isCollapsed && <span className="sidebar-text-fade">Đăng xuất</span>}
              </motion.button>
            );
            return isCollapsed ? <Tooltip title="Đăng xuất" placement="right">{logoutBtn}</Tooltip> : logoutBtn;
          })()}
        </div>
      </aside>

      {/* ═══ MOBILE DRAWER ═══ */}
      <AnimatePresence>
        {mobileMenu && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 md:hidden" onClick={() => setMobileMenu(false)}>
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
            <motion.aside initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }} className="absolute left-0 top-0 bottom-0 w-[260px] bg-white shadow-2xl flex flex-col border-r border-black/5" onClick={e => e.stopPropagation()}>
              <div className="p-5 flex items-center justify-between border-b border-black/5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-gradient-to-br from-[#ff8a00] to-[#ff5c00] rounded-xl flex items-center justify-center text-white shadow-md"><i className="bi bi-shield-lock-fill text-[16px]" /></div>
                  <span className="font-bold text-[14px] text-[#1d1d1f]">AI Study Hub</span>
                </div>
                <button onClick={() => setMobileMenu(false)} className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center text-black/50 hover:bg-black/10 transition-colors"><i className="bi bi-x-lg text-[13px]" /></button>
              </div>
              <nav className="flex-1 px-3 py-4 space-y-1">
                {NAV_ITEMS.map(item => (
                  <button key={item.id} onClick={() => handleNav(item.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[13px] font-medium transition-all ${activeTab === item.id ? 'text-white bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary)] shadow-md font-semibold' : 'text-black/60 hover:bg-black/[0.02]'}`}>
                    <i className={`bi ${item.icon} text-[16px]`} /> {item.label}
                  </button>
                ))}
              </nav>
              <div className="p-4 border-t border-black/5">
                <button onClick={() => { setShowReport(true); setMobileMenu(false); }} className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#ff8a00] to-[#ff5c00] text-white text-[12px] font-bold flex items-center justify-center gap-1.5 shadow-md active:scale-[0.98] transition-all">
                  <i className="bi bi-file-earmark-bar-graph" /> Tạo Báo Cáo
                </button>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ MAIN ═══ */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="sticky top-0 z-20 h-[64px] bg-white/80 backdrop-blur-xl border-b border-black/5 flex items-center justify-between px-4 md:px-6 shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileMenu(true)} className="md:hidden w-9 h-9 rounded-xl bg-black/[0.02] border border-black/5 flex items-center justify-center text-black/50 hover:bg-black/[0.04] transition-colors cursor-pointer">
              <i className="bi bi-list text-[18px]" />
            </button>
            <div className="hidden sm:flex items-center gap-2 bg-black/[0.02] border border-black/5 rounded-xl px-3 py-2">
              <i className="bi bi-search text-black/30 text-[12px]" />
              <input placeholder="Tìm kiếm nhanh..." className="bg-transparent border-none outline-none text-[12px] font-medium text-[#1d1d1f] placeholder-black/30 w-48" />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Tooltip title="Thông báo">
              <button className="w-9 h-9 rounded-xl bg-black/[0.02] border border-black/5 flex items-center justify-center text-black/50 hover:text-[var(--color-primary)] hover:border-[var(--color-primary)]/20 transition-all relative cursor-pointer">
                <i className="bi bi-bell-fill text-[13px]" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-[var(--color-primary)] rounded-full border-2 border-white" />
              </button>
            </Tooltip>

            <div className="h-8 w-px bg-black/5 mx-1 hidden sm:block" />

            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <div className="text-[12px] font-bold text-[#1d1d1f] leading-none">Xin chào, Admin</div>
                <div className="text-[10px] font-semibold text-[#34c759] mt-0.5">Đang trực tuyến</div>
              </div>
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#ff8a00] to-[#ff5c00] p-[2px] shadow-sm">
                <div className="w-full h-full rounded-[10px] bg-white flex items-center justify-center text-[var(--color-primary)] font-bold text-[13px]">A</div>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 md:px-6 py-5">
          <div className="max-w-[1400px] mx-auto">
            {renderTab()}
          </div>
        </div>
      </main>

      {/* Report Modal */}
      {showReport && <ReportModal onClose={() => setShowReport(false)} />}
    </div>
  );
}
