/**
 * LoginScreen — Premium Apple-style authentication page.
 *
 * Layout order (per spec):
 *   Brand → Form Fields → Submit Button → Divider → Google Button
 *
 * Handles both /login and /register via `currentView` prop.
 */
import { useEffect } from 'react';
import { Form, Divider } from 'antd';
import { motion } from 'framer-motion';
import useAuth from '../hooks/useAuth';
import AuthLayout from '../components/AuthLayout';
import AuthCard from '../components/AuthCard';
import GoogleButton from '../components/GoogleButton';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import { ANIM } from '../utils/constants';

export default function LoginScreen({ onLoginSuccess, onAdminLoginSuccess, onNavigate, currentView }) {
  const [form] = Form.useForm();
  const isRegister = currentView === 'register';

  const {
    isLoading, isGoogleLoading, errorMsg, setErrorMsg,
    showPassword, setShowPassword,
    handleLogin, handleRegister, handleGoogleLogin,
  } = useAuth({ onLoginSuccess, onAdminLoginSuccess });

  useEffect(() => {
    setErrorMsg('');
    setShowPassword(false);
    form.resetFields();
  }, [currentView, form, setErrorMsg, setShowPassword]);

  const handleToggleMode = () => {
    setErrorMsg('');
    form.resetFields();
    onNavigate(isRegister ? 'login' : 'register');
  };

  return (
    <AuthLayout>
      <AuthCard
        isRegister={isRegister}
        errorMsg={errorMsg}
        onNavigate={onNavigate}
        onToggleMode={handleToggleMode}
      >
        {/* ── Form ── */}
        <Form
          form={form}
          layout="vertical"
          onFinish={isRegister ? handleRegister : handleLogin}
          initialValues={{ usernameOrEmail: 'vuongbaovipvip@gmail.com', password: '12345678', remember: true }}
          requiredMark={false}
          className={isRegister ? '[&_.ant-form-item]:!mb-2.5' : '[&_.ant-form-item]:!mb-3.5'}
        >
          <motion.div variants={ANIM.stagger} initial="initial" animate="animate">
            {isRegister ? (
              <RegisterForm form={form} showPassword={showPassword} setShowPassword={setShowPassword} />
            ) : (
              <LoginForm form={form} showPassword={showPassword} setShowPassword={setShowPassword} onNavigate={onNavigate} />
            )}

            {/* ── Submit Button ── */}
            <motion.div variants={ANIM.child}>
              <Form.Item className="!mb-0">
                <motion.button
                  whileHover={{ scale: 1.005, opacity: 0.92 }}
                  whileTap={{ scale: 0.997 }}
                  type="submit"
                  disabled={isLoading || isGoogleLoading}
                  className="w-full h-[42px] text-white bg-gradient-to-b from-[#ff7a00] to-[#ff5c00] font-medium rounded-[12px] text-[13.5px] border-none shadow-[0_1px_3px_rgba(255,92,0,0.3),inset_0_1px_0_rgba(255,255,255,0.15)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {isLoading ? (
                    <div className="w-[18px] h-[18px] border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>{isRegister ? 'Tạo tài khoản' : 'Đăng nhập'}</span>
                      <i className="bi bi-arrow-right text-[13px] opacity-70" />
                    </>
                  )}
                </motion.button>
              </Form.Item>
            </motion.div>
          </motion.div>
        </Form>

        {/* ── Divider ── */}
        <Divider className="!text-[10px] !font-medium !text-black/[0.15] !my-5">hoặc</Divider>

        {/* ── Google OAuth Button (below submit — per spec) ── */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.25, ease: [0.25, 1, 0.5, 1] }}
        >
          <GoogleButton onClick={handleGoogleLogin} isLoading={isGoogleLoading} isRegister={isRegister} />
        </motion.div>
      </AuthCard>
    </AuthLayout>
  );
}
