// Tab 4: Thống kê & AI — Dashboard-synced theme
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { GEMINI_SAMPLE_QUESTIONS } from '../mock/admin.mock.js';

export default function AnalyticsTab({ systemLogs, onLog }) {
  const [prompt, setPrompt] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const logEndRef = useRef(null);
  const chatEndRef = useRef(null);

  useEffect(() => { logEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [systemLogs]);
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [chatHistory]);

  const handleSend = async (text) => {
    const q = text || prompt;
    if (!q.trim()) return;
    setChatHistory(prev => [...prev, { role: 'user', text: q }]);
    setPrompt(''); setIsTyping(true);
    onLog?.('INFO', `[AI] Truy vấn: "${q.substring(0, 50)}..."`);
    await new Promise(r => setTimeout(r, 1200 + Math.random() * 800));
    setChatHistory(prev => [...prev, { role: 'assistant', text: `Dựa trên phân tích của AI, câu trả lời cho "${q.substring(0, 40)}..." là: Đây là chủ đề quan trọng. Hệ thống ghi nhận ${Math.floor(Math.random() * 500 + 100)} tài liệu liên quan. Xử lý trong ${(Math.random() * 200 + 50).toFixed(0)}ms.` }]);
    setIsTyping(false);
  };

  const getLogColor = (l) => l === 'ERROR' ? 'text-red-400' : l === 'WARN' ? 'text-amber-400' : 'text-emerald-400';
  const fmtTime = (iso) => { try { return new Date(iso).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }); } catch { return '--:--:--'; } };

  const metrics = [
    { label: 'Tải CPU', value: '34%', icon: 'bi-cpu', color: '#007aff', status: 'Bình thường' },
    { label: 'Độ trễ AI', value: '127ms', icon: 'bi-lightning-charge', color: 'var(--color-primary)', status: 'Bình thường' },
    { label: 'Trạng thái API', value: '200 OK', icon: 'bi-wifi', color: '#34c759', status: 'Hoạt động' },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {metrics.map((m, i) => (
          <div key={i} className="bg-white border border-black/[0.04] rounded-[20px] p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `color-mix(in srgb, ${m.color} 10%, transparent)` }}>
                <i className={`bi ${m.icon} text-[16px]`} style={{ color: m.color }} />
              </div>
              <span className="text-[11px] font-semibold text-black/40">{m.label}</span>
            </div>
            <div className="text-[22px] font-extrabold text-[#1d1d1f] tracking-tight leading-none mb-1">{m.value}</div>
            <span className="text-[10px] font-bold text-[#34c759] bg-[#34c759]/10 px-2 py-0.5 rounded-full">{m.status}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Gemini Sandbox */}
        <div className="bg-white border border-black/[0.04] rounded-[20px] shadow-sm flex flex-col overflow-hidden" style={{ height: 400 }}>
          <div className="px-5 py-3 border-b border-black/[0.03] flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#ff8a00] to-[#ff5c00] flex items-center justify-center"><i className="bi bi-stars text-white text-[12px]" /></div>
            <h3 className="font-bold text-[13px] text-[#1d1d1f]">Gemini Sandbox</h3>
          </div>
          <div className="px-4 py-2.5 flex gap-2 flex-wrap border-b border-black/[0.02] bg-black/[0.01]">
            {GEMINI_SAMPLE_QUESTIONS.map((q, i) => (
              <button key={i} onClick={() => handleSend(q)} className="text-[10px] font-semibold text-[var(--color-primary)] bg-[var(--color-primary)]/[0.06] hover:bg-[var(--color-primary)]/[0.12] px-3 py-1.5 rounded-full transition-colors cursor-pointer active:scale-[0.95] truncate max-w-[180px]">{q}</button>
            ))}
          </div>
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2.5">
            {chatHistory.length === 0 && <div className="flex flex-col items-center justify-center h-full text-black/20"><i className="bi bi-chat-square-dots text-[28px] mb-2" /><p className="text-[11px] font-semibold">Chọn câu hỏi mẫu hoặc nhập câu hỏi tùy ý</p></div>}
            {chatHistory.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-[12px] font-medium leading-relaxed ${msg.role === 'user' ? 'bg-gradient-to-r from-[#ff8a00] to-[#ff5c00] text-white rounded-br-lg shadow-sm' : 'bg-black/[0.03] text-[#1d1d1f] border border-black/[0.04] rounded-bl-lg'}`}>{msg.text}</div>
              </div>
            ))}
            {isTyping && <div className="flex justify-start"><div className="bg-black/[0.03] border border-black/[0.04] rounded-2xl rounded-bl-lg px-4 py-3 flex gap-1.5">{[0, 150, 300].map(d => <div key={d} className="w-2 h-2 bg-black/20 rounded-full animate-bounce" style={{ animationDelay: `${d}ms` }} />)}</div></div>}
            <div ref={chatEndRef} />
          </div>
          <div className="px-4 py-3 border-t border-black/[0.03] flex gap-2">
            <input value={prompt} onChange={e => setPrompt(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} placeholder="Nhập câu hỏi cho AI..." className="flex-1 h-9 bg-black/[0.02] border border-black/[0.06] rounded-xl px-3 text-[12px] font-medium outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/10 transition-all" />
            <motion.button whileTap={{ scale: 0.9 }} onClick={() => handleSend()} className="w-9 h-9 rounded-xl bg-gradient-to-r from-[#ff8a00] to-[#ff5c00] text-white flex items-center justify-center shadow-md shadow-[var(--color-primary)]/15 cursor-pointer"><i className="bi bi-send-fill text-[12px]" /></motion.button>
          </div>
        </div>

        {/* Log Console */}
        <div className="bg-[#1d1d1f] rounded-[20px] border border-black/20 shadow-sm flex flex-col overflow-hidden" style={{ height: 400 }}>
          <div className="px-5 py-3 border-b border-white/5 flex items-center gap-3">
            <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-[#ff5f57]" /><div className="w-3 h-3 rounded-full bg-[#febc2e]" /><div className="w-3 h-3 rounded-full bg-[#28c840]" /></div>
            <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest font-mono">Nhật ký hệ thống</span>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-0.5 font-mono">
            {systemLogs.map((log, i) => (
              <div key={i} className="flex gap-3 text-[10px] leading-relaxed hover:bg-white/[0.03] px-2 py-1 rounded-md transition-colors">
                <span className="text-white/20 shrink-0">{fmtTime(log.time)}</span>
                <span className={`font-bold shrink-0 w-12 ${getLogColor(log.level)}`}>{log.level}</span>
                <span className="text-white/50 break-all">{log.message}</span>
              </div>
            ))}
            <div ref={logEndRef} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
