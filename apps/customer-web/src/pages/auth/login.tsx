import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        const data = await res.json();

        if (!data.success) {
          toast.error(data.message || 'Đăng nhập thất bại');
          return;
        }

        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('auth_user', JSON.stringify(data.user));
        toast.success('Đăng nhập thành công!');

        // Redirect based on role
        if (data.user.role === 'admin') {
          router.push('/admin');
        } else {
          router.push('/');
        }
      } else {
        // Register
        if (!fullName || !email || !password) {
          toast.error('Vui lòng điền đầy đủ thông tin');
          return;
        }

        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, name: fullName, phone }),
        });
        const data = await res.json();

        if (!data.success) {
          toast.error(data.message || 'Đăng ký thất bại');
          return;
        }

        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('auth_user', JSON.stringify(data.user));
        toast.success('Đăng ký thành công!');
        router.push('/');
      }
    } catch (error: any) {
      toast.error('Không thể kết nối đến máy chủ. Vui lòng thử lại sau.');
      console.error('Auth error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    toast.success(`Đăng nhập với ${provider} (sẽ sớm được hỗ trợ)`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">SM</span>
            </div>
            <span className="text-xl font-bold">Smart Mall</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">
            {isLogin ? 'Đăng nhập' : 'Đăng ký'}
          </h1>
          <p className="text-gray-600 mt-2">
            {isLogin ? 'Chào mừng bạn quay trở lại!' : 'Tạo tài khoản mới để trải nghiệm'}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
                <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)}
                  className="input-field" placeholder="Nguyễn Văn A" required />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                className="input-field" placeholder="example@email.com" required />
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                  className="input-field" placeholder="+84 912 345 678" />
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-gray-700">Mật khẩu</label>
                {isLogin && (
                  <Link href="/auth/forgot-password" className="text-sm text-primary-600 hover:underline">
                    Quên mật khẩu?
                  </Link>
                )}
              </div>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                className="input-field" placeholder="••••••••" required minLength={6} />
            </div>

            {!isLogin && (
              <div className="flex items-start gap-2">
                <input type="checkbox" id="terms" className="mt-1 rounded border-gray-300" required />
                <label htmlFor="terms" className="text-sm text-gray-600">
                  Tôi đồng ý với{' '}
                  <Link href="/terms" className="text-primary-600 hover:underline">Điều khoản sử dụng</Link>
                  {' '}và{' '}
                  <Link href="/privacy" className="text-primary-600 hover:underline">Chính sách bảo mật</Link>
                </label>
              </div>
            )}

            <button type="submit" className="btn-primary w-full py-3" disabled={loading}>
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  {isLogin ? 'Đang đăng nhập...' : 'Đang đăng ký...'}
                </span>
              ) : (
                isLogin ? 'Đăng nhập' : 'Đăng ký'
              )}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">Hoặc tiếp tục với</span>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3">
              <button onClick={() => handleSocialLogin('Google')}
                className="flex items-center justify-center px-4 py-2.5 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
                <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#EA4335" d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.27 0 3.198 2.932 1.24 7.106l4.026 2.659Z" /><path fill="#34A853" d="M16.04 18.013c-1.09.703-2.474 1.078-4.04 1.078a7.077 7.077 0 0 1-6.723-4.823l-4.04 2.644A11.965 11.965 0 0 0 12 24c2.933 0 5.735-1.025 7.841-3.003l-3.801-2.984Z" /><path fill="#4A90E2" d="M19.84 5.092 12 10.858V15h8.223c2.026 0 3.555-1.114 3.555-2.8 0-1.173-.923-2.127-2.136-2.38l-1.467-.174.777-.816 6.301-6.614A12.04 12.04 0 0 0 24 12c0 1.63-.316 3.192-.87 4.62l-6.13-4.79-2.78-2.06Z" /></svg>
              </button>
              <button onClick={() => handleSocialLogin('Facebook')}
                className="flex items-center justify-center px-4 py-2.5 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
              </button>
              <button onClick={() => handleSocialLogin('Apple')}
                className="flex items-center justify-center px-4 py-2.5 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.69 3.56-1.702z" /></svg>
              </button>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {isLogin ? 'Chưa có tài khoản?' : 'Đã có tài khoản?'}{' '}
              <button onClick={() => setIsLogin(!isLogin)}
                className="text-primary-600 font-semibold hover:underline">
                {isLogin ? 'Đăng ký ngay' : 'Đăng nhập'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}