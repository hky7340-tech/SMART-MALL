import React, { useState } from 'react';
import Link from 'next/link';

const navItems = [
  { name: 'Trang chủ', href: '/' },
  { name: 'Cửa hàng', href: '/stores' },
  { name: 'Sản phẩm', href: '/products' },
  { name: 'Sự kiện', href: '/events' },
  { name: 'Khuyến mãi', href: '/promotions' },
  { name: 'Liên hệ', href: '/contact' },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white text-sm">
        <div className="container-custom flex items-center justify-between py-1.5">
          <div className="flex items-center gap-4">
            <span>📞 1900 9999 99</span>
            <span className="hidden md:inline">✉️ info@smartmall.com</span>
            <span className="hidden lg:inline">📍 123 Nguyễn Huệ, Quận 1, TP.HCM</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/tracking" className="hover:text-accent-200 transition-colors">
              📦 Tra cứu đơn hàng
            </Link>
            <Link href="/stores" className="hover:text-accent-200 transition-colors">
              🏪 Tìm cửa hàng
            </Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container-custom">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">SM</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-gray-900 leading-tight">Smart Mall</h1>
              <p className="text-xs text-gray-500">Trung tâm thương mại thông minh</p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50 transition-all"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Cart */}
            <Link href="/cart" className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
              </svg>
              <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-accent-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                0
              </span>
            </Link>

            {/* User */}
            <Link href="/auth/login" className="hidden sm:flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      {searchOpen && (
        <div className="border-t border-gray-100 bg-white animate-slide-down">
          <div className="container-custom py-3">
            <div className="flex items-center gap-2 max-w-2xl mx-auto">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm, cửa hàng..."
                  className="input-field pl-10"
                  autoFocus
                />
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <button className="btn-primary">Tìm kiếm</button>
              <button onClick={() => setSearchOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                ✕
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white animate-slide-down">
          <div className="container-custom py-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block px-4 py-2.5 rounded-lg text-gray-700 hover:bg-primary-50 hover:text-primary-600 font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <hr className="my-2" />
            <Link href="/auth/login" className="block px-4 py-2.5 rounded-lg text-primary-600 font-medium">
              Đăng nhập
            </Link>
            <Link href="/auth/register" className="block px-4 py-2.5 rounded-lg text-primary-600 font-medium">
              Đăng ký
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

