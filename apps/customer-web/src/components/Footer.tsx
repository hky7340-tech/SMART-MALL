import React from 'react';
import Link from 'next/link';

interface FooterLink {
  name: string;
  href: string;
  external?: boolean;
}

const footerLinks: Record<string, FooterLink[]> = {
  'Về chúng tôi': [
    { name: 'Giới thiệu', href: '/about' },
    { name: 'Liên hệ', href: '/contact' },
    { name: 'Tuyển dụng', href: '/careers' },
    { name: 'Tin tức', href: '/news' },
  ],
  'Hỗ trợ khách hàng': [
    { name: 'Trung tâm hỗ trợ', href: '/support' },
    { name: 'Hướng dẫn mua hàng', href: '/guide' },
    { name: 'Chính sách đổi trả', href: '/return-policy' },
    { name: 'Chính sách bảo mật', href: '/privacy' },
    { name: 'Điều khoản sử dụng', href: '/terms' },
  ],
  'Dịch vụ': [
    { name: 'Cửa hàng', href: '/stores' },
    { name: 'Nhà hàng', href: '/restaurants' },
    { name: 'Rạp phim', href: '/cinema' },
    { name: 'Sự kiện', href: '/events' },
    { name: 'Ưu đãi', href: '/promotions' },
  ],
  'Kết nối': [
    { name: 'Facebook', href: 'https://facebook.com/smartmall', external: true },
    { name: 'Instagram', href: 'https://instagram.com/smartmall', external: true },
    { name: 'TikTok', href: 'https://tiktok.com/@smartmall', external: true },
    { name: 'YouTube', href: 'https://youtube.com/@smartmall', external: true },
    { name: 'Zalo', href: 'https://zalo.me/smartmall', external: true },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer */}
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">SM</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Smart Mall</h3>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              Trung tâm thương mại thông minh hàng đầu Việt Nam. 
              Trải nghiệm mua sắm, giải trí và ẩm thực đẳng cấp.
            </p>
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white text-xs font-bold border-2 border-gray-900">FB</div>
                <div className="w-8 h-8 rounded-full bg-pink-600 flex items-center justify-center text-white text-xs font-bold border-2 border-gray-900">IG</div>
                <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white text-xs font-bold border-2 border-gray-900">TT</div>
                <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white text-xs font-bold border-2 border-gray-900">YT</div>
              </div>
            </div>
          </div>

          {/* Link Groups */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-white font-semibold mb-4">{title}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-400 hover:text-white transition-colors"
                      {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container-custom py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">
              © 2024 Smart Mall. Tất cả quyền được bảo lưu.
            </p>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">Chấp nhận thanh toán:</span>
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 bg-gray-800 rounded text-xs text-gray-400">VNPay</span>
                <span className="px-2 py-1 bg-gray-800 rounded text-xs text-gray-400">MoMo</span>
                <span className="px-2 py-1 bg-gray-800 rounded text-xs text-gray-400">ZaloPay</span>
                <span className="px-2 py-1 bg-gray-800 rounded text-xs text-gray-400">Visa</span>
                <span className="px-2 py-1 bg-gray-800 rounded text-xs text-gray-400">Master</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

