// Tab 1: Tổng quan — Synced with Dashboard theme
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ACTIVITY_DATA } from '../mock/admin.mock.js';

const KPI_CARDS = [
  { label: 'Tổng người dùng', value: '12,482', change: '+12%', icon: 'bi-people-fill', color: 'var(--color-primary)' },
  { label: 'Tài liệu đã tải', value: '84,912', change: '+8%', icon: 'bi-folder2-open', color: '#007aff' },
  { label: 'Lượt truy vấn AI', value: '1.2M', change: '+24%', icon: 'bi-stars', color: '#af52de' },
  { label: 'Sức khỏe hệ thống', value: '99.9%', change: 'Ổn định', icon: 'bi-heart-pulse-fill', color: '#34c759' },
];

function ActivityChart() {
  const [hovered, setHovered] = useState(null);
  const data = ACTIVITY_DATA;
  const max = Math.max(...data.map(d => d.queries));
  const W = 560, H = 200, PAD = 30;
  const points = data.map((d, i) => ({ x: PAD + i * ((W - PAD * 2) / (data.length - 1)), y: PAD + (1 - d.queries / max) * (H - PAD * 2), ...d }));
  let pathD = `M ${points[0].x},${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const cx = (points[i].x + points[i + 1].x) / 2;
    pathD += ` C ${cx},${points[i].y} ${cx},${points[i + 1].y} ${points[i + 1].x},${points[i + 1].y}`;
  }
  const areaD = pathD + ` L ${points[points.length - 1].x},${H - PAD} L ${points[0].x},${H - PAD} Z`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.15" />
          <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0.25, 0.5, 0.75].map((r, i) => <line key={i} x1={PAD} x2={W - PAD} y1={PAD + r * (H - PAD * 2)} y2={PAD + r * (H - PAD * 2)} stroke="rgba(0,0,0,0.04)" strokeWidth="0.5" strokeDasharray="4 4" />)}
      <path d={areaD} fill="url(#areaGrad)" />
      <path d={pathD} fill="none" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" />
      {points.map((p, i) => (
        <g key={i} onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)} className="cursor-pointer">
          <circle cx={p.x} cy={p.y} r={hovered === i ? 6 : 3.5} fill={hovered === i ? 'var(--color-primary)' : 'white'} stroke="var(--color-primary)" strokeWidth="2" className="transition-all duration-200" />
          <text x={p.x} y={H - 8} textAnchor="middle" className="text-[10px] font-bold" fill="rgba(0,0,0,0.35)" style={{ fontFamily: 'inherit' }}>{p.day}</text>
          {hovered === i && (<><rect x={p.x - 38} y={p.y - 32} width="76" height="22" rx="8" fill="#1d1d1f" /><text x={p.x} y={p.y - 17} textAnchor="middle" className="text-[10px] font-bold" fill="white">{p.queries.toLocaleString()}</text></>)}
        </g>
      ))}
    </svg>
  );
}

function StorageRadial() {
  const pct = 75, r = 54, cx = 64, cy = 64, C = 2 * Math.PI * r;
  return (
    <div className="flex flex-col items-center">
      <svg width="128" height="128" viewBox="0 0 128 128">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(0,0,0,0.04)" strokeWidth="8" />
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--color-primary)" strokeWidth="8" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - pct / 100)} transform={`rotate(-90 ${cx} ${cy})`} className="transition-all duration-700" style={{ filter: 'drop-shadow(0 0 6px var(--color-primary))' }} />
        <text x={cx} y={cy - 4} textAnchor="middle" className="text-[20px] font-extrabold" fill="#1d1d1f">{pct}%</text>
        <text x={cx} y={cy + 12} textAnchor="middle" className="text-[9px] font-bold" fill="rgba(0,0,0,0.35)">Đã sử dụng</text>
      </svg>
      <div className="space-y-1.5 mt-3 w-full">
        <div className="flex justify-between text-[11px]"><span className="text-black/40 font-medium">Tài liệu</span><span className="font-bold text-[#1d1d1f]">1.2 TB</span></div>
        <div className="flex justify-between text-[11px]"><span className="text-black/40 font-medium">Còn trống</span><span className="font-bold text-[#34c759]">480 GB</span></div>
      </div>
    </div>
  );
}

const containerV = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const itemV = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } } };

export default function DashboardTab() {
  const recentUsers = [
    { name: 'Linh Nguyễn', email: 'linh.nguyen@student.edu.vn', role: 'Sinh viên', joined: '14/07/2024', status: 'Hoạt động' },
    { name: 'Kevin Vũ', email: 'kevin.vu@student.edu.vn', role: 'Sinh viên', joined: '01/06/2024', status: 'Chờ duyệt' },
    { name: 'Hà Trương', email: 'ha.truong@student.edu.vn', role: 'Sinh viên', joined: '03/08/2024', status: 'Hoạt động' },
    { name: 'Đức Phạm', email: 'duc.pham@student.edu.vn', role: 'Trợ giảng', joined: '28/02/2024', status: 'Tạm khóa' },
  ];

  return (
    <motion.div variants={containerV} initial="hidden" animate="show" className="space-y-5">
      {/* KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {KPI_CARDS.map((kpi, i) => (
          <motion.div key={i} variants={itemV} whileHover={{ y: -3, scale: 1.01 }} className="bg-white border border-black/[0.04] rounded-[20px] p-5 shadow-sm hover:shadow-md transition-all relative overflow-hidden group cursor-default">
            <div className="absolute -right-4 -top-4 w-20 h-20 rounded-full blur-[25px] pointer-events-none opacity-[0.06]" style={{ background: kpi.color }} />
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `color-mix(in srgb, ${kpi.color} 10%, transparent)` }}>
                <i className={`bi ${kpi.icon} text-[17px]`} style={{ color: kpi.color }} />
              </div>
              <span className="text-[10px] font-bold text-[#34c759] bg-[#34c759]/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                <i className="bi bi-arrow-up-right text-[9px]" /> {kpi.change}
              </span>
            </div>
            <div className="text-[24px] font-extrabold text-[#1d1d1f] tracking-tight leading-none mb-0.5">{kpi.value}</div>
            <div className="text-[11px] font-semibold text-black/40">{kpi.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Chart + Storage */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <motion.div variants={itemV} className="xl:col-span-2 bg-white border border-black/[0.04] rounded-[20px] p-5 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-extrabold text-[14px] text-[#1d1d1f] tracking-tight">Hoạt động hệ thống</h3>
            <span className="text-[10px] font-bold text-black/40 bg-black/[0.03] px-3 py-1 rounded-full">Tuần này</span>
          </div>
          <ActivityChart />
        </motion.div>
        <motion.div variants={itemV} className="bg-white border border-black/[0.04] rounded-[20px] p-5 shadow-sm flex flex-col items-center justify-center">
          <div className="flex items-center gap-2 mb-4 self-start">
            <i className="bi bi-cloud-fill text-black/30 text-[14px]" />
            <h3 className="font-extrabold text-[14px] text-[#1d1d1f] tracking-tight">Bộ nhớ đám mây</h3>
          </div>
          <StorageRadial />
        </motion.div>
      </div>

      {/* Recent Registrations */}
      <motion.div variants={itemV} className="bg-white border border-black/[0.04] rounded-[20px] shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-black/[0.03]">
          <h3 className="font-extrabold text-[14px] text-[#1d1d1f] tracking-tight">Đăng ký gần đây</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead><tr className="bg-black/[0.015]">
              {['Người dùng', 'Vai trò', 'Ngày tham gia', 'Trạng thái'].map((h, i) => (
                <th key={i} className="px-5 py-3 text-[10px] font-extrabold text-black/40 uppercase tracking-widest">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {recentUsers.map((u, i) => (
                <tr key={i} className="border-b border-black/[0.02] last:border-0 hover:bg-black/[0.01] transition-colors">
                  <td className="px-5 py-3"><div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-[12px] text-white shrink-0 shadow-sm" style={{ background: `hsl(${(u.name.charCodeAt(0) * 37) % 360}, 50%, 55%)` }}>{u.name.charAt(0)}</div>
                    <div><div className="font-semibold text-[12.5px] text-[#1d1d1f]">{u.name}</div><div className="text-[10px] text-black/35 font-medium">{u.email}</div></div>
                  </div></td>
                  <td className="px-5 py-3"><span className="text-[11px] font-semibold text-black/50 bg-black/[0.03] px-2.5 py-1 rounded-full">{u.role}</span></td>
                  <td className="px-5 py-3 text-[11px] font-medium text-black/40">{u.joined}</td>
                  <td className="px-5 py-3">
                    <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full ${u.status === 'Hoạt động' ? 'bg-[#34c759]/10 text-[#34c759]' : u.status === 'Chờ duyệt' ? 'bg-[#ff9500]/10 text-[#ff9500]' : 'bg-[#ff3b30]/10 text-[#ff3b30]'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${u.status === 'Hoạt động' ? 'bg-[#34c759]' : u.status === 'Chờ duyệt' ? 'bg-[#ff9500]' : 'bg-[#ff3b30]'}`} />{u.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
}
