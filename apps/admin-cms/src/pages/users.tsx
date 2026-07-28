import React, { useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';

const formatPrice = (amount: number) => {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

interface User {
    id: number;
    name: string;
    email: string;
    phone: string;
    role: 'admin' | 'customer' | 'store_owner' | 'staff';
    status: 'active' | 'locked' | 'pending';
    orders: number;
    spent: number;
    joined: string;
    lastActive?: string;
    avatar?: string;
}

const mockUsers: User[] = [
    { id: 1, name: 'Nguyễn Văn A', email: 'nguyenvana@email.com', phone: '0912345678', role: 'admin', status: 'active', orders: 45, spent: 12500000, joined: '2024-01-15', lastActive: '2 phút trước' },
    { id: 2, name: 'Trần Thị B', email: 'tranthib@email.com', phone: '0923456789', role: 'customer', status: 'active', orders: 12, spent: 3200000, joined: '2024-03-20', lastActive: '15 phút trước' },
    { id: 3, name: 'Lê Văn C', email: 'levanc@email.com', phone: '0934567890', role: 'store_owner', status: 'active', orders: 0, spent: 0, joined: '2024-02-10', lastActive: '1 giờ trước' },
    { id: 4, name: 'Phạm Thị D', email: 'phamthid@email.com', phone: '0945678901', role: 'customer', status: 'locked', orders: 3, spent: 890000, joined: '2024-05-05', lastActive: '3 ngày trước' },
    { id: 5, name: 'Hoàng Văn E', email: 'hoangvane@email.com', phone: '0956789012', role: 'staff', status: 'active', orders: 0, spent: 0, joined: '2024-04-01', lastActive: '30 phút trước' },
    { id: 6, name: 'Đặng Thị F', email: 'dangthif@email.com', phone: '0967890123', role: 'customer', status: 'active', orders: 28, spent: 8900000, joined: '2024-01-20', lastActive: '5 phút trước' },
    { id: 7, name: 'Bùi Văn G', email: 'buivang@email.com', phone: '0978901234', role: 'customer', status: 'pending', orders: 1, spent: 150000, joined: '2024-06-10', lastActive: 'Chưa truy cập' },
    { id: 8, name: 'Vũ Thị H', email: 'vuthih@email.com', phone: '0989012345', role: 'store_owner', status: 'active', orders: 0, spent: 0, joined: '2024-03-15', lastActive: '10 phút trước' },
    { id: 9, name: 'Ngô Văn I', email: 'ngovani@email.com', phone: '0990123456', role: 'customer', status: 'active', orders: 67, spent: 25000000, joined: '2023-11-01', lastActive: '1 phút trước' },
    { id: 10, name: 'Lý Thị K', email: 'lythik@email.com', phone: '0901234567', role: 'customer', status: 'locked', orders: 0, spent: 0, joined: '2024-07-01', lastActive: '1 tuần trước' },
];

const roleLabels: Record<string, string> = {
    admin: 'Quản trị viên',
    customer: 'Khách hàng',
    store_owner: 'Chủ cửa hàng',
    staff: 'Nhân viên',
};

const roleColors: Record<string, string> = {
    admin: 'badge-danger',
    customer: 'badge-info',
    store_owner: 'badge-warning',
    staff: 'badge-success',
};

export default function UsersPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
    const [page, setPage] = useState(1);
    const rowsPerPage = 5;

    const filteredUsers = mockUsers.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.phone.includes(searchQuery);
        const matchesRole = roleFilter === 'all' || user.role === roleFilter;
        const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
        return matchesSearch && matchesRole && matchesStatus;
    });

    const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);
    const paginatedUsers = filteredUsers.slice((page - 1) * rowsPerPage, page * rowsPerPage);

    const toggleSelectUser = (id: number) => {
        setSelectedUsers(prev =>
            prev.includes(id) ? prev.filter(uId => uId !== id) : [...prev, id]
        );
    };

    const toggleSelectAll = () => {
        if (selectedUsers.length === paginatedUsers.length) {
            setSelectedUsers([]);
        } else {
            setSelectedUsers(paginatedUsers.map(u => u.id));
        }
    };

    const handleExport = () => {
        toast.success('Đang xuất file Excel...');
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">👥 Người dùng</h1>
                    <p className="text-sm text-gray-500 mt-1">Quản lý tất cả người dùng trong hệ thống</p>
                </div>
                <div className="flex gap-2">
                    {selectedUsers.length > 0 && (
                        <>
                            <button onClick={() => toast.success(`Đã khóa ${selectedUsers.length} người dùng`)} className="btn-outline btn-sm text-red-600 border-red-200 hover:bg-red-50">
                                🔒 Khóa
                            </button>
                            <button onClick={() => toast.success(`Đã xóa ${selectedUsers.length} người dùng`)} className="btn-danger btn-sm">
                                🗑️ Xóa
                            </button>
                        </>
                    )}
                    <button onClick={() => toast.success('Tính năng đang phát triển')} className="btn-primary">
                        + Thêm người dùng
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4">
                <div className="stat-card">
                    <p className="text-sm text-gray-500">Tổng người dùng</p>
                    <p className="text-2xl font-bold">{mockUsers.length}</p>
                </div>
                <div className="stat-card">
                    <p className="text-sm text-gray-500">Khách hàng</p>
                    <p className="text-2xl font-bold text-blue-600">{mockUsers.filter(u => u.role === 'customer').length}</p>
                </div>
                <div className="stat-card">
                    <p className="text-sm text-gray-500">Chủ cửa hàng</p>
                    <p className="text-2xl font-bold text-orange-600">{mockUsers.filter(u => u.role === 'store_owner').length}</p>
                </div>
                <div className="stat-card">
                    <p className="text-sm text-gray-500">Đang hoạt động</p>
                    <p className="text-2xl font-bold text-green-600">{mockUsers.filter(u => u.status === 'active').length}</p>
                </div>
                <div className="stat-card">
                    <p className="text-sm text-gray-500">Bị khóa</p>
                    <p className="text-2xl font-bold text-red-600">{mockUsers.filter(u => u.status === 'locked').length}</p>
                </div>
            </div>

            {/* Filters */}
            <div className="card">
                <div className="card-body">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 relative">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
                                placeholder="Tìm kiếm theo tên, email, SĐT..."
                                className="input-field pl-10"
                            />
                            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <select value={roleFilter} onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }} className="select-field w-auto">
                            <option value="all">Tất cả vai trò</option>
                            <option value="admin">Quản trị viên</option>
                            <option value="customer">Khách hàng</option>
                            <option value="store_owner">Chủ cửa hàng</option>
                            <option value="staff">Nhân viên</option>
                        </select>
                        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} className="select-field w-auto">
                            <option value="all">Tất cả trạng thái</option>
                            <option value="active">Đang hoạt động</option>
                            <option value="locked">Đã khóa</option>
                            <option value="pending">Chờ duyệt</option>
                        </select>
                        <button onClick={handleExport} className="btn-secondary">
                            📥 Xuất Excel
                        </button>
                    </div>
                </div>
            </div>

            {/* Users Table */}
            <div className="card overflow-hidden">
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th className="w-12">
                                    <input
                                        type="checkbox"
                                        checked={selectedUsers.length === paginatedUsers.length && paginatedUsers.length > 0}
                                        onChange={toggleSelectAll}
                                        className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                    />
                                </th>
                                <th>Người dùng</th>
                                <th>Vai trò</th>
                                <th>Trạng thái</th>
                                <th className="text-right">Đơn hàng</th>
                                <th className="text-right">Đã chi</th>
                                <th>Ngày tham gia</th>
                                <th>Hoạt động</th>
                                <th className="text-center">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedUsers.map(user => (
                                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                    <td>
                                        <input
                                            type="checkbox"
                                            checked={selectedUsers.includes(user.id)}
                                            onChange={() => toggleSelectUser(user.id)}
                                            className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                        />
                                    </td>
                                    <td>
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                                                {user.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                                                <p className="text-xs text-gray-500">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`badge ${roleColors[user.role]}`}>{roleLabels[user.role]}</span>
                                    </td>
                                    <td>
                                        <span className={`badge ${user.status === 'active' ? 'badge-success' : user.status === 'locked' ? 'badge-danger' : 'badge-warning'}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'active' ? 'bg-green-500' : user.status === 'locked' ? 'bg-red-500' : 'bg-yellow-500'}`} />
                                            {user.status === 'active' ? 'Hoạt động' : user.status === 'locked' ? 'Đã khóa' : 'Chờ duyệt'}
                                        </span>
                                    </td>
                                    <td className="text-right font-medium">{user.orders}</td>
                                    <td className="text-right font-medium">{formatPrice(user.spent)}₫</td>
                                    <td className="text-gray-500">{user.joined}</td>
                                    <td>
                                        <span className="text-xs text-gray-400">{user.lastActive || 'N/A'}</span>
                                    </td>
                                    <td className="text-center">
                                        <div className="flex items-center justify-center gap-1">
                                            <button onClick={() => toast.success('Mở chi tiết người dùng')} className="btn-ghost btn-xs">👁️</button>
                                            <button onClick={() => toast.success('Chỉnh sửa người dùng')} className="btn-ghost btn-xs">✏️</button>
                                            <button
                                                onClick={() => toast.success(user.status === 'active' ? 'Đã khóa người dùng' : 'Đã mở khóa người dùng')}
                                                className={`btn-ghost btn-xs ${user.status === 'active' ? 'text-red-600' : 'text-green-600'}`}
                                            >
                                                {user.status === 'active' ? '🔒' : '🔓'}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredUsers.length === 0 && (
                    <div className="empty-state">
                        <div className="empty-state-icon">👥</div>
                        <h3 className="text-lg font-medium text-gray-900 mb-1">Không tìm thấy người dùng</h3>
                        <p className="text-sm text-gray-500">Thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa khác</p>
                    </div>
                )}

                {/* Pagination */}
                {filteredUsers.length > 0 && (
                    <div className="card-footer flex items-center justify-between">
                        <p className="text-sm text-gray-500">
                            Hiển thị {((page - 1) * rowsPerPage) + 1}-{Math.min(page * rowsPerPage, filteredUsers.length)} / {filteredUsers.length} người dùng
                        </p>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="btn-outline btn-xs"
                            >
                                Trước
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                                <button
                                    key={p}
                                    onClick={() => setPage(p)}
                                    className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${page === p ? 'bg-primary-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                                >
                                    {p}
                                </button>
                            ))}
                            <button
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className="btn-outline btn-xs"
                            >
                                Sau
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}