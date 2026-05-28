// Tab 2: Người dùng — Dashboard-synced theme
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ADMIN_USERS } from '../mock/admin.mock.js';

export default function UsersTab({ onLog }) {
  const [users, setUsers] = useState(ADMIN_USERS);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'Student' });

  const filtered = users.filter(u => {
    const q = search.toLowerCase();
    return (!q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q))
      && (roleFilter === 'All' || u.role === roleFilter)
      && (statusFilter === 'All' || u.status === statusFilter);
  });

  const roleLabel = (r) => ({ Student: 'Sinh viên', Tutor: 'Trợ giảng', Admin: 'Quản trị' }[r] || r);
  const statusLabel = (s) => ({ Active: 'Hoạt động', Pending: 'Chờ duyệt', Suspended: 'Tạm khóa' }[s] || s);
  const statusClass = (s) => s === 'Active' ? 'bg-[#34c759]/10 text-[#34c759]' : s === 'Pending' ? 'bg-[#ff9500]/10 text-[#ff9500]' : 'bg-[#ff3b30]/10 text-[#ff3b30]';
  const statusDot = (s) => s === 'Active' ? 'bg-[#34c759]' : s === 'Pending' ? 'bg-[#ff9500]' : 'bg-[#ff3b30]';

  const handleAdd = () => {
    if (!newUser.name.trim() || !newUser.email.trim()) return;
    setUsers(prev => [{ ...newUser, id: 'u' + Date.now(), status: 'Active', joined: new Date().toISOString().split('T')[0] }, ...prev]);
    setShowAddModal(false); setNewUser({ name: '', email: '', role: 'Student' });
    onLog?.('INFO', `[ADMIN] Đã thêm người dùng "${newUser.name}"`);
  };

  const handleChangeRole = (id, role) => { setUsers(prev => prev.map(u => u.id === id ? { ...u, role } : u)); onLog?.('INFO', `[ADMIN] Đã đổi vai trò #${id} → ${role}`); };
  const handleChangeStatus = (id, status) => { setUsers(prev => prev.map(u => u.id === id ? { ...u, status } : u)); onLog?.('WARN', `[ADMIN] Đã đổi trạng thái #${id} → ${status}`); };
  const handleDelete = (id) => { setUsers(prev => prev.filter(u => u.id !== id)); onLog?.('ERROR', `[ADMIN] Đã xóa người dùng #${id}`); };

  const SelectBox = ({ value, options, onChange, labels = {} }) => (
    <select value={value} onChange={e => onChange(e.target.value)} className="appearance-none bg-black/[0.02] border border-black/[0.06] rounded-xl h-9 px-3 text-[12px] font-semibold text-[#1d1d1f] outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/10 transition-all cursor-pointer">
      {options.map(o => <option key={o} value={o}>{labels[o] || o}</option>)}
    </select>
  );

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      {/* Toolbar */}
      <div className="bg-white border border-black/[0.04] rounded-[20px] p-4 shadow-sm flex flex-col lg:flex-row justify-between gap-4">
        <div>
          <h2 className="text-[17px] font-extrabold text-[#1d1d1f] tracking-tight">Quản lý người dùng</h2>
          <p className="text-[11px] text-black/40 font-medium mt-0.5">Phân quyền, trạng thái và quản lý tài khoản thành viên</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <i className="bi bi-search absolute left-3 top-1/2 -translate-y-1/2 text-black/30 text-[12px]" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm kiếm..." className="h-9 pl-8 pr-3 bg-black/[0.02] border border-black/[0.06] rounded-xl text-[12px] font-medium outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/10 transition-all w-44" />
          </div>
          <SelectBox value={roleFilter} options={['All', 'Student', 'Tutor', 'Admin']} onChange={setRoleFilter} labels={{ All: 'Tất cả vai trò', Student: 'Sinh viên', Tutor: 'Trợ giảng', Admin: 'Quản trị' }} />
          <SelectBox value={statusFilter} options={['All', 'Active', 'Pending', 'Suspended']} onChange={setStatusFilter} labels={{ All: 'Tất cả TT', Active: 'Hoạt động', Pending: 'Chờ duyệt', Suspended: 'Tạm khóa' }} />
          <motion.button whileTap={{ scale: 0.97 }} onClick={() => setShowAddModal(true)} className="h-9 px-4 bg-gradient-to-r from-[#ff8a00] to-[#ff5c00] text-white rounded-xl text-[12px] font-bold flex items-center gap-1.5 shadow-md shadow-[var(--color-primary)]/15 hover:opacity-90 cursor-pointer transition-all">
            <i className="bi bi-plus-lg text-[13px]" /> Thêm mới
          </motion.button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-black/[0.04] rounded-[20px] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead><tr className="bg-black/[0.015]">
              {['Người dùng', 'Email', 'Vai trò', 'Trạng thái', 'Ngày tham gia', ''].map((h, i) => (
                <th key={i} className="px-5 py-3 text-[10px] font-extrabold text-black/40 uppercase tracking-widest">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id} className="border-b border-black/[0.02] last:border-0 hover:bg-black/[0.01] transition-colors">
                  <td className="px-5 py-3"><div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-[12px] text-white shrink-0" style={{ background: `hsl(${(u.name.charCodeAt(0) * 37) % 360}, 50%, 55%)` }}>{u.name.charAt(0)}</div>
                    <span className="font-semibold text-[12.5px] text-[#1d1d1f]">{u.name}</span>
                  </div></td>
                  <td className="px-5 py-3 text-[11px] text-black/45 font-medium">{u.email}</td>
                  <td className="px-5 py-3"><SelectBox value={u.role} options={['Student', 'Tutor', 'Admin']} onChange={v => handleChangeRole(u.id, v)} labels={{ Student: 'Sinh viên', Tutor: 'Trợ giảng', Admin: 'Quản trị' }} /></td>
                  <td className="px-5 py-3"><SelectBox value={u.status} options={['Active', 'Pending', 'Suspended']} onChange={v => handleChangeStatus(u.id, v)} labels={{ Active: 'Hoạt động', Pending: 'Chờ duyệt', Suspended: 'Tạm khóa' }} /></td>
                  <td className="px-5 py-3 text-[11px] font-medium text-black/40">{u.joined}</td>
                  <td className="px-5 py-3 text-right">
                    <button onClick={() => handleDelete(u.id)} className="w-8 h-8 rounded-lg text-black/20 hover:bg-red-500/10 hover:text-red-500 flex items-center justify-center transition-all cursor-pointer" title="Xóa">
                      <i className="bi bi-trash3 text-[13px]" />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={6} className="text-center py-16 text-black/25 font-semibold text-[13px]">Không tìm thấy kết quả phù hợp</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[999] flex items-center justify-center bg-black/20 backdrop-blur-sm" onClick={() => setShowAddModal(false)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 25 }} onClick={e => e.stopPropagation()} className="bg-white rounded-[24px] p-7 w-full max-w-md shadow-[0_20px_60px_rgba(0,0,0,0.08)] border border-black/[0.06]">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-[17px] font-extrabold text-[#1d1d1f] tracking-tight">Thêm thành viên mới</h3>
                <button onClick={() => setShowAddModal(false)} className="w-8 h-8 rounded-full bg-black/[0.03] hover:bg-black/[0.06] flex items-center justify-center text-black/40 transition-colors cursor-pointer"><i className="bi bi-x-lg text-[12px]" /></button>
              </div>
              <div className="space-y-4">
                <div><label className="text-[10px] font-bold text-black/40 uppercase tracking-widest block mb-1.5">Họ và tên</label>
                  <input value={newUser.name} onChange={e => setNewUser(p => ({ ...p, name: e.target.value }))} className="w-full h-11 bg-black/[0.02] border border-black/[0.06] rounded-[14px] px-4 text-[13px] font-semibold outline-none focus:border-[var(--color-primary)] focus:ring-[3px] focus:ring-[var(--color-primary)]/10 transition-all" placeholder="Nguyễn Văn A" /></div>
                <div><label className="text-[10px] font-bold text-black/40 uppercase tracking-widest block mb-1.5">Địa chỉ email</label>
                  <input value={newUser.email} onChange={e => setNewUser(p => ({ ...p, email: e.target.value }))} className="w-full h-11 bg-black/[0.02] border border-black/[0.06] rounded-[14px] px-4 text-[13px] font-semibold outline-none focus:border-[var(--color-primary)] focus:ring-[3px] focus:ring-[var(--color-primary)]/10 transition-all" placeholder="email@university.edu.vn" /></div>
                <div><label className="text-[10px] font-bold text-black/40 uppercase tracking-widest block mb-1.5">Vai trò</label>
                  <SelectBox value={newUser.role} options={['Student', 'Tutor', 'Admin']} onChange={v => setNewUser(p => ({ ...p, role: v }))} labels={{ Student: 'Sinh viên', Tutor: 'Trợ giảng', Admin: 'Quản trị' }} /></div>
              </div>
              <div className="flex gap-3 mt-7">
                <button onClick={() => setShowAddModal(false)} className="flex-1 h-11 rounded-[14px] bg-black/[0.03] text-black/60 font-semibold text-[12px] hover:bg-black/[0.06] transition-colors cursor-pointer active:scale-[0.98]">Hủy bỏ</button>
                <motion.button whileTap={{ scale: 0.97 }} onClick={handleAdd} className="flex-1 h-11 rounded-[14px] bg-gradient-to-r from-[#ff8a00] to-[#ff5c00] text-white font-bold text-[12px] shadow-md shadow-[var(--color-primary)]/15 cursor-pointer transition-all">Thêm ngay</motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
