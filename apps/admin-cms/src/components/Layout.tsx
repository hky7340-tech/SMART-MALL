import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface SidebarItem {
    href: string;
    label: string;
    icon: string;
    badge?: string;
    badgeColor?: string;
}

interface SidebarSection {
    section: string;
    items: SidebarItem[];
}

const sidebarItems: SidebarSection[] = [
    {
        section: 'Tổng quan',
        items: [
            { href: '/', label: 'Dashboard', icon: '📊' },
        ]
    },
    {
        section: 'Quản lý',
        items: [
            { href: '/users', label: 'Người dùng', icon: '👥' },
            { href: '/stores', label: 'Cửa hàng', icon: '🏪' },
            { href: '/products', label: 'Sản phẩm', icon: '📦' },
            { href: '/orders', label: 'Đơn hàng', icon: '📋', badge: '12', badgeColor: 'bg-red-500' },
            { href: '/inventory', label: 'Kho hàng', icon: '📦' },
        ]
    },
    {
        section: 'Khách hàng',
        items: [
            { href: '/customers', label: 'CRM', icon: '🤝' },
            { href: '/membership', label: 'Membership', icon: '⭐' },
            { href: '/loyalty', label: 'Loyalty', icon: '🎯' },
        ]
    },
    {
        section: 'Khuyến mãi',
        items: [
            { href: '/vouchers', label: 'Voucher', icon: '🎫' },
            { href: '/gift-cards', label: 'Gift Card', icon: '🎁' },
            { href: '/wallet', label: 'Ví điện tử', icon: '💰' },
            { href: '/gamification', label: 'Gamification', icon: '🎮' },
        ]
    },
    {
        section: 'Nội dung',
        items: [
            { href: '/events', label: 'Sự kiện', icon: '🎪' },
            { href: '/news', label: 'Tin tức', icon: '📰' },
            { href: '/banners', label: 'Banner/Slider', icon: '🖼️' },
            { href: '/media', label: 'Media', icon: '📸' },
            { href: '/notifications', label: 'Thông báo', icon: '🔔', badge: '5', badgeColor: 'bg-orange-500' },
        ]
    },
    {
        section: 'Dịch vụ',
        items: [
            { href: '/restaurants', label: 'Nhà hàng', icon: '🍽️' },
            { href: '/cinema', label: 'Rạp phim', icon: '🎬' },
            { href: '/parking', label: 'Bãi xe', icon: '🅿️' },
            { href: '/map', label: 'Bản đồ', icon: '🗺️' },
        ]
    },
    {
        section: 'Báo cáo',
        items: [
            { href: '/reports', label: 'Báo cáo', icon: '📈' },
            { href: '/ai-insights', label: 'AI Insights', icon: '🤖' },
        ]
    },
    {
        section: 'Hệ thống',
        items: [
            { href: '/settings', label: 'Cài đặt', icon: '⚙️' },
            { href: '/roles', label: 'Phân quyền', icon: '🔐' },
        ]
    },
];

const quickActions = [
    { icon: '🎫', label: 'Tạo Voucher', href: '/vouchers', color: 'bg-purple-100 text-purple-600' },
    { icon: '🔔', label: 'Gửi thông báo', href: '/notifications', color: 'bg-blue-100 text-blue-600' },
    { icon: '📦', label: 'Thêm SP', href: '/products', color: 'bg-green-100 text-green-600' },
    { icon: '🏪', label: 'Thêm CH', href: '/stores', color: 'bg-orange-100 text-orange-600' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [collapsed, setCollapsed] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);

    const notifications = [
        { id: 1, title: 'Đơn hàng mới #DH0123', desc: 'Khách hàng đã đặt hàng với tổng 2.5tr', time: '2 phút trước', type: 'order' },
        { id: 2, title: 'Cửa hàng mới đăng ký', desc: 'Tiệm Bánh ABC vừa đăng ký thuê mặt bằng', time: '15 phút trước', type: 'store' },
        { id: 3, title: 'Báo cáo doanh thu', desc: 'Doanh thu hôm nay đạt 1.2 tỷ đồng', time: '30 phút trước', type: 'report' },
        { id: 4, title: 'Cảnh báo tồn kho', desc: 'Sản phẩm "Áo thun nam" sắp hết hàng', time: '1 giờ trước', type: 'alert' },
    ];

    const isActive = (href: string) => {
        if (href === '/') return router.pathname === '/';
        return router.pathname.startsWith(href);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className={`
                fixed inset-y-0 left-0 z-50 bg-white border-r border-gray-200 
                transition-all duration-300 ease-in-out
                ${collapsed ? 'w-16' : 'w-64'}
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                lg:translate-x-0 lg:static lg:inset-auto
            `}>
                {/* Logo */}
                <div className={`h-16 flex items-center border-b border-gray-200 ${collapsed ? 'justify-center px-0' : 'px-5'}`}>
                    {collapsed ? (
                        <Link href="/" className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-bold text-sm">SM</span>
                        </Link>
                    ) : (
                        <Link href="/" className="flex items-center gap-2.5">
                            <div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center flex-shrink-0">
                                <span className="text-white font-bold text-sm">SM</span>
                            </div>
                            <div>
                                <span className="font-bold text-gray-900 text-sm">Smart Mall</span>
                                <span className="block text-[10px] text-gray-400 font-medium -mt-0.5">Admin Panel</span>
                            </div>
                        </Link>
                    )}
                </div>

                {/* Collapse Toggle (Desktop) */}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="hidden lg:flex absolute -right-3 top-16 w-6 h-6 bg-white border border-gray-200 rounded-full items-center justify-center hover:bg-gray-50 shadow-sm"
                >
                    <svg className={`w-3 h-3 text-gray-400 transition-transform ${collapsed ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>

                {/* Navigation */}
                <nav className={`p-3 overflow-y-auto h-[calc(100vh-4rem)] space-y-1`}>
                    {sidebarItems.map((section) => (
                        <div key={section.section} className="mb-4">
                            {!collapsed && (
                                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-2 mb-1.5">
                                    {section.section}
                                </p>
                            )}
                            {section.items.map((item) => {
                                const active = isActive(item.href);
                                return collapsed ? (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`sidebar-item sidebar-item-collapsed ${active ? 'sidebar-item-active' : 'sidebar-item-inactive'}`}
                                        title={item.label}
                                    >
                                        <span className="text-lg">{item.icon}</span>
                                    </Link>
                                ) : (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`sidebar-item ${active ? 'sidebar-item-active' : 'sidebar-item-inactive'}`}
                                    >
                                        <span className="text-lg">{item.icon}</span>
                                        <span className="flex-1">{item.label}</span>
                                        {item.badge && (
                                            <span className={`${item.badgeColor || 'bg-primary-500'} text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center`}>
                                                {item.badge}
                                            </span>
                                        )}
                                    </Link>
                                );
                            })}
                        </div>
                    ))}
                </nav>

                {/* Sidebar Footer */}
                {!collapsed && (
                    <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-gray-100 bg-white">
                        <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-gray-50 cursor-pointer">
                            <div className="w-7 h-7 bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                VT
                            </div>
                            <div className="min-w-0">
                                <p className="text-xs font-medium text-gray-900 truncate">Vũ Thanh</p>
                                <p className="text-[10px] text-gray-400 truncate">Super Admin</p>
                            </div>
                        </div>
                    </div>
                )}
            </aside>

            {/* Overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
            )}

            {/* Main Content */}
            <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${collapsed ? 'lg:ml-0' : ''}`}>
                {/* Header */}
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
                    <div className="flex items-center gap-3">
                        <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-gray-100 -ml-1">
                            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>

                        {/* Search Bar */}
                        <div className="hidden sm:flex relative">
                            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Tìm kiếm..."
                                className="w-64 lg:w-80 pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white transition-all"
                            />
                            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">⌘K</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-1 sm:gap-2">
                        {/* Quick Actions (desktop) */}
                        <div className="hidden lg:flex items-center gap-1 mr-2 pr-2 border-r border-gray-200">
                            {quickActions.map(action => (
                                <Link
                                    key={action.label}
                                    href={action.href}
                                    className="p-2 rounded-lg hover:bg-gray-100 text-xs tooltip"
                                >
                                    <span>{action.icon}</span>
                                    <span className="tooltip-content">{action.label}</span>
                                </Link>
                            ))}
                        </div>

                        {/* Notifications */}
                        <div className="relative">
                            <button
                                onClick={() => { setShowNotifications(!showNotifications); setShowUserMenu(false); }}
                                className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
                            </button>

                            {/* Notification Dropdown */}
                            {showNotifications && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
                                    <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-lg border border-gray-200 z-50 overflow-hidden">
                                        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                                            <h3 className="font-semibold text-gray-900">Thông báo</h3>
                                            <span className="text-xs text-primary-600 hover:underline cursor-pointer">Đánh dấu đã đọc</span>
                                        </div>
                                        <div className="max-h-80 overflow-y-auto divide-y divide-gray-100">
                                            {notifications.map(n => (
                                                <div key={n.id} className="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors">
                                                    <div className="flex gap-3">
                                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0 ${n.type === 'order' ? 'bg-blue-100' : n.type === 'store' ? 'bg-green-100' : n.type === 'report' ? 'bg-purple-100' : 'bg-orange-100'
                                                            }`}>
                                                            {n.type === 'order' ? '📋' : n.type === 'store' ? '🏪' : n.type === 'report' ? '📊' : '⚠️'}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="text-sm font-medium text-gray-900 truncate">{n.title}</p>
                                                            <p className="text-xs text-gray-500 mt-0.5">{n.desc}</p>
                                                            <p className="text-[10px] text-gray-400 mt-1">{n.time}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="p-3 border-t border-gray-100 text-center">
                                            <button className="text-sm text-primary-600 hover:underline font-medium">Xem tất cả thông báo</button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* User Menu */}
                        <div className="relative">
                            <button
                                onClick={() => { setShowUserMenu(!showUserMenu); setShowNotifications(false); }}
                                className="flex items-center gap-2 pl-2 pr-1.5 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                <div className="w-7 h-7 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                    VT
                                </div>
                                <div className="hidden sm:block text-left">
                                    <p className="text-xs font-medium text-gray-900 leading-tight">Vũ Thanh</p>
                                    <p className="text-[10px] text-gray-400 leading-tight">admin@smartmall.vn</p>
                                </div>
                                <svg className="w-3.5 h-3.5 text-gray-400 hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {/* User Dropdown */}
                            {showUserMenu && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 z-50 overflow-hidden">
                                        <div className="p-4 border-b border-gray-100">
                                            <p className="text-sm font-medium text-gray-900">Vũ Thanh</p>
                                            <p className="text-xs text-gray-500">admin@smartmall.vn</p>
                                        </div>
                                        <div className="py-1">
                                            {[
                                                { label: 'Hồ sơ', icon: '👤', href: '/settings' },
                                                { label: 'Cài đặt tài khoản', icon: '⚙️', href: '/settings' },
                                                { label: 'Lịch sử hoạt động', icon: '📋', href: '/reports' },
                                            ].map(item => (
                                                <Link key={item.label} href={item.href} className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                                    <span>{item.icon}</span>
                                                    {item.label}
                                                </Link>
                                            ))}
                                        </div>
                                        <div className="border-t border-gray-100 py-1">
                                            <button className="flex items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full transition-colors">
                                                <span>🚪</span>
                                                Đăng xuất
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </header>

                {/* Page Header (Breadcrumb) */}
                <div className="hidden sm:flex items-center gap-2 px-6 py-3 bg-white border-b border-gray-100 text-xs text-gray-500">
                    <Link href="/" className="hover:text-primary-600 transition-colors">Trang chủ</Link>
                    {router.pathname !== '/' && (
                        <>
                            <span>/</span>
                            <span className="text-gray-900 font-medium">
                                {sidebarItems.flatMap(s => s.items).find(i => isActive(i.href))?.label || 'Trang'}
                            </span>
                        </>
                    )}
                </div>

                {/* Page Content */}
                <main className="flex-1 p-4 lg:p-6 overflow-auto">
                    {children}
                </main>

                {/* Footer */}
                <footer className="px-6 py-4 border-t border-gray-200 bg-white">
                    <div className="flex items-center justify-between text-xs text-gray-400">
                        <p>&copy; 2026 Smart Mall Management System. All rights reserved.</p>
                        <div className="flex items-center gap-4">
                            <span>v2.0.0</span>
                            <span>•</span>
                            <span>Phiên bản Beta</span>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
}