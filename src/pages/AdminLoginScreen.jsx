import { useState } from 'react';
import { Form, message } from 'antd';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function AdminLoginScreen({ onLoginSuccess }) {
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    setErrorMsg('');
    setIsLoading(true);

    // High-end simulated loading delay
    await new Promise(resolve => setTimeout(resolve, 800));

    setIsLoading(false);
    
    // Simple mock authentication for Admin
    if (values.username === 'admin' && values.password === 'admin123') {
      message.success('Xác thực quản trị viên thành công!');
      onLoginSuccess('admin');
    } else {
      setErrorMsg('Tài khoản hoặc mật khẩu quản trị không hợp lệ.');
    }
  };

  return (
    <div className="bg-[#f5f5f7] text-[#1d1d1f] h-screen max-h-screen overflow-hidden flex flex-row font-sans w-full select-none relative grid-mesh">
      {/* Light premium background blooms (synchronized with User UI) */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#ff5c00]/6 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#ff8a00]/4 rounded-full blur-[140px] pointer-events-none z-0" />
      
      {/* Main Form Container */}
      <main className="flex-1 flex flex-col justify-center items-center px-6 z-10 relative">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-[420px] bg-white/70 backdrop-blur-[40px] border border-white/60 rounded-[32px] p-10 shadow-[0_30px_60px_rgba(255,92,0,0.06)] relative overflow-hidden"
        >
          {/* Inner glow top border */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-[3px] bg-gradient-to-r from-transparent via-[#ff5c00] to-transparent opacity-40 rounded-b-full" />

          {/* Header */}
          <div className="flex flex-col items-center mb-10 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-[#ff8a00] to-[#ff5c00] rounded-[20px] flex items-center justify-center text-white shadow-xl shadow-[#ff5c00]/30 mb-6 border border-white/20">
              <i className="bi bi-shield-lock-fill text-[28px]" />
            </div>
            <h1 className="text-[26px] font-bold text-[#1d1d1f] tracking-tight leading-none mb-2">
              System Admin
            </h1>
            <p className="text-[12px] font-semibold text-black/40 uppercase tracking-widest">
              AI Study Hub Control Center
            </p>
          </div>

          <AnimatePresence mode="wait">
            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6 rounded-2xl py-3 px-4 border border-[#ff3b30]/20 bg-[#ff3b30]/5 text-[#ff3b30] flex items-center gap-3 shadow-inner"
              >
                <div className="w-6 h-6 rounded-full bg-[#ff3b30]/10 flex items-center justify-center shrink-0">
                  <i className="bi bi-shield-x text-[14px]" />
                </div>
                <span className="text-[12px] font-bold">{errorMsg}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{ username: 'admin', password: 'admin123' }}
            requiredMark={false}
          >
            <Form.Item
              name="username"
              rules={[{ required: true, message: 'Vui lòng nhập tài khoản quản trị.' }]}
            >
              <div className="relative flex items-center group">
                <span className="absolute left-4 text-black/30 group-focus-within:text-[#ff5c00] transition-colors"><i className="bi bi-person-badge text-[18px]" /></span>
                <input
                  type="text"
                  placeholder="Mã định danh Admin"
                  className={`w-full bg-white/50 border ${errorMsg ? 'border-[#ff3b30] focus:ring-[#ff3b30]/10' : 'border-black/5 focus:border-[#ff5c00]/50 focus:ring-[#ff5c00]/10'} rounded-2xl pl-12 pr-4 py-4 text-[#1d1d1f] font-medium text-[14px] placeholder-black/30 outline-none focus:ring-4 transition-all hover:bg-white shadow-sm`}
                  onChange={(e) => {
                    form.setFieldsValue({ username: e.target.value });
                    if (errorMsg) setErrorMsg(''); // Clear error on typing
                  }}
                />
              </div>
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Vui lòng nhập mật khẩu.' }]}
              className="mb-8"
            >
              <div className="relative flex items-center group">
                <span className="absolute left-4 text-black/30 group-focus-within:text-[#ff5c00] transition-colors"><i className="bi bi-key text-[18px]" /></span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Mã bảo mật (Password)"
                  className={`w-full bg-white/50 border ${errorMsg ? 'border-[#ff3b30] focus:ring-[#ff3b30]/10' : 'border-black/5 focus:border-[#ff5c00]/50 focus:ring-[#ff5c00]/10'} rounded-2xl pl-12 pr-12 py-4 text-[#1d1d1f] font-medium text-[14px] placeholder-black/30 outline-none focus:ring-4 transition-all hover:bg-white shadow-sm`}
                  onChange={(e) => {
                    form.setFieldsValue({ password: e.target.value });
                    if (errorMsg) setErrorMsg('');
                  }}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 text-black/30 hover:text-[#ff5c00] transition-colors cursor-pointer flex items-center justify-center"
                >
                  <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'} text-[18px]`} />
                </button>
              </div>
            </Form.Item>

            <Form.Item className="mb-0">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="w-full h-[52px] text-white bg-gradient-to-r from-[#ff8a00] to-[#ff5c00] font-bold rounded-2xl text-[13.5px] uppercase tracking-wide border-none shadow-[0_10px_20px_rgba(255,92,0,0.2)] hover:shadow-[0_15px_25px_rgba(255,92,0,0.3)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 transition-all relative overflow-hidden group"
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-[3px] border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span className="relative z-10">Xác thực hệ thống</span>
                    <i className="bi bi-fingerprint text-[18px] relative z-10" />
                  </>
                )}
              </motion.button>
            </Form.Item>
          </Form>

          {/* Footer link to user login */}
          <div className="mt-8 text-center border-t border-black/5 pt-6">
            <button 
              onClick={() => navigate('/login')}
              className="text-[12px] font-bold text-black/40 hover:text-[#ff5c00] transition-colors cursor-pointer flex items-center justify-center gap-2 mx-auto"
            >
              <i className="bi bi-arrow-left" /> Quay về Cổng Sinh Viên
            </button>
          </div>
        </motion.div>
        
        <div className="absolute bottom-8 left-0 w-full text-center text-[10px] text-black/20 font-black font-mono tracking-[0.2em] uppercase">
          SYSTEM.ADMIN.AUTH // SECURE CONNECTION
        </div>
      </main>
    </div>
  );
}
