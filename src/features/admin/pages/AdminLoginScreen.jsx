import { useState } from 'react';
import { Form, message } from 'antd';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function AdminLoginScreen({ onLoginSuccess }) {
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    setErrorMsg('');
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 900));
    setIsLoading(false);

    if (values.username === 'admin' && values.password === 'admin123') {
      message.success('Xác thực quản trị viên thành công!');
      onLoginSuccess('admin');
    } else {
      setErrorMsg('Tài khoản hoặc mật khẩu quản trị không hợp lệ.');
    }
  };

  return (
    <div className="bg-white text-[#1d1d1f] h-screen max-h-screen overflow-hidden flex items-center justify-center font-sans w-full select-none relative">
      {/* Ambient glows matching Dashboard */}
      <div className="absolute top-[-15%] left-[-10%] w-[45%] h-[45%] bg-[var(--color-primary)]/[0.04] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[40%] h-[40%] bg-[var(--color-primary)]/[0.03] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[30%] right-[20%] w-[25%] h-[25%] bg-[var(--color-primary)]/[0.02] rounded-full blur-[80px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[400px] mx-4 relative z-10"
      >
        {/* Card */}
        <div className="bg-white border border-black/[0.06] rounded-[28px] p-8 shadow-[0_20px_60px_rgba(0,0,0,0.06)] relative overflow-hidden">
          {/* Top accent line */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[50%] h-[2px] bg-gradient-to-r from-transparent via-[var(--color-primary)] to-transparent opacity-30" />

          {/* Branding */}
          <div className="flex flex-col items-center mb-8 text-center">
            <motion.div
              initial={{ scale: 0.8, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
              className="w-14 h-14 bg-gradient-to-br from-[#ff8a00] to-[#ff5c00] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-[var(--color-primary)]/20 mb-5"
            >
              <i className="bi bi-shield-lock-fill text-[24px]" />
            </motion.div>
            <h1 className="text-[22px] font-extrabold text-[#1d1d1f] tracking-tight leading-none mb-1.5">
              Bảng điều khiển
            </h1>
            <p className="text-[11px] font-bold text-black/40 uppercase tracking-[0.15em]">
              AI Study Hub • Quản trị hệ thống
            </p>
          </div>

          {/* Error Message */}
          <AnimatePresence mode="wait">
            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, y: -8, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -8, height: 0 }}
                className="mb-5 rounded-2xl py-3 px-4 border border-red-500/15 bg-red-500/5 text-red-500 flex items-center gap-3"
              >
                <div className="w-7 h-7 rounded-full bg-red-500/10 flex items-center justify-center shrink-0">
                  <i className="bi bi-shield-x text-[13px]" />
                </div>
                <span className="text-[12px] font-bold">{errorMsg}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <Form form={form} layout="vertical" onFinish={handleSubmit} initialValues={{ username: 'admin', password: 'admin123' }} requiredMark={false}>
            <Form.Item name="username" rules={[{ required: true, message: 'Vui lòng nhập tài khoản.' }]} className="mb-4">
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-black/30 group-focus-within:text-[var(--color-primary)] transition-colors z-10">
                  <i className="bi bi-person text-[16px]" />
                </span>
                <input
                  type="text"
                  placeholder="Mã định danh quản trị"
                  className="w-full bg-black/[0.02] border border-black/[0.06] focus:border-[var(--color-primary)] focus:bg-white rounded-[16px] pl-11 pr-4 py-3.5 text-[#1d1d1f] font-semibold text-[13px] placeholder-black/30 outline-none focus:ring-[3px] focus:ring-[var(--color-primary)]/10 transition-all hover:border-black/10"
                  onChange={(e) => { form.setFieldsValue({ username: e.target.value }); if (errorMsg) setErrorMsg(''); }}
                />
              </div>
            </Form.Item>

            <Form.Item name="password" rules={[{ required: true, message: 'Vui lòng nhập mật khẩu.' }]} className="mb-5">
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-black/30 group-focus-within:text-[var(--color-primary)] transition-colors z-10">
                  <i className="bi bi-key text-[16px]" />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Mã bảo mật"
                  className="w-full bg-black/[0.02] border border-black/[0.06] focus:border-[var(--color-primary)] focus:bg-white rounded-[16px] pl-11 pr-11 py-3.5 text-[#1d1d1f] font-semibold text-[13px] placeholder-black/30 outline-none focus:ring-[3px] focus:ring-[var(--color-primary)]/10 transition-all hover:border-black/10"
                  onChange={(e) => { form.setFieldsValue({ password: e.target.value }); if (errorMsg) setErrorMsg(''); }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-black/30 hover:text-[var(--color-primary)] transition-colors cursor-pointer z-10"
                >
                  <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'} text-[15px]`} />
                </button>
              </div>
            </Form.Item>

            {/* Remember / Forgot */}
            <div className="flex justify-between items-center mb-6">
              <label className="flex items-center gap-2 cursor-pointer group" onClick={() => setRememberMe(!rememberMe)}>
                <div className={`w-4 h-4 rounded-[5px] border flex items-center justify-center transition-all ${rememberMe ? 'bg-[var(--color-primary)] border-[var(--color-primary)]' : 'border-black/15 bg-white group-hover:border-black/25'}`}>
                  {rememberMe && <i className="bi bi-check text-white text-[11px] font-bold" />}
                </div>
                <span className="text-[12px] font-medium text-black/50 group-hover:text-black/70 transition-colors">Ghi nhớ đăng nhập</span>
              </label>
              <button type="button" className="text-[12px] font-semibold text-[var(--color-primary)] hover:underline underline-offset-4 cursor-pointer transition-all">
                Quên mật khẩu?
              </button>
            </div>

            {/* Submit */}
            <Form.Item className="mb-0">
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="w-full h-[48px] text-white bg-gradient-to-r from-[#ff8a00] to-[#ff5c00] font-bold rounded-[16px] text-[13px] border-none shadow-lg shadow-[var(--color-primary)]/20 hover:shadow-xl hover:shadow-[var(--color-primary)]/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 transition-all relative overflow-hidden"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-[2.5px] border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Xác thực hệ thống</span>
                    <i className="bi bi-arrow-right text-[15px]" />
                  </>
                )}
              </motion.button>
            </Form.Item>
          </Form>

          {/* Back to student portal */}
          <div className="mt-6 text-center pt-5 border-t border-black/[0.04]">
            <button
              onClick={() => navigate('/login')}
              className="text-[12px] font-semibold text-black/40 hover:text-[var(--color-primary)] transition-colors cursor-pointer flex items-center justify-center gap-2 mx-auto"
            >
              <i className="bi bi-arrow-left text-[12px]" /> Quay về Cổng Sinh Viên
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-[10px] text-black/20 font-bold tracking-[0.15em] uppercase">
          Phiên bản hệ thống v2.0 • Bảo mật SSL
        </div>
      </motion.div>
    </div>
  );
}
