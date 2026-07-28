import React, { useState } from 'react';
import Link from 'next/link';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, Legend
} from 'recharts';
import { formatNumber, formatPrice, formatFullPrice } from '@/utils/format';

const kpiData = {
    totalRevenue: 12580000000,
    revenueGrowth: 12.5,
    totalCustomers: 45890,
    customerGrowth: 8.3,
    totalOrders: 12560,
    orderGrowth: 15.2,
    totalStores: 156,
    storeGrowth: 5.1,
    aov: 892000,
    nps: 72,
    conversionRate: 3.8,
    activeUsers: 1234,
};

const revenueChart = [
    { month: 'T1', revenue: 8500000000, orders: 8500, profit: 2100000000 },
    { month: 'T2', revenue: 9200000000, orders: 9100, profit: 2400000000 },
    { month: 'T3', revenue: 10100000000, orders: 10200, profit: 2800000000 },
    { month: 'T4', revenue: 11500000000, orders: 11500, profit: 3200000000 },
    { month: 'T5', revenue: 10800000000, orders: 10800, profit: 2900000000 },
    { month: 'T6', revenue: 12580000000, orders: 12560, profit: 3500000000 },
];

const categoryData = [
    { name: 'Điện tử', value: 35, color: '#3b82f6' },
    { name: 'Thời trang', value: 25, color: '#8b5cf6' },
    { name: 'Ẩm thực', value: 20, color: '#f59e0b' },
    { name: 'Giải trí', value: 12, color: '#10b981' },
    { name: 'Khác', value: 8, color: '#6b7280' },
];

const topProducts = [
    { name: 'Áo thun nam cao cấp', revenue: 1250000000, sold: 4200, store: 'Fashion Hub' },
    { name: 'Điện thoại XYZ Pro', revenue: 3200000000, sold: 200, store: 'TechZone' },
    { name: 'Combo trà sữa', revenue: 245000000, sold: 5000, store: 'Trà Sữa Đài Loan' },
    { name: 'Tai nghe Bluetooth', revenue: 890000000, sold: 1000, store: 'TechZone' },
    { name: 'Kem dưỡng da', revenue: 599000000, sold: 1000, store: 'Fashion Hub' },
];

const recentOrders = [
    { id: 'DH001', customer: 'Nguyễn Văn A', total: 299000, status: 'completed', store: 'Fashion Hub', time: '5 phút trước', items: 3 },
    { id: 'DH002', customer: 'Trần Thị B', total: 15999000, status: 'processing', store: 'TechZone', time: '12 phút trước', items: 1 },
    { id: 'DH003', customer: 'Lê Văn C', total: 49000, status: 'pending', store: 'Trà Sữa', time: '20 phút trước', items: 2 },
    { id: 'DH004', customer: 'Phạm Thị D', total: 890000, status: 'completed', store: 'Hải Sản', time: '30 phút trước', items: 5 },
    { id: 'DH005', customer: 'Hoàng Văn E', total: 250000, status: 'cancelled', store: 'Galaxy Cinema', time: '1 giờ trước', items: 2 },
];

const storeRanking = [
    { name: 'TechZone', revenue: 5200000000, growth: 18.5, color: '#3b82f6' },
    { name: 'Fashion Hub', revenue: 3800000000, growth: 12.3, color: '#8b5cf6' },
    { name: 'Hải Sản Biển Đông', revenue: 2100000000, growth: 25.7, color: '#10b981' },
    { name: 'Trà Sữa Đài Loan', revenue: 980000000, growth: 8.9, color: '#f59e0b' },
    { name: 'Galaxy Cinema', revenue: 750000000, growth: -2.1, color: '#ef4444' },
];

const hourlyTraffic = [
    { hour: '6h', visitors: 120 }, { hour: '8h', visitors: 450 }, { hour: '10h', visitors: 890 },
    { hour: '12h', visitors: 1200 }, { hour: '14h', visitors: 980 }, { hour: '16h', visitors: 1100 },
    { hour: '18h', visitors: 1500 }, { hour: '20h', visitors: 1800 }, { hour: '22h', visitors: 900 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200 text-sm">
                <p className="font-medium text-gray-900 mb-1">{label}</p>
                {payload.map((entry: any, index: number) => (
                    <p key={index} className="text-gray-600">
                        {entry.name}: <span className="font-semibold" style={{ color: entry.color }}>{formatFullPrice(entry.value)}</span>
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

export default function AdminDashboard() {
    const [dateRange, setDateRange] = useState('month');
    const [chartView, setChartView] = useState<'revenue' | 'orders'>('revenue');

    const stats = [
        { label: 'Tổng doanh thu', value: formatFullPrice(kpiData.totalRevenue), growth: kpiData.revenueGrowth, color: 'blue', icon: '💰' },
        { label: 'Tổng khách hàng', value: formatNumber(kpiData.totalCustomers), growth: kpiData.customerGrowth, color: 'green', icon: '👥' },
        { label: 'Tổng đơn hàng', value: formatNumber(kpiData.totalOrders), growth: kpiData.orderGrowth, color: 'purple', icon: '📋' },
        { label: 'Cửa hàng', value: kpiData.totalStores.toString(), growth: kpiData.storeGrowth, color: 'orange', icon: '🏪' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-sm text-gray-500 mt-1">Tổng quan hoạt động Smart Mall</p>
                </div>
                <div className="flex gap-1.5 bg-gray-100 p-1 rounded-lg">
                    {['today', 'week', 'month', 'year'].map(range => (
                        <button key={range} onClick={() => setDateRange(range)} className={`px-3.5 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${dateRange === range ? 'bg-white text-primary-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                            {range === 'today' ? 'Hôm nay' : range === 'week' ? 'Tuần' : range === 'month' ? 'Tháng' : 'Năm'}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map(stat => (
                    <div key={stat.label} className={`stat-card stat-card-${stat.color}`}>
                        <div className="flex items-start justify-between mb-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${stat.color === 'blue' ? 'bg-blue-100' : stat.color === 'green' ? 'bg-green-100' : stat.color === 'purple' ? 'bg-purple-100' : 'bg-orange-100'}`}>{stat.icon}</div>
                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${stat.growth > 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>{stat.growth > 0 ? '↑' : '↓'} {Math.abs(stat.growth)}%</span>
                        </div>
                        <p className="text-sm text-gray-500 mb-0.5">{stat.label}</p>
                        <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                        <p className="text-xs text-gray-400 mt-1">So với kỳ trước</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="stat-card"><p className="text-sm text-gray-500 mb-1">Giá trị đơn TB (AOV)</p><p className="text-xl font-bold text-gray-900">{formatFullPrice(kpiData.aov)}</p></div>
                <div className="stat-card">
                    <p className="text-sm text-gray-500 mb-1">NPS Score</p>
                    <div className="flex items-center gap-2">
                        <p className="text-xl font-bold text-primary-600">{kpiData.nps}</p>
                        <div className="flex gap-0.5">
                            {[1, 2, 3, 4, 5].map(star => (
                                <svg key={star} className={`w-4 h-4 ${star <= Math.round(kpiData.nps / 20) ? 'text-yellow-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="stat-card"><p className="text-sm text-gray-500 mb-1">Tỷ lệ chuyển đổi</p><p className="text-xl font-bold text-gray-900">{kpiData.conversionRate}%</p><div className="mt-2 progress-bar h-1.5"><div className="progress-bar-fill bg-primary-500" style={{ width: `${kpiData.conversionRate * 10}%` }} /></div></div>
                <div className="stat-card"><p className="text-sm text-gray-500 mb-1">Người dùng đang online</p><div className="flex items-center gap-2"><div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" /><p className="text-xl font-bold text-gray-900">{formatNumber(kpiData.activeUsers)}</p></div></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 card">
                    <div className="card-header">
                        <div><h3 className="font-semibold text-gray-900">Doanh thu & Lợi nhuận</h3><p className="text-xs text-gray-500 mt-0.5">Biểu đồ doanh thu theo tháng</p></div>
                        <div className="flex gap-1.5 bg-gray-100 p-0.5 rounded-lg">
                            {['revenue', 'orders'].map(view => (
                                <button key={view} onClick={() => setChartView(view as 'revenue' | 'orders')} className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${chartView === view ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                                    {view === 'revenue' ? 'Doanh thu' : 'Đơn hàng'}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="card-body">
                        <div className="h-72">
                            <ResponsiveContainer width="100%" height="100%">
                                {chartView === 'revenue' ? (
                                    <BarChart data={revenueChart} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                        <XAxis dataKey="month" tick={{ fontSize: 12 }} tickLine={false} />
                                        <YAxis tick={{ fontSize: 12 }} tickLine={false} tickFormatter={(v) => `${(v / 1000000000).toFixed(1)}B`} />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Bar dataKey="revenue" name="Doanh thu" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                        <Bar dataKey="profit" name="Lợi nhuận" fill="#10b981" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                ) : (
                                    <LineChart data={revenueChart} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                        <XAxis dataKey="month" tick={{ fontSize: 12 }} tickLine={false} />
                                        <YAxis tick={{ fontSize: 12 }} tickLine={false} />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Line type="monotone" dataKey="orders" name="Đơn hàng" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6', r: 4 }} />
                                    </LineChart>
                                )}
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div className="card-header"><div><h3 className="font-semibold text-gray-900">Danh mục</h3><p className="text-xs text-gray-500 mt-0.5">Phân bố doanh thu</p></div></div>
                    <div className="card-body">
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={categoryData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                                        {categoryData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend verticalAlign="bottom" height={36} formatter={(value) => <span className="text-xs text-gray-600">{value}</span>} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="card">
                    <div className="card-header"><div><h3 className="font-semibold text-gray-900">Lượng truy cập</h3><p className="text-xs text-gray-500 mt-0.5">Theo giờ trong ngày</p></div></div>
                    <div className="card-body"><div className="h-48"><ResponsiveContainer width="100%" height="100%"><AreaChart data={hourlyTraffic} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}><CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" /><XAxis dataKey="hour" tick={{ fontSize: 10 }} tickLine={false} /><YAxis tick={{ fontSize: 10 }} tickLine={false} /><Tooltip /><Area type="monotone" dataKey="visitors" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} strokeWidth={2} /></AreaChart></ResponsiveContainer></div></div>
                </div>
                <div className="card">
                    <div className="card-header"><div><h3 className="font-semibold text-gray-900">Top sản phẩm</h3><p className="text-xs text-gray-500 mt-0.5">Doanh thu cao nhất</p></div><Link href="/products" className="text-xs text-primary-600 hover:underline font-medium">Xem tất cả</Link></div>
                    <div className="card-body"><div className="space-y-4">{topProducts.map((product, index) => (<div key={product.name} className="flex items-center gap-3"><div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 ${index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-orange-500' : 'bg-gray-300'}`}>{index + 1}</div><div className="flex-1 min-w-0"><p className="text-sm font-medium text-gray-900 truncate">{product.name}</p><p className="text-xs text-gray-500">{product.store}</p></div><div className="text-right flex-shrink-0"><p className="text-sm font-semibold text-gray-900">{formatPrice(product.revenue)}</p><p className="text-xs text-gray-500">Đã bán {formatNumber(product.sold)}</p></div></div>))}</div></div>
                </div>
                <div className="card">
                    <div className="card-header"><div><h3 className="font-semibold text-gray-900">Xếp hạng cửa hàng</h3><p className="text-xs text-gray-500 mt-0.5">Doanh thu theo cửa hàng</p></div><Link href="/stores" className="text-xs text-primary-600 hover:underline font-medium">Xem tất cả</Link></div>
                    <div className="card-body"><div className="space-y-4">{storeRanking.map((store, index) => (<div key={store.name}><div className="flex items-center justify-between mb-1.5"><div className="flex items-center gap-2.5"><div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white ${index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-500'}`}>{index + 1}</div><span className="text-sm font-medium text-gray-900">{store.name}</span></div><div className="text-right"><span className="text-sm font-semibold text-gray-900">{formatPrice(store.revenue)}</span><span className={`text-xs font-medium ml-1.5 ${store.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>{store.growth > 0 ? '+' : ''}{store.growth}%</span></div></div><div className="progress-bar h-1.5 ml-8"><div className="progress-bar-fill" style={{ width: `${(store.revenue / 6000000000) * 100}%`, backgroundColor: store.color }} /></div></div>))}</div></div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="card">
                    <div className="card-header"><div><h3 className="font-semibold text-gray-900">Đơn hàng gần đây</h3><p className="text-xs text-gray-500 mt-0.5">5 đơn hàng mới nhất</p></div><Link href="/orders" className="text-xs text-primary-600 hover:underline font-medium">Xem tất cả</Link></div>
                    <div className="divide-y divide-gray-100">{recentOrders.map((order) => (<div key={order.id} className="px-6 py-3.5 flex items-center justify-between hover:bg-gray-50 transition-colors"><div className="flex items-center gap-3"><div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${order.status === 'completed' ? 'bg-green-100' : order.status === 'processing' ? 'bg-blue-100' : order.status === 'pending' ? 'bg-yellow-100' : 'bg-red-100'}`}>{order.status === 'completed' ? '✅' : order.status === 'processing' ? '🔄' : order.status === 'pending' ? '⏳' : '❌'}</div><div><p className="text-sm font-medium text-gray-900">{order.customer}</p><p className="text-xs text-gray-500">{order.id} • {order.items} sản phẩm</p></div></div><div className="text-right"><p className="text-sm font-semibold text-gray-900">{formatFullPrice(order.total)}</p><span className={`badge ${order.status === 'completed' ? 'badge-success' : order.status === 'processing' ? 'badge-info' : order.status === 'pending' ? 'badge-warning' : 'badge-danger'}`}>{order.status === 'completed' ? 'Hoàn thành' : order.status === 'processing' ? 'Đang xử lý' : order.status === 'pending' ? 'Chờ duyệt' : 'Đã hủy'}</span></div></div>))}</div>
                </div>
                <div className="card">
                    <div className="card-header"><div><h3 className="font-semibold text-gray-900">Thao tác nhanh</h3><p className="text-xs text-gray-500 mt-0.5">Các chức năng thường dùng</p></div></div>
                    <div className="card-body"><div className="grid grid-cols-2 sm:grid-cols-4 gap-3">{[
                        { icon: '🎫', label: 'Tạo Voucher', href: '/vouchers', color: 'bg-purple-50 text-purple-600', desc: 'Khuyến mãi mới' },
                        { icon: '🔔', label: 'Gửi thông báo', href: '/notifications', color: 'bg-blue-50 text-blue-600', desc: 'Push notification' },
                        { icon: '📦', label: 'Thêm sản phẩm', href: '/products', color: 'bg-green-50 text-green-600', desc: 'Quản lý SP' },
                        { icon: '🏪', label: 'Thêm cửa hàng', href: '/stores', color: 'bg-orange-50 text-orange-600', desc: 'Đăng ký mới' },
                        { icon: '📊', label: 'Báo cáo', href: '/reports', color: 'bg-red-50 text-red-600', desc: 'Xuất báo cáo' },
                        { icon: '🎪', label: 'Sự kiện mới', href: '/events', color: 'bg-pink-50 text-pink-600', desc: 'Tổ chức sự kiện' },
                        { icon: '👥', label: 'Người dùng', href: '/users', color: 'bg-indigo-50 text-indigo-600', desc: 'Quản lý user' },
                        { icon: '⚙️', label: 'Cài đặt', href: '/settings', color: 'bg-gray-50 text-gray-600', desc: 'Cấu hình hệ thống' },
                    ].map(action => (<Link key={action.label} href={action.href} className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-gray-50 transition-all duration-200 border border-transparent hover:border-gray-200 group"><div className={`w-12 h-12 rounded-xl ${action.color} flex items-center justify-center text-xl group-hover:scale-110 transition-transform`}>{action.icon}</div><div className="text-center"><span className="text-xs font-medium text-gray-700 block">{action.label}</span><span className="text-[10px] text-gray-400">{action.desc}</span></div></Link>))}</div></div>
                </div>
            </div>

            <div className="bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 rounded-xl overflow-hidden shadow-lg">
                <div className="p-6 text-white"><div className="flex items-start gap-4"><div className="w-12 h-12 bg-white/15 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 backdrop-blur-sm">🤖</div><div className="flex-1 min-w-0"><div className="flex items-center gap-2 mb-2"><h3 className="font-semibold">AI Insight</h3><span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full">Phân tích thông minh</span></div><p className="text-white/80 text-sm leading-relaxed">Doanh thu tháng này tăng <strong className="text-white">12.5%</strong> so với tháng trước, chủ yếu đến từ ngành hàng <strong className="text-white">Điện tử & Công nghệ</strong> (+28%). Cửa hàng <strong className="text-white">TechZone</strong> dẫn đầu về doanh thu. <strong className="text-white">Đề xuất:</strong> Tăng ngân sách quảng cáo cho ngành hàng Thời trang để cải thiện doanh thu.</p><div className="flex flex-wrap gap-2 mt-3"><span className="text-xs bg-white/15 px-2.5 py-1 rounded-full backdrop-blur-sm">📈 Doanh thu tăng trưởng</span><span className="text-xs bg-white/15 px-2.5 py-1 rounded-full backdrop-blur-sm">🏆 TechZone dẫn đầu</span><span className="text-xs bg-white/15 px-2.5 py-1 rounded-full backdrop-blur-sm">💡 Đề xuất: Tăng quảng cáo</span></div></div></div></div>
            </div>
        </div>
    );
}