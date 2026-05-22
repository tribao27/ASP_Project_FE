/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Button, Typography } from 'antd';
import { motion, AnimatePresence } from 'framer-motion';

const { Title, Paragraph, Text } = Typography;

export default function IntroScreen({ onNavigate }) {
  // Live breathing AI terminal simulation states
  const [terminalLines, setTerminalLines] = useState([]);
  const [terminalIndex, setTerminalIndex] = useState(0);

  const simulationData = [
    { type: 'user', text: '> Giải thích độ phức tạp thuật toán Quicksort?' },
    { type: 'ai', text: '💡 [Quicksort Complexity Analysis]\n- Tốt nhất: O(N log N) (Phân hoạch đều)\n- Trung bình: O(N log N)\n- Tồi nhất: O(N²) (Mảng đã được sắp xếp sẵn)' },
    { type: 'user', text: '> Tóm tắt chương 3 môn Đại số tuyến tính?' },
    { type: 'ai', text: '📐 [Đại số tuyến tính - Chương 3: Không gian vectơ]\n1. Định nghĩa Không gian vectơ con.\n2. Sự độc lập tuyến tính & Tập sinh.\n3. Số chiều (Dimension) và Cơ sở (Basis).' },
    { type: 'user', text: '> Lập lộ trình ôn thi môn Hệ điều hành?' },
    { type: 'ai', text: '🔥 [Lộ trình 3 ngày chinh phục OS]\n- Ngày 1: Quản lý Tiến trình & Lập lịch CPU\n- Ngày 2: Đồng bộ hóa & Luồng (Threads)\n- Ngày 3: Quản lý Bộ nhớ ảo & Giải thuật thay thế trang' }
  ];

  useEffect(() => {
    // Initial load first message
    setTerminalLines([simulationData[0]]);

    const interval = setInterval(() => {
      setTerminalIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % (simulationData.length / 2);
        const userMsg = simulationData[nextIndex * 2];
        const aiMsg = simulationData[nextIndex * 2 + 1];

        // Append messages with staggered delay
        setTerminalLines([userMsg]);
        setTimeout(() => {
          setTerminalLines([userMsg, aiMsg]);
        }, 1000);

        return nextIndex;
      });
    }, 7000);

    return () => clearInterval(interval);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <div className="bg-[#fafafb] text-[#1d1d1f] min-h-screen flex flex-col font-sans relative overflow-hidden select-none">

      {/* Visual lighting background blooms - Soft luxury Apple-style HSL glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[55%] h-[55%] bg-[#ff5c00]/3 rounded-full blur-[140px] pointer-events-none -z-10 animate-pulse duration-[8s]" />
      <div className="absolute bottom-[10%] right-[-10%] w-[50%] h-[50%] bg-[#007aff]/3 rounded-full blur-[120px] pointer-events-none -z-10 animate-pulse duration-[10s]" />
      <div className="absolute top-[35%] left-[20%] w-[40%] h-[40%] bg-[#a855f7]/2 rounded-full blur-[100px] pointer-events-none -z-10" />

      {/* Top Navigation Bar — Ultra Frosted Premium glass */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 h-[68px] premium-glass border-b border-black/[0.04] flex justify-between items-center px-6 md:px-12 z-50 shadow-sm bg-white/70 backdrop-blur-xl"
      >
        <div
          className="flex items-center gap-2.5 cursor-pointer group"
          onClick={() => onNavigate('landing')}
        >
          <div className="w-9 h-9 bg-gradient-to-br from-[#ff8a00] to-[#ff5c00] rounded-xl flex items-center justify-center orange-glow shadow-md group-hover:scale-105 transition-transform">
            <i className="bi bi-book-half text-white text-[17px]" />
          </div>
          <span className="text-[17px] font-extrabold text-[#1d1d1f] tracking-tight">AI Study Hub</span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-[13.5px] font-bold text-[#1d1d1f]/60">
          <button onClick={() => onNavigate('landing')} className="hover:text-[#ff5c00] transition-colors cursor-pointer">Trang chủ</button>
          <a href="#features-section" className="text-[#1d1d1f]/60 hover:text-[#ff5c00] transition-colors cursor-pointer no-underline">Tính năng</a>
          <button onClick={() => onNavigate('login')} className="hover:text-[#ff5c00] transition-colors cursor-pointer">Thư viện</button>
          <button onClick={() => onNavigate('login')} className="hover:text-[#ff5c00] transition-colors cursor-pointer">Cộng đồng</button>
          <button onClick={() => onNavigate('login')} className="hover:text-[#ff5c00] transition-colors cursor-pointer">Trợ lý AI</button>
        </div>

        <div className="flex items-center gap-3">
          <Button type="text" onClick={() => onNavigate('login')} className="font-extrabold text-[13.5px] text-black/75 hover:text-black !bg-transparent">
            Đăng nhập
          </Button>
          <Button type="primary" onClick={() => onNavigate('register')} className="font-extrabold text-[13.5px] rounded-xl h-10 px-5 shadow-sm">
            Đăng ký ngay
          </Button>
        </div>
      </motion.nav>

      {/* Main Content */}
      <main className="pt-[68px] flex-1">

        {/* HERO SECTION */}
        <section className="relative min-h-[640px] lg:min-h-[760px] flex items-center overflow-hidden py-16">
          <div className="max-w-7xl mx-auto px-6 md:px-12 w-full grid lg:grid-cols-12 gap-12 items-center">

            {/* Left Column: Copywriting */}
            <motion.div
              className="z-10 text-left lg:col-span-7 space-y-7"
            >
              <motion.span
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="bg-[#ff5c00]/10 border border-[#ff5c00]/20 text-[#ff5c00] font-extrabold text-[10.5px] px-4 py-2 rounded-full inline-flex items-center gap-2 tracking-wider uppercase backdrop-blur-md shadow-sm"
              >
                <i className="bi bi-rocket-takeoff text-[#ff5c00] animate-bounce" /> Đón đầu công nghệ AI trong giáo dục
              </motion.span>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                className="text-[46px] md:text-[54px] lg:text-[66px] font-extrabold tracking-tight text-[#1d1d1f] mb-3 leading-[1.03]"
              >
                Học tập thông minh hơn với{' '}
                <span className="bg-gradient-to-r from-[#ff8a00] to-[#ff5c00] bg-clip-text text-transparent block mt-2">Trí tuệ nhân tạo</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                className="text-[16px] lg:text-[18.5px] text-black/55 max-w-xl leading-relaxed font-semibold"
              >
                Nền tảng quản trị tài liệu học tập tập trung kết hợp trợ lý AI thế hệ mới. Giải pháp số hóa giúp bạn lưu trữ, tra cứu và tương tác với tri thức nhanh gọn, hiệu quả nhất.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
                className="flex flex-wrap gap-4 pt-4"
              >
                <Button
                  type="primary"
                  size="large"
                  onClick={() => onNavigate('login')}
                  className="h-12 px-8 font-extrabold text-[14px] rounded-xl shadow-lg orange-glow flex items-center gap-2"
                >
                  Khám phá ngay <i className="bi bi-arrow-right text-[15px]" />
                </Button>
                <Button
                  size="large"
                  onClick={() => onNavigate('login')}
                  className="h-12 px-8 font-extrabold text-[14px] rounded-xl border-black/10 hover:border-black/20 hover:bg-black/[0.01] text-black"
                >
                  Tài khoản dùng thử
                </Button>
              </motion.div>
            </motion.div>

            {/* Right Column: Breathtaking Interactive AI Terminal Simulator Mockup */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="relative lg:col-span-5 flex justify-center z-10"
            >
              <div className="w-full max-w-[450px] bg-[#1c1c1e] rounded-3xl p-4 shadow-2xl relative overflow-hidden border border-white/[0.08] hover-card-depth transition-transform">
                {/* Terminal top header */}
                <div className="flex justify-between items-center pb-3 border-b border-white/[0.06] mb-4">
                  <div className="flex gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#ff453a] inline-block" />
                    <span className="w-3 h-3 rounded-full bg-[#ffcc00] inline-block" />
                    <span className="w-3 h-3 rounded-full bg-[#32d74b] inline-block" />
                  </div>
                  <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest font-mono">AI Study Hub • Terminal</span>
                </div>

                {/* Simulated message logs */}
                <div className="space-y-4 font-mono text-[12px] h-[260px] overflow-hidden flex flex-col justify-start">
                  <AnimatePresence mode="popLayout">
                    {terminalLines.map((line, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4 }}
                        className="text-left space-y-1.5"
                      >
                        <p className={line.type === 'user' ? 'text-[#ff9500] font-bold' : 'text-[#30d158] font-bold'}>
                          {line.type === 'user' ? '🧑‍🎓 Sinh viên' : '🤖 Trợ lý AI'}
                        </p>
                        <p className="text-white/80 whitespace-pre-wrap pl-2 leading-relaxed bg-white/[0.02] p-2 rounded-xl border border-white/[0.03]">
                          {line.text}
                        </p>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Active connection light */}
                <div className="pt-3 border-t border-white/[0.06] mt-4 flex items-center justify-between text-[10px] font-bold font-mono text-white/30">
                  <span>SYSTEM: CONNECTED</span>
                  <span className="flex items-center gap-1.5 text-[#30d158]">
                    <span className="w-2 h-2 rounded-full bg-[#30d158] animate-ping" />
                    STANDBY
                  </span>
                </div>
              </div>
            </motion.div>

          </div>
        </section>

        {/* SECTION: PROBLEM VS SOLUTION */}
        <section className="py-28 bg-[#f5f5f7] border-y border-black/[0.04] relative">
          <div className="max-w-7xl mx-auto px-6 md:px-12">

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-20"
            >
              <h2 className="text-[32px] md:text-[40px] font-extrabold text-[#1d1d1f] mb-4 tracking-tight">
                Giải quyết trọn vẹn rào cản ôn tập
              </h2>
              <p className="text-black/50 max-w-xl mx-auto text-[15px] font-bold">
                Chúng tôi tái định nghĩa cách tiếp cận tri thức đại học cho sinh viên kỷ nguyên số.
              </p>
              <div className="w-16 h-[3px] bg-[#ff5c00] mx-auto rounded-full mt-4" />
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8 items-stretch">

              {/* Problem Panel */}
              <motion.div
                whileHover={{ y: -4 }}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-white p-8 md:p-10 rounded-3xl border border-black/5 flex flex-col justify-between shadow-sm"
              >
                <div>
                  <div className="flex items-center gap-3.5 mb-8 text-[#ff3b30]">
                    <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center border border-red-500/20 shadow-sm">
                      <i className="bi bi-x-circle-fill text-[20px]" />
                    </div>
                    <h3 className="text-[21px] font-extrabold text-black tracking-tight">Khó khăn thường gặp</h3>
                  </div>
                  <ul className="space-y-6 text-left">
                    {[
                      'Tài liệu rải rác trên Google Drive, Messenger, Zalo và ổ cứng gây thất lạc.',
                      'Mất quá nhiều thời gian để mò tìm lại một file PDF, slide giáo trình hoặc bài giảng cũ.',
                      'Đọc hàng trăm trang tài liệu dày đặc để ôn tập chuẩn bị thi cử gây quá tải.',
                    ].map((text, i) => (
                      <li key={i} className="flex items-start gap-4">
                        <div className="w-6 h-6 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                          <i className="bi bi-x text-red-500 text-[14px]" />
                        </div>
                        <p className="text-[14px] font-semibold text-black/55 leading-relaxed">{text}</p>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-10 border-t border-black/5 pt-4 text-[10.5px] font-bold text-black/30 uppercase tracking-widest text-right">
                  Quy trình ôn thi phân tán, thiếu liên kết
                </div>
              </motion.div>

              {/* Solution Panel */}
              <motion.div
                whileHover={{ y: -4 }}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-white p-8 md:p-10 rounded-3xl border border-[#ff5c00]/15 flex flex-col justify-between shadow-sm relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#ff5c00]/4 rounded-full blur-3xl pointer-events-none" />
                <div>
                  <div className="flex items-center gap-3.5 mb-8 text-[#34c759]">
                    <div className="w-10 h-10 bg-[#34c759]/10 rounded-xl flex items-center justify-center border border-[#34c759]/20 shadow-sm">
                      <i className="bi bi-check-circle-fill text-[20px]" />
                    </div>
                    <h3 className="text-[21px] font-extrabold text-black tracking-tight">Giải pháp từ AI Study Hub</h3>
                  </div>
                  <ul className="space-y-6 text-left">
                    {[
                      'Mọi giáo trình được lưu trữ tập trung và tự động phân loại thông minh theo môn học.',
                      'Hệ thống tìm kiếm thông minh từ khóa, chủ đề, tự động gắn nhãn phân mục khoa học.',
                      'Trợ lý học thuật AI đọc, hiểu tài liệu, hỗ trợ giải đáp & thiết kế câu hỏi ôn thi tức thì.',
                    ].map((text, i) => (
                      <li key={i} className="flex items-start gap-4">
                        <div className="w-6 h-6 rounded-full bg-[#34c759]/10 border border-[#34c759]/20 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                          <i className="bi bi-check2 text-[#34c759] text-[14px]" />
                        </div>
                        <p className="text-[14px] font-semibold text-black/75 leading-relaxed">{text}</p>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-10 border-t border-black/5 pt-4 text-[10.5px] font-bold text-[#ff5c00] uppercase tracking-widest text-right">
                  Hệ sinh thái tri thức tích hợp AI
                </div>
              </motion.div>

            </div>
          </div>
        </section>

        {/* SECTION: PREMIUM FEATURES GRID */}
        <section id="features-section" className="py-28 bg-[#fafafb]">
          <div className="max-w-7xl mx-auto px-6 md:px-12">

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-20"
            >
              <h2 className="text-[32px] md:text-[40px] font-extrabold text-black mb-4 tracking-tight">Đột phá các công cụ thông minh</h2>
              <p className="text-black/50 max-w-xl mx-auto text-[15px] font-bold">Trang bị sức mạnh công nghệ tối đa cho lộ trình học tập của bạn.</p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: 'bi-folder2-open', title: 'Quản lý tập trung', desc: 'Lưu trữ bài giảng, PDF, tài liệu nghiên cứu tập trung khoa học tại một nơi duy nhất.', link: 'Đến thư viện', view: 'dashboard' },
                { icon: 'bi-shield-check', title: 'Lưu trữ đám mây', desc: 'Đồng bộ hóa dữ liệu đám mây thời gian thực, truy xuất mọi lúc mọi nơi từ điện thoại, laptop.', link: 'Mở kho lưu trữ', view: 'dashboard' },
                { icon: 'bi-stars', title: 'Trợ lý AI thông minh', desc: 'Trò chuyện, đặt câu hỏi, tóm tắt tự động giáo trình hàng trăm trang chỉ trong vài giây.', link: 'Nhắn tin với AI', view: 'ai' },
                { icon: 'bi-people', title: 'Cộng đồng học tập', desc: 'Tham gia các nhóm trao đổi tài liệu, bài tập lớn, kết nối tri thức cùng đồng đội.', link: 'Vào nhóm học tập', view: 'community' },
              ].map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  onClick={() => onNavigate('login')}
                  className="p-6 bg-white border border-black/5 hover:border-[#ff5c00]/30 rounded-3xl transition-all duration-300 cursor-pointer group flex flex-col justify-between hover-card-depth shadow-sm"
                >
                  <div className="space-y-5">
                    <div className="w-11 h-11 bg-black/[0.01] border border-black/5 rounded-xl flex items-center justify-center text-[#ff5c00] group-hover:bg-[#ff5c00] group-hover:text-white transition-all duration-300 shadow-md">
                      <i className={`bi ${f.icon} text-[20px]`} />
                    </div>
                    <h4 className="text-[17px] font-extrabold text-black group-hover:text-[#ff5c00] transition-colors">{f.title}</h4>
                    <p className="text-[13.5px] text-black/50 leading-relaxed font-semibold">{f.desc}</p>
                  </div>
                  <div className="mt-6 text-[12px] font-bold text-[#ff5c00] flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {f.link} <i className="bi bi-arrow-right text-[11px]" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="bg-[#f5f5f7] py-16 border-t border-black/5 relative">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-12 text-left">
            <div className="col-span-2 md:col-span-1 space-y-4">
              <span className="text-[16px] font-extrabold text-black block tracking-tight">AI Study Hub</span>
              <p className="text-[12.5px] text-black/50 leading-relaxed font-semibold">
                Nền tảng tiên phong trong việc hỗ trợ quản trị tri thức hiệu suất cao cho cộng đồng học thuật Việt Nam.
              </p>
            </div>
            <div>
              <h5 className="font-extrabold text-black text-[13.5px] mb-5">Sản phẩm</h5>
              <ul className="space-y-3 text-[12.5px] text-black/55 font-semibold">
                <li><button onClick={() => onNavigate('login')} className="hover:text-black transition-colors cursor-pointer">Quản lý tài liệu</button></li>
                <li><button onClick={() => onNavigate('login')} className="hover:text-black transition-colors cursor-pointer">Trợ lý học tập AI</button></li>
                <li><button onClick={() => onNavigate('login')} className="hover:text-black transition-colors cursor-pointer">Nhóm học tập</button></li>
              </ul>
            </div>
            <div>
              <h5 className="font-extrabold text-black text-[13.5px] mb-5">Cộng đồng</h5>
              <ul className="space-y-3 text-[12.5px] text-black/55 font-semibold">
                <li><button onClick={() => onNavigate('login')} className="hover:text-black transition-colors cursor-pointer">Nhóm Machine Learning</button></li>
                <li><button onClick={() => onNavigate('login')} className="hover:text-black transition-colors cursor-pointer">Nhóm Khoa học dữ liệu</button></li>
              </ul>
            </div>
            <div>
              <h5 className="font-extrabold text-black text-[13.5px] mb-5">Liên hệ hỗ trợ</h5>
              <ul className="space-y-3 text-[12.5px] text-black/55 font-semibold font-sans">
                <li>Trung tâm trợ giúp</li>
                <li><span className="text-[#ff5c00]">vuongbaovipvip@gmail.com</span></li>
                <li>Chính sách bảo mật</li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-black/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[12px] text-black/45 font-semibold">
            <p>© 2026 AI Study Hub. Developed with ❤️ for Vietnam Students.</p>
            <div className="flex gap-6">
              <span className="hover:text-black cursor-pointer transition-colors">Điều khoản</span>
              <span className="hover:text-black cursor-pointer transition-colors">Bảo mật</span>
              <span className="hover:text-black cursor-pointer transition-colors">Sơ đồ trang</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
