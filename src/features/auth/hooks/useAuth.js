import { useState } from 'react';
import { message } from 'antd';
import { ADMIN_CREDENTIALS } from '../utils/constants';

export default function useAuth({ onLoginSuccess, onAdminLoginSuccess }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (values) => {
    setErrorMsg('');
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 800));
    setIsLoading(false);

    if (!values.usernameOrEmail) { setErrorMsg('Vui lòng điền email hoặc tên đăng nhập.'); return; }
    if (!values.password || values.password.length < 6) { setErrorMsg('Mật khẩu phải chứa ít nhất 6 ký tự.'); return; }

    if (values.usernameOrEmail === ADMIN_CREDENTIALS.username && values.password === ADMIN_CREDENTIALS.password) {
      message.success('Xác thực quản trị viên thành công!');
      onAdminLoginSuccess();
      return;
    }
    message.success('Đăng nhập thành công!');
    onLoginSuccess(values.usernameOrEmail);
  };

  const handleRegister = async (values) => {
    setErrorMsg('');
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 800));
    setIsLoading(false);

    if (!values.displayName || values.displayName.trim().length < 2) { setErrorMsg('Tên đăng nhập phải có ít nhất 2 ký tự.'); return; }
    if (values.password !== values.confirmPassword) { setErrorMsg('Mật khẩu nhập lại không trùng khớp.'); return; }
    message.success('Đăng ký tài khoản thành công!');
    onLoginSuccess(values.displayName);
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    await new Promise(r => setTimeout(r, 800));
    setIsGoogleLoading(false);
    message.success('Đăng nhập bằng Google thành công!');
    onLoginSuccess('vuongbaovipvip@gmail.com');
  };

  return { isLoading, isGoogleLoading, errorMsg, setErrorMsg, showPassword, setShowPassword, handleLogin, handleRegister, handleGoogleLogin };
}
