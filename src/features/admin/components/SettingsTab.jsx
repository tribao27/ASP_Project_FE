// Tab 5: Cài đặt — Dashboard-synced theme
import { useState } from 'react';
import { motion } from 'framer-motion';

function Toggle({ label, desc, defaultChecked = false }) {
  const [on, setOn] = useState(defaultChecked);
  return (
    <div className="flex items-center justify-between p-4 rounded-[14px] bg-black/[0.015] border border-black/[0.04] hover:border-black/[0.08] transition-colors">
      <div>
        <div className="text-[13px] font-semibold text-[#1d1d1f]">{label}</div>
        <div className="text-[11px] text-black/40 font-medium mt-0.5">{desc}</div>
      </div>
      <button onClick={() => setOn(!on)} className={`relative w-11 h-[26px] rounded-full transition-colors duration-300 cursor-pointer shrink-0 ml-4 ${on ? 'bg-gradient-to-r from-[#ff8a00] to-[#ff5c00] shadow-sm shadow-[var(--color-primary)]/20' : 'bg-black/10'}`}>
        <div className={`absolute top-[3px] w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 ${on ? 'translate-x-[22px]' : 'translate-x-[3px]'}`} />
      </button>
    </div>
  );
}

export default function SettingsTab({ onLog }) {
  const [name, setName] = useState('Alex Rivera');
  const [email, setEmail] = useState('alex.rivera@university.edu');

  const handleSave = () => { onLog?.('INFO', `[SETTINGS] Đã cập nhật hồ sơ Admin: ${name} <${email}>`); };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5 max-w-3xl">
      {/* Admin Profile */}
      <div className="bg-white border border-black/[0.04] rounded-[20px] p-6 shadow-sm">
        <h3 className="text-[15px] font-extrabold text-[#1d1d1f] tracking-tight mb-5 flex items-center gap-2">
          <i className="bi bi-person-gear text-[var(--color-primary)]" /> Tài khoản quản trị viên
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-bold text-black/40 uppercase tracking-widest block mb-1.5">Họ và tên</label>
            <input value={name} onChange={e => setName(e.target.value)} className="w-full h-11 bg-black/[0.02] border border-black/[0.06] rounded-[14px] px-4 text-[13px] font-semibold text-[#1d1d1f] outline-none focus:border-[var(--color-primary)] focus:ring-[3px] focus:ring-[var(--color-primary)]/10 transition-all" />
          </div>
          <div>
            <label className="text-[10px] font-bold text-black/40 uppercase tracking-widest block mb-1.5">Địa chỉ email</label>
            <input value={email} onChange={e => setEmail(e.target.value)} className="w-full h-11 bg-black/[0.02] border border-black/[0.06] rounded-[14px] px-4 text-[13px] font-semibold text-[#1d1d1f] outline-none focus:border-[var(--color-primary)] focus:ring-[3px] focus:ring-[var(--color-primary)]/10 transition-all" />
          </div>
        </div>
      </div>

      {/* Platform Toggles */}
      <div className="bg-white border border-black/[0.04] rounded-[20px] p-6 shadow-sm">
        <h3 className="text-[15px] font-extrabold text-[#1d1d1f] tracking-tight mb-5 flex items-center gap-2">
          <i className="bi bi-sliders text-[#007aff]" /> Cấu hình nền tảng
        </h3>
        <div className="space-y-3">
          <Toggle label="Phân loại tự động bằng AI" desc="Tự động phân loại học liệu khi tải lên bằng trí tuệ nhân tạo" defaultChecked={true} />
          <Toggle label="Báo cáo email hàng tuần" desc="Gửi báo cáo tổng hợp qua email mỗi thứ Hai hàng tuần" defaultChecked={true} />
          <Toggle label="Chế độ bảo trì" desc="Bật chế độ bảo trì — người dùng sẽ thấy thông báo tạm ngưng" defaultChecked={false} />
          <Toggle label="Sao lưu tự động hàng ngày" desc="Tự động sao lưu toàn bộ dữ liệu lúc 00:00 mỗi ngày" defaultChecked={true} />
          <Toggle label="Giới hạn truy vấn API" desc="Giới hạn số lượng request API cho mỗi người dùng" defaultChecked={true} />
        </div>
      </div>

      {/* Save */}
      <div className="flex justify-end">
        <motion.button whileTap={{ scale: 0.97 }} onClick={handleSave} className="h-11 px-8 bg-gradient-to-r from-[#ff8a00] to-[#ff5c00] text-white rounded-[14px] font-bold text-[12px] shadow-lg shadow-[var(--color-primary)]/20 hover:shadow-xl hover:shadow-[var(--color-primary)]/30 cursor-pointer transition-all">
          Lưu toàn bộ cấu hình
        </motion.button>
      </div>
    </motion.div>
  );
}
