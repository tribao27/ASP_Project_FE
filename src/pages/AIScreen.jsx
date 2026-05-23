/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from 'react';
import { Button, Tooltip, message, Drawer } from 'antd';
import { motion, AnimatePresence } from 'framer-motion';
import FileIcon from '../components/FileIcon.jsx';
import { getFileTagColor, getFileTypeLabel } from '../utils/helpers.js';

/**
 * Premium AIScreen Redesign — Ultra-Premium Apple Pages/Keynote Inspector & iMessage style.
 * Uses a soft warm background, card layers, high-end floating input bar, and dynamic typography.
 */
export default function AIScreen({
  documents = [],
  activeDoc = null,
  searchTerm = '',
  onSelectActiveDoc,
  accentColor,
}) {
  const [localSearch, setLocalSearch] = useState('');
  const [activeTab, setActiveTab] = useState('summary'); // 'summary' | 'qna' | 'settings'
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: 'Xin chào! Tôi là Trợ lý Học tập AI thế hệ mới của bạn. Hãy liên kết một tài liệu bên trái để tôi bắt đầu phân tích sâu sắc các tri thức học thuật nhé! ✨',
      time: 'Vừa xong',
    },
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [showMobileFiles, setShowMobileFiles] = useState(false);
  const [showMobileInspector, setShowMobileInspector] = useState(false);

  const scrollContainerRef = useRef(null);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isTyping]);

  useEffect(() => {
    if (activeDoc) {
      setMessages([
        {
          id: 'sys_' + Date.now(),
          sender: 'ai',
          text: `🎯 Đã liên kết thành công với tài liệu: "${activeDoc.name}".\n\nTôi đã lập chỉ mục và thấu hiểu tri thức bên trong tài liệu này. Bạn có thể sử dụng các lệnh hành động nhanh bên dưới hoặc đặt câu hỏi bất kỳ!`,
          time: 'Vừa xong',
        },
      ]);
    }
  }, [activeDoc]);

  const handleSendMessage = async (textToSend) => {
    const text = textToSend || inputVal;
    if (!text.trim()) return;

    const userMsg = {
      id: 'usr_' + Date.now(),
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputVal('');

    // Simulated high-end generative response
    setIsTyping(true);
    await new Promise((resolve) => setTimeout(resolve, 1400));
    setIsTyping(false);

    let reply = 'Tôi xin lỗi, vui lòng liên kết tài liệu để tôi hỗ trợ phân tích sâu hơn.';
    if (activeDoc) {
      if (text.toLowerCase().includes('tóm tắt')) {
        reply = `📋 TÓM TẮT CỐT LÕI TÀI LIỆU:\n"${activeDoc.name}"\n\n1. GIỚI THIỆU CHUNG:\nTập trung giới thiệu các lý thuyết nền tảng cốt lõi và hướng dẫn thực hành tối ưu hệ thống học thuật.\n\n2. CÁC NỘI DUNG CHÍNH:\n• Phân tích sâu sắc giải thuật học máy thế hệ mới.\n• Các nghiên cứu thực nghiệm đối sánh hiệu năng hệ thống.\n\n3. KHUYẾN NGHỊ THIẾT KẾ:\nĐề xuất kiến trúc phần mềm tích hợp thông minh nhằm gia tăng hiệu suất và tối ưu hóa tài nguyên phần cứng.`;
      } else if (text.toLowerCase().includes('câu hỏi')) {
        reply = `❓ 3 CÂU HỎI ÔN TẬP TỰ KIỂM TRA:\n\n1. Giải thuật được trình bày trong tài liệu có những ưu điểm vượt trội nào so với các phương pháp truyền thống?\n\n2. Mô tả các tham số cấu hình hệ thống thực nghiệm chính được tác giả đề cập.\n\n3. Những hạn chế kỹ thuật hiện tại của phương pháp và giải pháp tối ưu tương lai là gì?`;
      } else if (text.toLowerCase().includes('thuật ngữ')) {
        reply = `📖 GIẢI THÍCH THUẬT NGỮ CHUYÊN NGÀNH:\n\n• HMR (Hot Module Replacement): Tính năng cập nhật ứng dụng tức thì không cần tải lại toàn bộ trang web.\n\n• Deep Learning (Học sâu): Phân nhánh tiên tiến của học máy mô phỏng cấu trúc thần kinh não bộ con người.\n\n• Cloud Storage (Lưu trữ đám mây): Cơ chế lưu trữ phân tán hiệu năng cao trên internet giúp truy xuất an toàn mọi lúc mọi nơi.`;
      } else {
        reply = `💡 Dựa trên phân tích đối sánh tri thức từ tài liệu "${activeDoc.name}" mà bạn cung cấp:\n\nYêu cầu đối với phần "${text}" liên quan trực tiếp tới giải thuật lõi của chương trình đào tạo sinh viên. Bạn có muốn tôi thiết kế một sơ đồ tư duy tóm lược hoặc các ví dụ thực hành cụ thể về phần này không?`;
      }
    }

    const aiMsg = {
      id: 'ai_' + Date.now(),
      sender: 'ai',
      text: reply,
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, aiMsg]);
  };

  const handleDocChange = (doc) => {
    onSelectActiveDoc(doc);
    message.success(`Đã liên kết trợ lý AI với "${doc.name}"`);
  };

  const finalSearchQuery = localSearch || searchTerm || '';
  const filteredDocs = documents.filter((d) =>
    d.name.toLowerCase().includes(finalSearchQuery.toLowerCase())
  );

  const leftContent = (
    <>
            <div className="mb-5">
              <span className="text-[10px] font-black text-black/35 uppercase tracking-widest block mb-2.5">Thư viện liên kết</span>
              <motion.div
                animate={{
                  borderColor: searchFocused ? accentColor : 'rgba(0, 0, 0, 0.05)',
                  boxShadow: searchFocused ? `0 0 12px ${accentColor}10` : '0 0 0px transparent'
                }}
                className="relative flex items-center border rounded-xl bg-black/[0.005] overflow-hidden transition-all duration-300"
              >
                <span className="absolute left-3.5 text-black/35">
                  <i className="bi bi-search text-[11.5px]" />
                </span>
                <input
                  type="text"
                  placeholder="Lọc danh sách file..."
                  value={localSearch}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  className="w-full bg-transparent pl-9.5 pr-3.5 py-2 text-black text-[12.5px] placeholder-black/25 outline-none font-semibold"
                />
              </motion.div>
            </div>

            {/* Document Cards List with Micro-animations */}
            <div className="flex-1 space-y-2 overflow-y-auto pr-1">
              <AnimatePresence>
                {filteredDocs.map((doc) => {
                  const isActive = activeDoc?.id === doc.id;
                  return (
                    <motion.button
                      key={doc.id}
                      whileHover={{ scale: 1.015, x: 2 }}
                      whileTap={{ scale: 0.985 }}
                      onClick={() => { handleDocChange(doc); setShowMobileFiles(false); }}
                      className={`w-full p-3 rounded-2xl border transition-all text-left flex items-center gap-3.5 cursor-pointer relative overflow-hidden group ${
                        isActive 
                          ? 'bg-black/[0.015] border-black/10 text-black font-extrabold shadow-sm' 
                          : 'bg-transparent border-transparent text-black/50 hover:text-black hover:bg-black/[0.005]'
                      }`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="activeDocIndicator"
                          className="absolute left-0 top-0 bottom-0 w-[3px]"
                          style={{ backgroundColor: accentColor }}
                        />
                      )}
                      
                      <div className="p-2 rounded-xl bg-white border border-black/[0.04] shadow-sm flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300">
                        <FileIcon type={doc.type} />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <p className="text-[12.5px] tracking-tight truncate font-extrabold" style={{ color: isActive ? accentColor : 'inherit' }}>
                          {doc.name}
                        </p>
                        <span className="text-[9.5px] font-bold text-black/35 uppercase mt-0.5 inline-block">{doc.size}</span>
                      </div>
                      
                      {isActive && (
                        <span className="w-1.5 h-1.5 rounded-full animate-ping" style={{ backgroundColor: accentColor }} />
                      )}
                    </motion.button>
                  );
                })}
              </AnimatePresence>
              
              {filteredDocs.length === 0 && (
                <div className="text-center text-black/25 text-[12px] font-extrabold py-16">
                  <i className="bi bi-folder-x text-[24px] block mb-1 text-black/15" />
                  Không tìm thấy tài liệu
                </div>
              )}
            </div>
    </>
  );

  const rightContent = (
    <>
            <span className="text-[10px] font-black text-black/35 uppercase tracking-widest block mb-3.5">Thông tin bổ trợ</span>

            {/* Sliding Toggle Tabs */}
            <div className="flex bg-black/[0.015] rounded-2xl p-0.5 border border-black/5 mb-5 shadow-inner shrink-0">
              {[
                { key: 'summary', label: 'Tóm tắt' },
                { key: 'qna', label: 'Mục lục' },
                { key: 'settings', label: 'Thuộc tính' },
              ].map((tab) => {
                const isActive = activeTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex-1 py-2 text-center text-[11px] font-black rounded-xl transition-all cursor-pointer ${
                      isActive 
                        ? 'bg-white text-black shadow-sm font-extrabold' 
                        : 'text-black/45 hover:text-black'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Dynamic Inspector panels */}
            <div className="flex-1 overflow-y-auto space-y-4">
              {activeDoc ? (
                <div className="space-y-5 text-left">
                  {/* File Metadata Card */}
                  <div className="bg-black/[0.005] p-3.5 rounded-2xl border border-black/[0.04] space-y-3.5 shadow-sm">
                    <p className="text-[9.5px] font-black uppercase tracking-widest" style={{ color: accentColor }}>Thông tin tệp tin</p>
                    <div className="flex gap-3 items-center">
                      <div className="p-2 rounded-xl bg-white border border-black/[0.03] shadow-sm flex items-center justify-center shrink-0">
                        <FileIcon type={activeDoc.type} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[13px] font-extrabold text-black tracking-tight truncate">{activeDoc.name}</p>
                        <p className="text-[10px] text-black/35 font-bold uppercase mt-0.5">{getFileTypeLabel(activeDoc.type)} • {activeDoc.size}</p>
                      </div>
                    </div>
                  </div>

                  <AnimatePresence mode="wait">
                    {activeTab === 'summary' && (
                      <motion.div
                        key="summary"
                        initial={{ opacity: 0, x: 12 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -12 }}
                        transition={{ duration: 0.25 }}
                        className="space-y-3"
                      >
                        <p className="text-[13px] font-extrabold text-black">Nội dung tóm lược</p>
                        <p className="text-[12px] text-black/55 leading-relaxed font-semibold bg-black/[0.005] p-3.5 rounded-2xl border border-black/[0.04] whitespace-pre-line shadow-inner">
                          {activeDoc.content || 'Không có mô tả nội dung đặc trưng cho tài liệu.'}
                        </p>
                      </motion.div>
                    )}

                    {activeTab === 'qna' && (
                      <motion.div
                        key="qna"
                        initial={{ opacity: 0, x: 12 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -12 }}
                        transition={{ duration: 0.25 }}
                        className="space-y-3"
                      >
                        <p className="text-[13px] font-extrabold text-black">Mục lục tự động lập</p>
                        <div className="bg-black/[0.005] p-3.5 rounded-2xl border border-black/[0.04] shadow-inner space-y-3">
                          {[
                            'Chương 1: Khái quát cơ sở lý thuyết',
                            'Chương 2: Kiến trúc hệ điều hành tích hợp',
                            'Chương 3: Giải thuật học sâu học máy hiện đại',
                            'Chương 4: Thực nghiệm & Đánh giá kết quả',
                          ].map((ch, idx) => (
                            <div key={idx} className="flex gap-2.5 items-start text-[12px] font-semibold text-black/50 leading-relaxed">
                              <span className="w-1.5 h-1.5 rounded-full bg-black/20 mt-2 flex-shrink-0" />
                              <span>{ch}</span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {activeTab === 'settings' && (
                      <motion.div
                        key="settings"
                        initial={{ opacity: 0, x: 12 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -12 }}
                        transition={{ duration: 0.25 }}
                        className="space-y-3"
                      >
                        <p className="text-[13px] font-extrabold text-black">Thuộc tính nâng cao</p>
                        <div className="bg-black/[0.005] p-3.5 rounded-2xl border border-black/[0.04] shadow-inner text-[11.5px] font-bold text-black/35 space-y-2.5">
                          <p className="flex justify-between">
                            <span>Định danh tệp:</span>
                            <span className="text-black/60 font-semibold">{activeDoc.id}</span>
                          </p>
                          <p className="flex justify-between">
                            <span>Ngày đồng bộ:</span>
                            <span className="text-black/60 font-semibold">{activeDoc.uploadedAt || 'Hôm nay'}</span>
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="text-center py-20 text-black/20 text-[12.5px] font-extrabold">
                  <i className="bi bi-link-45deg text-[36px] block mb-1 text-black/10" style={{ color: accentColor }} />
                  Chưa chọn tài liệu liên kết
                </div>
              )}
            </div>
    </>
  );

  return (
    <div className="flex-1 w-full h-full overflow-hidden text-left p-4 md:p-6 flex flex-col relative select-none bg-transparent">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 items-stretch overflow-hidden">
          
          {/* Left Column: Finder-like Side Inspector (lg:col-span-3) */}
          <div className="hidden lg:flex lg:col-span-3 flex-col bg-white border border-black/[0.04] rounded-3xl p-4.5 shadow-sm h-full overflow-hidden">
            {leftContent}
          </div>


          {/* Center Column: High-End iMessage-like Chat Hub (lg:col-span-6) */}
          <div className="lg:col-span-6 flex flex-col bg-white border border-black/[0.04] rounded-3xl shadow-sm h-full overflow-hidden relative">
            
            {/* Blurry Chat Header */}
            <div className="px-4 py-3 md:px-5 md:py-4.5 border-b border-black/[0.04] flex justify-between items-center bg-white/80 backdrop-blur-md z-20 shrink-0">
              <div className="flex items-center gap-2.5 md:gap-3.5">
                <button 
                  onClick={() => setShowMobileFiles(true)}
                  className="lg:hidden w-8 h-8 flex items-center justify-center rounded-xl bg-black/5 text-black/60 hover:text-black transition-colors shrink-0"
                >
                  <i className="bi bi-folder2-open text-[15px]" />
                </button>
                <div 
                  className="w-9 h-9 md:w-10 md:h-10 rounded-xl md:rounded-2xl flex items-center justify-center text-white shadow-md shadow-orange-500/10 group cursor-pointer shrink-0"
                  style={{ background: `linear-gradient(135deg, ${accentColor} 0%, ${accentColor}dd 100%)` }}
                >
                  <i className="bi bi-stars text-[15px] md:text-[17px] animate-gentle-pulse group-hover:rotate-12 transition-transform duration-300" />
                </div>
                <div className="text-left hidden sm:block">
                  <h4 className="text-[13px] md:text-[14px] font-extrabold text-[#1d1d1f] tracking-tight truncate">Trợ lý Phân tích AI</h4>
                  <span className="text-[9px] md:text-[9.5px] font-black uppercase tracking-wider block mt-0.5 flex items-center gap-1.5" style={{ color: accentColor }}>
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    Online & Sẵn sàng
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-2 shrink-0">
                {activeDoc ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-[10px] font-extrabold text-black/60 bg-black/[0.015] border border-black/5 px-2.5 py-1.5 md:px-3.5 md:py-1.5 rounded-full flex items-center gap-1.5 md:gap-2 max-w-[120px] md:max-w-[190px] shadow-sm"
                  >
                    <i className="bi bi-link-45deg text-[14px]" style={{ color: accentColor }} />
                    <span className="truncate">{activeDoc.name}</span>
                  </motion.div>
                ) : (
                  <span className="hidden sm:inline-block text-[10px] font-black text-black/25 uppercase tracking-wider bg-black/[0.005] px-3.5 py-1.5 rounded-full border border-dashed border-black/10">
                    Chưa liên kết
                  </span>
                )}
                
                <button 
                  onClick={() => setShowMobileInspector(true)}
                  className="lg:hidden w-8 h-8 flex items-center justify-center rounded-xl bg-black/5 text-black/60 hover:text-black transition-colors shrink-0"
                >
                  <i className="bi bi-info-circle text-[15px]" />
                </button>
              </div>
            </div>

            {/* Chat Bubble Flow */}
            <div ref={scrollContainerRef} className="flex-1 overflow-y-auto p-5.5 space-y-5 bg-white">
              <AnimatePresence>
                {messages.map((m) => {
                  const isAI = m.sender === 'ai';
                  return (
                    <motion.div
                      key={m.id}
                      initial={{ opacity: 0, y: 12, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      className={`flex items-start gap-3 ${isAI ? 'justify-start' : 'justify-end'}`}
                    >
                      {isAI && (
                        <div 
                          className="w-[32px] h-[32px] rounded-full flex items-center justify-center text-white text-[13px] flex-shrink-0 mt-0.5 shadow-md shadow-orange-500/10 border border-white/20"
                          style={{ background: `linear-gradient(135deg, ${accentColor} 0%, ${accentColor}dd 100%)` }}
                        >
                          <i className="bi bi-robot" />
                        </div>
                      )}
                      
                      <div className="max-w-[78%] space-y-1 text-left">
                        <div 
                          className={`px-4.5 py-3 rounded-2xl text-[13px] leading-relaxed whitespace-pre-line ${
                            isAI 
                              ? 'bg-[#e9e9eb] text-black border border-black/[0.01] shadow-sm rounded-tl-sm' 
                              : 'text-white font-semibold shadow-md rounded-tr-sm'
                          }`}
                          style={!isAI ? { background: `linear-gradient(135deg, ${accentColor} 0%, ${accentColor}dd 100%)` } : {}}
                        >
                          {m.text}
                        </div>
                        <span className={`text-[9px] font-black text-black/25 block ${!isAI ? 'text-right' : 'text-left'}`}>
                          {m.time}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {isTyping && (
                <motion.div 
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-3"
                >
                  <div 
                    className="w-[32px] h-[32px] rounded-full flex items-center justify-center text-white text-[13px] flex-shrink-0 shadow-md shadow-orange-500/10 border border-white/20"
                    style={{ background: `linear-gradient(135deg, ${accentColor} 0%, ${accentColor}dd 100%)` }}
                  >
                    <i className="bi bi-robot" />
                  </div>
                  <div className="bg-[#e9e9eb] border border-black/[0.01] px-4.5 py-3 rounded-2xl rounded-tl-sm flex items-center gap-1.5 shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full animate-bounce delay-0" style={{ backgroundColor: accentColor }} />
                    <span className="w-1.5 h-1.5 rounded-full animate-bounce delay-[0.15s]" style={{ backgroundColor: accentColor }} />
                    <span className="w-1.5 h-1.5 rounded-full animate-bounce delay-[0.3s]" style={{ backgroundColor: accentColor }} />
                  </div>
                </motion.div>
              )}
            </div>

            {/* Quick Actions (Floating Pill prompts) */}
            {activeDoc && (
              <div className="px-5 py-2.5 border-t border-black/[0.04] flex gap-2.5 overflow-x-auto bg-[#fafafb] scrollbar-none z-15">
                {[
                  { icon: 'bi-card-text', text: 'Tóm tắt tài liệu', prompt: 'Tóm tắt lý thuyết cốt lõi tài liệu' },
                  { icon: 'bi-question-circle', text: 'Tạo câu hỏi ôn tập', prompt: 'Tạo 3 câu hỏi ôn tập tự kiểm tra' },
                  { icon: 'bi-book', text: 'Giải thích thuật ngữ', prompt: 'Giải thích các thuật ngữ chuyên ngành' },
                ].map((act, i) => (
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.03, backgroundColor: 'rgba(0,0,0,0.03)' }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleSendMessage(act.prompt)}
                    className="px-3.5 py-1.5 rounded-full bg-white hover:bg-black/[0.02] border border-black/5 text-[11px] font-extrabold text-black/60 transition-all cursor-pointer flex-shrink-0 flex items-center gap-1.5 shadow-sm"
                  >
                    <i className={`bi ${act.icon}`} style={{ color: accentColor }} />
                    {act.text}
                  </motion.button>
                ))}
              </div>
            )}

            {/* High-End Floating iMessage Style Input Form */}
            <div className="p-3.5 border-t border-black/[0.04] bg-white flex items-center gap-3.5">
              <input
                type="text"
                placeholder={activeDoc ? "Hỏi trợ lý AI bất kỳ điều gì..." : "Vui lòng chọn tài liệu ở cột bên trái để trò chuyện..."}
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSendMessage(); }}
                disabled={!activeDoc}
                className="flex-1 bg-[#f4f4f7] border border-black/[0.02] rounded-full px-5 py-2.5 text-black text-[13px] font-semibold placeholder-black/35 outline-none focus:border-black/[0.08] focus:bg-white transition-all disabled:opacity-40 shadow-inner"
              />
              <motion.button
                whileHover={{ scale: 1.05, y: -0.5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSendMessage()}
                disabled={!activeDoc || !inputVal.trim()}
                className="w-[36px] h-[36px] rounded-full text-white flex items-center justify-center border-none shadow-md shadow-orange-500/10 cursor-pointer disabled:opacity-30 disabled:shadow-none transition-all flex-shrink-0"
                style={{ background: `linear-gradient(135deg, ${accentColor} 0%, ${accentColor}dd 100%)` }}
              >
                <i className="bi bi-send-fill text-[13px]" />
              </motion.button>
            </div>
          </div>

          {/* Right Column: Dynamic Apple Inspector Inspector (lg:col-span-3) */}
          <div className="hidden lg:flex lg:col-span-3 flex-col bg-white border border-black/[0.04] rounded-3xl p-4.5 shadow-sm h-full overflow-hidden">
            {rightContent}
          </div>

        </div>

        {/* Mobile Drawers */}
        <Drawer
          title={<span className="font-extrabold text-[14px]">Thư viện liên kết</span>}
          placement="left"
          onClose={() => setShowMobileFiles(false)}
          open={showMobileFiles}
          width={280}
          styles={{ body: { padding: '16px', display: 'flex', flexDirection: 'column' } }}
          className="lg:hidden"
        >
          {leftContent}
        </Drawer>

        <Drawer
          title={<span className="font-extrabold text-[14px]">Thông tin bổ trợ</span>}
          placement="right"
          onClose={() => setShowMobileInspector(false)}
          open={showMobileInspector}
          width={280}
          styles={{ body: { padding: '16px', display: 'flex', flexDirection: 'column' } }}
          className="lg:hidden"
        >
          {rightContent}
        </Drawer>
    </div>
  );
}
