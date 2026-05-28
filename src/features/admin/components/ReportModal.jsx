// Tạo Báo Cáo — Modal 3 bước (Dashboard-synced theme)
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ReportModal({ onClose }) {
  const [step, setStep] = useState(1);
  const [selected, setSelected] = useState({ stats: true, users: true, logs: false });
  const [format, setFormat] = useState('PDF');

  const handleGenerate = () => { setStep(2); setTimeout(() => setStep(3), 2500); };

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[999] flex items-center justify-center bg-black/20 backdrop-blur-sm" onClick={onClose}>
        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 25 }} onClick={e => e.stopPropagation()} className="bg-white rounded-[24px] w-full max-w-lg shadow-[0_20px_60px_rgba(0,0,0,0.08)] border border-black/[0.06] overflow-hidden">
          {/* Header */}
          <div className="flex justify-between items-center px-7 py-5 border-b border-black/[0.04]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#ff8a00] to-[#ff5c00] flex items-center justify-center shadow-md shadow-[var(--color-primary)]/15"><i className="bi bi-file-earmark-bar-graph text-white text-[15px]" /></div>
              <div><h3 className="text-[15px] font-extrabold text-[#1d1d1f] tracking-tight">Tạo Báo Cáo</h3><p className="text-[10px] text-black/40 font-medium">Bước {step} / 3</p></div>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-black/[0.03] hover:bg-black/[0.06] flex items-center justify-center text-black/40 transition-colors cursor-pointer"><i className="bi bi-x-lg text-[12px]" /></button>
          </div>

          <div className="p-7">
            {step === 1 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
                <div>
                  <label className="text-[10px] font-bold text-black/40 uppercase tracking-widest block mb-3">Chọn dữ liệu xuất</label>
                  <div className="space-y-2">
                    {[{ key: 'stats', label: 'Thống kê hệ thống (KPI)', icon: 'bi-bar-chart-line' }, { key: 'users', label: 'Danh sách thành viên', icon: 'bi-people' }, { key: 'logs', label: 'Nhật ký hệ thống', icon: 'bi-terminal' }].map(opt => (
                      <label key={opt.key} className={`flex items-center gap-3 p-3.5 rounded-[14px] border cursor-pointer transition-all ${selected[opt.key] ? 'border-[var(--color-primary)]/20 bg-[var(--color-primary)]/[0.04]' : 'border-black/[0.05] hover:border-black/10'}`}>
                        <input type="checkbox" checked={selected[opt.key]} onChange={() => setSelected(prev => ({ ...prev, [opt.key]: !prev[opt.key] }))} className="accent-[var(--color-primary)] w-4 h-4 cursor-pointer" />
                        <i className={`bi ${opt.icon} text-[15px] ${selected[opt.key] ? 'text-[var(--color-primary)]' : 'text-black/30'}`} />
                        <span className={`text-[12px] font-semibold ${selected[opt.key] ? 'text-[#1d1d1f]' : 'text-black/50'}`}>{opt.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-black/40 uppercase tracking-widest block mb-3">Định dạng xuất</label>
                  <div className="flex gap-2">
                    {['PDF', 'JSON', 'CSV'].map(f => (
                      <button key={f} onClick={() => setFormat(f)} className={`flex-1 h-10 rounded-[12px] text-[12px] font-bold transition-all cursor-pointer active:scale-[0.95] ${format === f ? 'bg-gradient-to-r from-[#ff8a00] to-[#ff5c00] text-white shadow-md shadow-[var(--color-primary)]/15' : 'bg-black/[0.03] text-black/50 hover:bg-black/[0.06]'}`}>{f}</button>
                    ))}
                  </div>
                </div>
                <motion.button whileTap={{ scale: 0.97 }} onClick={handleGenerate} className="w-full h-11 rounded-[14px] bg-gradient-to-r from-[#ff8a00] to-[#ff5c00] text-white font-bold text-[12px] shadow-lg shadow-[var(--color-primary)]/20 cursor-pointer transition-all mt-2">Bắt đầu tạo báo cáo</motion.button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-12">
                <div className="w-14 h-14 border-[3px] border-black/[0.06] border-t-[var(--color-primary)] rounded-full animate-spin mb-5" />
                <h4 className="text-[15px] font-extrabold text-[#1d1d1f] mb-1">Đang trích lục dữ liệu...</h4>
                <p className="text-[11px] text-black/40 font-medium">Hệ thống đang biên dịch báo cáo từ cơ sở dữ liệu</p>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="bg-white border border-black/[0.06] rounded-[16px] p-7 shadow-inner mb-5 max-h-[280px] overflow-y-auto">
                  <div className="flex justify-between items-start mb-5">
                    <div><h4 className="text-[15px] font-extrabold text-[#1d1d1f]">AI Study Hub</h4><p className="text-[9px] text-black/35 font-bold uppercase tracking-widest">Báo cáo hệ thống — {format}</p></div>
                    <div className="text-right"><p className="text-[10px] text-black/40 font-medium">{new Date().toLocaleDateString('vi-VN')}</p><p className="text-[9px] text-black/30">Bảng điều khiển quản trị</p></div>
                  </div>
                  <hr className="border-black/5 mb-4" />
                  {selected.stats && <div className="mb-4"><h5 className="text-[10px] font-extrabold text-[var(--color-primary)] uppercase tracking-widest mb-2">Thống kê hệ thống</h5><div className="grid grid-cols-2 gap-2 text-[10px]">
                    {[['Người dùng', '12,482'], ['Tài liệu', '84,912'], ['AI Queries', '1.2M'], ['Sức khỏe', '99.9%']].map(([k, v], i) => <div key={i} className="bg-black/[0.02] p-2.5 rounded-lg"><span className="text-black/40">{k}:</span> <span className="font-bold text-[#1d1d1f]">{v}</span></div>)}
                  </div></div>}
                  {selected.users && <div className="mb-4"><h5 className="text-[10px] font-extrabold text-[var(--color-primary)] uppercase tracking-widest mb-1">Danh sách thành viên</h5><p className="text-[10px] text-black/40 font-medium">8 thành viên • 6 hoạt động • 1 chờ duyệt • 1 tạm khóa</p></div>}
                  {selected.logs && <div className="mb-4"><h5 className="text-[10px] font-extrabold text-[var(--color-primary)] uppercase tracking-widest mb-1">Nhật ký hệ thống</h5><p className="text-[10px] text-black/40 font-medium">24h qua: 1,247 bản ghi</p></div>}
                  <hr className="border-black/5 my-4" />
                  <div className="text-center"><p className="text-[9px] text-black/20 font-bold uppercase tracking-widest">🔒 Bảo mật — AI Study Hub Quản trị</p><p className="text-[8px] text-black/15 mt-0.5">Chữ ký số: SHA-256 đã xác thực</p></div>
                </div>
                <div className="flex gap-3">
                  <motion.button whileTap={{ scale: 0.97 }} className="flex-1 h-11 rounded-[14px] bg-gradient-to-r from-[#ff8a00] to-[#ff5c00] text-white font-bold text-[12px] flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all"><i className="bi bi-download" /> Lưu tệp về máy</motion.button>
                  <button className="h-11 px-5 rounded-[14px] bg-black/[0.03] text-black/60 font-semibold text-[12px] flex items-center gap-2 hover:bg-black/[0.06] cursor-pointer transition-colors active:scale-[0.97]"><i className="bi bi-printer" /> In ấn</button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
