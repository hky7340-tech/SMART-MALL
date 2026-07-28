import React, { useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { formatNumber, formatFullPrice } from '@/utils/format';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

// Customer data
interface Customer {
    id: number;
    name: string;
    email: string;
    phone: string;
    totalOrders: number;
    totalSpent: number;
    lastOrder: string;
    membership: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
    status: 'active' | 'inactive' | 'vip';
    joinDate: string;
    city: string;
}

const mockCustomers: Customer[] = [
    { id: 1, name: 'Nguyễn Văn A', email: 'nguyenvana@email.com', phone: '0912345678', totalOrders: 45, totalSpent: 12500000, lastOrder: '2 phút trước', membership: 'gold', status: 'active', joinDate: '2024-01-15', city: 'Hồ Chí Minh' },
    { id: 2, name: 'Trần Thị B', email: 'tranthib@email.com', phone: '0923456789', totalOrders: 12, totalSpent: 3200000, lastOrder: '15 phút trước', membership: 'silver', status: 'active', joinDate: '2024-03-20', city: 'Hà Nội' },
    { id: 3, name: 'Lê Văn C', email: 'levanc@email.com', phone: '0934567890', totalOrders: 28, totalSpent: 8900000, lastOrder: '1 giờ trước', membership: 'gold', status: 'vip', joinDate: '2024-02-10', city: 'Đà Nẵng' },
    { id: 4, name: 'Phạm Thị D', email: 'phamthid@email.com', phone: '0945678901', totalOrders: 3, totalSpent: 890000, lastOrder: '3 ngày trước', membership: 'bronze', status: 'inactive', joinDate: '2024-05-05', city: 'Hồ Chí Minh' },
    { id: 5, name: 'Hoàng Văn E', email: 'hoangvane@email.com', phone: '0956789012', totalOrders: 67, totalSpent: 25000000, lastOrder: '1 phút trước', membership: 'diamond', status: 'vip', joinDate: '2023-11-01', city: 'Hà Nội' },
    { id: 6, name: 'Đặng Thị F', email: 'dangthif@email.com', phone: '0967890123', totalOrders: 28, totalSpent: 8900000, lastOrder: '5 phút trước', membership: 'gold', status: 'active', joinDate: '2024-01-20', city: 'Hải Phòng' },
    { id: 7, name: 'Bùi Văn G', email: 'buivang@email.com', phone: '0978901234', totalOrders: 1, totalSpent: 150000, lastOrder: 'Chưa truy cập', membership: 'bronze', status: 'inactive', joinDate: '2024-06-10', city: 'Cần Thơ' },
    { id: 8, name: 'Ngô Văn I', email: 'ngovani@email.com', phone: '0990123456', totalOrders: 67, totalSpent: 25000000, lastOrder: '1 phút trước', membership: 'platinum', status: 'vip', joinDate: '2023-11-01', city: 'Hồ Chí Minh' },
];

const membershipColors: Record<string, string> = { bronze: 'badge-neutral', silver: 'badge-info', gold: 'badge-warning', platinum: 'badge-purple', diamond: 'badge-danger' };
const membershipLabels: Record<string, string> = { bronze: 'Đồng', silver: 'Bạc', gold: 'Vàng', platinum: 'Bạch kim', diamond: 'Kim cương' };

const revenueByMonth = [
    { month: 'T1', revenue: 8500000000, customers: 1200 },
    { month: 'T2', revenue: 9200000000, customers: 1350 },
    { month: 'T3', revenue: 10100000000, customers: 1500 },
    { month: 'T4', revenue: 11500000000, customers: 1650 },
    { month: 'T5', revenue: 10800000000, customers: 1580 },
    { month: 'T6', revenue: 12580000000, customers: 1800 },
];

const customerSegmentData = [
    { name: 'VIP', value: 15, color: '#8b5cf6' },
    { name: 'Thân thiết', value: 25, color: '#3b82f6' },
    { name: 'Thường xuyên', value: 30, color: '#10b981' },
    { name: 'Tiềm năng', value: 20, color: '#f59e0b' },
    { name: 'Mới', value: 10, color: '#6b7280' },
];

export default function CustomersPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [membershipFilter, setMembershipFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [activeTab, setActiveTab] = useState<'list' | 'analytics'>('list');

    const filtered = mockCustomers.filter(c => {
        const matchSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.email.toLowerCase().includes(searchQuery.toLowerCase()) || c.phone.includes(searchQuery);
        const matchMembership = membershipFilter === 'all' || c.membership === membershipFilter;
        const matchStatus = statusFilter === 'all' || c.status === statusFilter;
        return matchSearch && matchMembership && matchStatus;
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">🤝 CRM - Khách hàng</h1>
                    <p className="text-sm text-gray-500 mt-1">Quản lý thông tin khách hàng 360°</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => toast.success('Đang xuất Excel...')} className="btn-secondary">📥 Xuất Excel</button>
                </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                <div className="stat-card"><p className="text-sm text-gray-500">Tổng KH</p><p className="text-2xl font-bold">{mockCustomers.length}</p></div>
                <div className="stat-card stat-card-green"><p className="text-sm text-gray-500">Đang hoạt động</p><p className="text-2xl font-bold text-green-600">{mockCustomers.filter(c => c.status === 'active').length}</p></div>
                <div className="stat-card stat-card-purple"><p className="text-sm text-gray-500">VIP</p><p className="text-2xl font-bold text-purple-600">{mockCustomers.filter(c => c.status === 'vip').length}</p></div>
                <div className="stat-card stat-card-blue"><p className="text-sm text-gray-500">Tổng chi tiêu</p><p className="text-2xl font-bold text-blue-600">{formatFullPrice(mockCustomers.reduce((s, c) => s + c.totalSpent, 0))}</p></div>
                <div className="stat-card stat-card-orange"><p className="text-sm text-gray-500">Đơn/KH</p><p className="text-2xl font-bold text-orange-600">{Math.round(mockCustomers.reduce((s, c) => s + c.totalOrders, 0) / mockCustomers.length)}</p></div>
            </div>

            <div className="flex gap-2">
                <button onClick={() => setActiveTab('list')} className={`tab ${activeTab === 'list' ? 'tab-active' : 'tab-inactive'}`}>📋 Danh sách KH</button>
                <button onClick={() => setActiveTab('analytics')} className={`tab ${activeTab === 'analytics' ? 'tab-active' : 'tab-inactive'}`}>📊 Phân tích</button>
            </div>

            {activeTab === 'list' && (
                <>
                    <div className="card"><div className="card-body">
                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="flex-1 relative">
                                <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Tìm kiếm tên, email, SĐT..." className="input-field pl-10" />
                                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                            </div>
                            <select value={membershipFilter} onChange={e => setMembershipFilter(e.target.value)} className="select-field w-auto">
                                <option value="all">Tất cả hạng</option>
                                <option value="diamond">Kim cương</option>
                                <option value="platinum">Bạch kim</option>
                                <option value="gold">Vàng</option>
                                <option value="silver">Bạc</option>
                                <option value="bronze">Đồng</option>
                            </select>
                            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="select-field w-auto">
                                <option value="all">Tất cả trạng thái</option>
                                <option value="active">Hoạt động</option>
                                <option value="inactive">Không hoạt động</option>
                                <option value="vip">VIP</option>
                            </select>
                        </div>
                    </div></div>

                    <div className="card overflow-hidden">
                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Khách hàng</th>
                                        <th>Liên hệ</th>
                                        <th>Hạng</th>
                                        <th>Trạng thái</th>
                                        <th className="text-right">Đơn hàng</th>
                                        <th className="text-right">Tổng chi</th>
                                        <th>Hoạt động gần</th>
                                        <th className="text-center">Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.map(c => (
                                        <tr key={c.id} className="hover:bg-gray-50">
                                            <td>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                                        {c.name.charAt(0)}
                                                    </div>
                                                    <p className="text-sm font-medium text-gray-900">{c.name}</p>
                                                </div>
                                            </td>
                                            <td className="text-xs text-gray-500">
                                                <p>{c.email}</p>
                                                <p>{c.phone}</p>
                                            </td>
                                            <td><span className={`badge ${membershipColors[c.membership]}`}>{membershipLabels[c.membership]}</span></td>
                                            <td>
                                                <span className={`badge ${c.status === 'vip' ? 'badge-purple' : c.status === 'active' ? 'badge-success' : 'badge-neutral'}`}>
                                                    {c.status === 'vip' ? '👑 VIP' : c.status === 'active' ? 'Hoạt động' : 'Vắng'}
                                                </span>
                                            </td>
                                            <td className="text-right font-medium">{c.totalOrders}</td>
                                            <td className="text-right font-semibold">{formatFullPrice(c.totalSpent)}</td>
                                            <td className="text-xs text-gray-500">{c.lastOrder}</td>
                                            <td className="text-center">
                                                <div className="flex justify-center gap-1">
                                                    <button onClick={() => toast.success('Xem chi tiết KH')} className="btn-ghost btn-xs">👁️</button>
                                                    <button onClick={() => toast.success('Gửi thông báo')} className="btn-ghost btn-xs">✉️</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}

            {activeTab === 'analytics' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="card">
                        <div className="card-header"><h3 className="font-semibold text-gray-900">Doanh thu & KH mới</h3></div>
                        <div className="card-body">
                            <div className="h-72">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={revenueByMonth}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                        <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                                        <YAxis tick={{ fontSize: 12 }} />
                                        <Tooltip />
                                        <Bar dataKey="revenue" name="Doanh thu" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                        <Bar dataKey="customers" name="KH mới" fill="#10b981" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                    <div className="card">
                        <div className="card-header"><h3 className="font-semibold text-gray-900">Phân khúc KH</h3></div>
                        <div className="card-body">
                            <div className="h-72">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={customerSegmentData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={3} dataKey="value">
                                            {customerSegmentData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="grid grid-cols-2 gap-2 mt-4">
                                {customerSegmentData.map(seg => (
                                    <div key={seg.name} className="flex items-center gap-2 text-sm">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: seg.color }} />
                                        <span className="text-gray-600">{seg.name}</span>
                                        <span className="font-medium ml-auto">{seg.value}%</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}