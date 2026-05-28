// Tab 3: Tài liệu — Dashboard-synced theme
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ADMIN_DOCS } from '../mock/admin.mock.js';

export default function ContentTab({ onLog }) {
  const [docs, setDocs] = useState(ADMIN_DOCS);
  const [catFilter, setCatFilter] = useState('All');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [summaries, setSummaries] = useState({});
  const [summarizing, setSummarizing] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const filtered = docs.filter(d => catFilter === 'All' || d.category === catFilter);
  const cats = ['All', 'Giáo trình', 'Bài tập', 'Slide bài giảng'];
  const catLabel = { All: 'Tất cả', 'Giáo trình': 'Giáo trình', 'Bài tập': 'Bài tập', 'Slide bài giảng': 'Slide' };
  const catIcon = (c) => c === 'Giáo trình' ? 'bi-book-half' : c === 'Bài tập' ? 'bi-pencil-square' : 'bi-easel2-fill';

  const handleAISummary = async (docId, docName) => {
    setSummarizing(docId);
    onLog?.('INFO', `[AI] Đang tóm tắt "${docName}"...`);
    await new Promise(r => setTimeout(r, 1500 + Math.random() * 1000));
    const s = `Tài liệu "${docName}" bao gồm: Tổng quan lý thuyết nền tảng, phân tích mô hình ứng dụng, bài tập thực hành và case study minh họa. Phù hợp cho sinh viên năm 3-4 chuyên ngành CNTT.`;
    setSummaries(prev => ({ ...prev, [docId]: s }));
    setSummarizing(null);
    onLog?.('INFO', `[AI] Hoàn tất tóm tắt "${docName}"`);
  };

  const handleDelete = (id) => { setDocs(prev => prev.filter(d => d.id !== id)); onLog?.('WARN', `[CONTENT] Đã xóa tài liệu #${id}`); };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      {/* Drop Zone */}
      <div
        className={`bg-white/60 backdrop-blur-xl rounded-[20px] border-2 border-dashed p-8 text-center transition-all cursor-pointer group ${isDragOver ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5' : 'border-black/10 hover:border-[var(--color-primary)]/40'}`}
        onDragOver={e => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={e => { e.preventDefault(); setIsDragOver(false); setShowUploadModal(true); }}
        onClick={() => setShowUploadModal(true)}
      >
        <div className="w-14 h-14 rounded-full bg-white shadow-md shadow-[var(--color-primary)]/10 flex items-center justify-center mx-auto mb-3 group-hover:-translate-y-1 transition-transform border border-black/5">
          <i className="bi bi-cloud-upload text-[var(--color-primary)] text-[24px] group-hover:scale-110 transition-transform" />
        </div>
        <p className="text-[13px] font-extrabold text-[#1d1d1f] mb-1">Kéo thả tài liệu vào đây</p>
        <p className="text-[11px] text-black/40 font-medium">hoặc <span className="text-[var(--color-primary)] font-semibold">chọn từ máy tính</span> — PDF, DOCX, PPTX — Tối đa 50MB</p>
      </div>

      {/* Filter + Title */}
      <div className="bg-white border border-black/[0.04] rounded-[20px] p-4 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="text-[17px] font-extrabold text-[#1d1d1f] tracking-tight">Quản lý tài liệu</h2>
          <p className="text-[11px] text-black/40 font-medium mt-0.5">Kiểm duyệt, phân tích và quản lý học liệu hệ thống</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {cats.map(cat => (
            <button key={cat} onClick={() => setCatFilter(cat)} className={`h-8 px-3.5 rounded-xl text-[11px] font-bold transition-all cursor-pointer active:scale-[0.95] ${catFilter === cat ? 'bg-gradient-to-r from-[#ff8a00] to-[#ff5c00] text-white shadow-md shadow-[var(--color-primary)]/15' : 'bg-black/[0.03] text-black/50 hover:bg-black/[0.06]'}`}>
              {catLabel[cat]}
            </button>
          ))}
        </div>
      </div>

      {/* Document Cards */}
      <div className="space-y-3">
        {filtered.map(doc => (
          <motion.div key={doc.id} layout className="bg-white border border-black/[0.04] rounded-[20px] p-5 shadow-sm hover:shadow-md transition-all">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
              <div className="flex items-start gap-4 flex-1 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)]/[0.08] flex items-center justify-center shrink-0">
                  <i className={`bi ${catIcon(doc.category)} text-[17px] text-[var(--color-primary)]`} />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-bold text-[13px] text-[#1d1d1f] truncate">{doc.name}</h4>
                  <div className="flex items-center gap-2 mt-1 text-[10px] text-black/40 font-medium flex-wrap">
                    <span>{doc.category}</span><span className="text-black/15">•</span><span>{doc.owner}</span><span className="text-black/15">•</span><span>{doc.size}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <motion.button whileTap={{ scale: 0.95 }} onClick={() => handleAISummary(doc.id, doc.name)} disabled={summarizing === doc.id || !!summaries[doc.id]}
                  className={`h-8 px-3 rounded-xl text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${summaries[doc.id] ? 'bg-black/[0.03] text-black/30 cursor-default' : 'bg-[var(--color-primary)]/[0.08] text-[var(--color-primary)] hover:bg-[var(--color-primary)]/15'}`}>
                  {summarizing === doc.id ? (<><div className="w-3 h-3 border-2 border-[var(--color-primary)]/30 border-t-[var(--color-primary)] rounded-full animate-spin" /> Đang xử lý...</>) : summaries[doc.id] ? (<><i className="bi bi-check-circle" /> Đã tóm tắt</>) : (<><i className="bi bi-stars" /> AI Tóm Tắt</>)}
                </motion.button>
                <button onClick={() => handleDelete(doc.id)} className="w-8 h-8 rounded-lg text-black/20 hover:bg-red-500/10 hover:text-red-500 flex items-center justify-center transition-all cursor-pointer"><i className="bi bi-trash3 text-[13px]" /></button>
              </div>
            </div>
            {/* AI Summary */}
            <AnimatePresence>
              {summaries[doc.id] && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mt-4 p-4 rounded-[14px] bg-[var(--color-primary)]/[0.04] border border-[var(--color-primary)]/10">
                  <div className="flex items-center gap-2 mb-2"><i className="bi bi-stars text-[var(--color-primary)] text-[12px]" /><span className="text-[10px] font-extrabold text-[var(--color-primary)] uppercase tracking-widest">Tóm tắt bởi AI</span></div>
                  <p className="text-[12px] text-[#1d1d1f] leading-relaxed font-medium">{summaries[doc.id]}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* Upload Modal */}
      <AnimatePresence>
        {showUploadModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[999] flex items-center justify-center bg-black/20 backdrop-blur-sm" onClick={() => setShowUploadModal(false)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 25 }} onClick={e => e.stopPropagation()} className="bg-white rounded-[24px] p-7 w-full max-w-md shadow-[0_20px_60px_rgba(0,0,0,0.08)] border border-black/[0.06] text-center">
              <h3 className="text-[17px] font-extrabold text-[#1d1d1f] mb-5">Tải tài liệu lên</h3>
              <div className="border-2 border-dashed border-black/10 rounded-2xl p-10 mb-5 hover:border-[var(--color-primary)]/40 transition-colors">
                <i className="bi bi-file-earmark-arrow-up text-[32px] text-black/20 mb-3 block" />
                <p className="text-[12px] font-semibold text-black/50">Chọn tệp từ máy tính</p>
                <p className="text-[10px] text-black/30 mt-1">PDF, DOCX, PPTX — Tối đa 50MB</p>
              </div>
              <motion.button whileTap={{ scale: 0.97 }} onClick={() => setShowUploadModal(false)} className="w-full h-11 rounded-[14px] bg-gradient-to-r from-[#ff8a00] to-[#ff5c00] text-white font-bold text-[12px] shadow-md shadow-[var(--color-primary)]/15 cursor-pointer transition-all">Tải lên</motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
