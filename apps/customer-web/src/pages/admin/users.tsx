import React, { useState } from 'react';
import toast from 'react-hot-toast';
import Modal from './_components/Modal';

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
}

const roleLabels: Record<string, string> = { admin: 'Quản trị viên', customer: 'Khách hàng', store_owner: 'Chủ cửa hàng', staff: 'Nhân viên' };
const roleColors: Record<string, string> = { admin: 'badge-danger', customer: 'badge-info', store_owner: 'badge-warning', staff: 'badge-success' };

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

export default function UsersPage() {
    const [users, setUsers] = useState(mockUsers);
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
    const [page, setPage] = useState(1);
    const rowsPerPage = 5;
    const [showUserDetail, setShowUserDetail] = useState(false);
    const [showEditUser, setShowEditUser] = useState(false);
    const [showAddUser, setShowAddUser] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [editForm, setEditForm] = useState({ name: '', email: '', phone: '', role: 'customer' as string });

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) || user.email.toLowerCase().includes(searchQuery.toLowerCase()) || user.phone.includes(searchQuery);
        const matchesRole = roleFilter === 'all' || user.role === roleFilter;
        const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
        return matchesSearch && matchesRole && matchesStatus;
    });

    const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);
    const paginatedUsers = filteredUsers.slice((page - 1) * rowsPerPage, page * rowsPerPage);

    const toggleSelectUser = (id: number) => {
        setSelectedUsers(prev => prev.includes(id) ? prev.filter(uId => uId !== id) : [...prev, id]);
    };

    const toggleSelectAll = () => {
        if (selectedUsers.length === paginatedUsers.length) setSelectedUsers([]);
        else setSelectedUsers(paginatedUsers.map(u => u.id));
    };

    const handleViewDetail = (user: User) => {
        setSelectedUser(user);
        setShowUserDetail(true);
    };

    const handleEdit = (user: User) => {
        setSelectedUser(user);
        setEditForm({ name: user.name, email: user.email, phone: user.phone, role: user.role });
        setShowEditUser(true);
    };

    const handleSaveEdit = () => {
        if (selectedUser) {
            setUsers(prev => prev.map(u => u.id === selectedUser.id ? { ...u, name: editForm.name, email: editForm.email, phone: editForm.phone, role: editForm.role as User['role'] } : u));
            toast.success('Đã cập nhật thông tin người dùng');
        }
        setShowEditUser(false);
    };

    const handleToggleLock = (user: User) => {
        const newStatus = user.status === 'active' ? 'locked' : 'active';
        setUsers(prev => prev.map(u => u.id === user.id ? { ...u, status: newStatus as User['status'] } : u));
        toast.success(newStatus === 'locked' ? 'Đã khóa người dùng' : 'Đã mở khóa người dùng');
    };

    const handleBulkLock = () => {
        setUsers(prev => prev.map(u => selectedUsers.includes(u.id) ? { ...u, status: 'locked' as User['status'] } : u));
        toast.success(`Đã khóa ${selectedUsers.length} người dùng`);
        setSelectedUsers([]);
    };

    const handleBulkDelete = () => {
        setUsers(prev => prev.filter(u => !selectedUsers.includes(u.id)));
        toast.success(`Đã xóa ${selectedUsers.length} người dùng`);
        setSelectedUsers([]);
    };

    const handleAddUser = () => {
        if (!editForm.name || !editForm.email) { toast.error('Vui lòng nhập tên và email'); return; }
        const newUser: User = { id: users.length + 1, name: editForm.name, email: editForm.email, phone: editForm.phone, role: editForm.role as User['role'], status: 'active', orders: 0, spent: 0, joined: new Date().toISOString().split('T')[0], lastActive: 'Vừa tạo' };
        setUsers(prev => [...prev, newUser]);
        toast.success('Đã thêm người dùng mới');
        setShowAddUser(false);
        setEditForm({ name: '', email: '', phone: '', role: 'customer' });
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">👥 Người dùng</h1>
                    <p className="text-sm text-gray-500 mt-1">Quản lý tất cả người dùng trong hệ thống</p>
                </div>
                <div className="flex gap-2">
                    {selectedUsers.length > 0 && (
                        <>
                            <button onClick={handleBulkLock} className="btn-outline btn-sm text-red-600 border-red-200 hover:bg-red-50">🔒 Khóa ({selectedUsers.length})</button>
                            <button onClick={handleBulkDelete} className="btn-danger btn-sm">🗑️ Xóa ({selectedUsers.length})</button>
                        </>
                    )}
                    <button onClick={() => { setEditForm({ name: '', email: '', phone: '', role: 'customer' }); setShowAddUser(true); }} className="btn-primary">+ Thêm người dùng</button>
                </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4">
                <div className="stat-card"><p className="text-sm text-gray-500">Tổng người dùng</p><p className="text-2xl font-bold">{users.length}</p></div>
                <div className="stat-card"><p className="text-sm text-gray-500">Khách hàng</p><p className="text-2xl font-bold text-blue-600">{users.filter(u => u.role === 'customer').length}</p></div>
                <div className="stat-card"><p className="text-sm text-gray-500">Chủ cửa hàng</p><p className="text-2xl font-bold text-orange-600">{users.filter(u => u.role === 'store_owner').length}</p></div>
                <div className="stat-card"><p className="text-sm text-gray-500">Đang hoạt động</p><p className="text-2xl font-bold text-green-600">{users.filter(u => u.status === 'active').length}</p></div>
                <div className="stat-card"><p className="text-sm text-gray-500">Bị khóa</p><p className="text-2xl font-bold text-red-600">{users.filter(u => u.status === 'locked').length}</p></div>
            </div>

            <div className="card">
                <div className="card-body">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 relative">
                            <input type="text" value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }} placeholder="Tìm kiếm theo tên, email, SĐT..." className="input-field pl-10" />
                            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
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
                        <button onClick={() => toast.success('Đang xuất file Excel...')} className="btn-secondary">📥 Xuất Excel</button>
                    </div>
                </div>
            </div>

            <div className="card overflow-hidden">
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th className="w-12"><input type="checkbox" checked={selectedUsers.length === paginatedUsers.length && paginatedUsers.length > 0} onChange={toggleSelectAll} className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500" /></th>
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
                                    <td><input type="checkbox" checked={selectedUsers.includes(user.id)} onChange={() => toggleSelectUser(user.id)} className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500" /></td>
                                    <td>
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">{user.name.charAt(0)}</div>
                                            <div><p className="text-sm font-medium text-gray-900">{user.name}</p><p className="text-xs text-gray-500">{user.email}</p></div>
                                        </div>
                                    </td>
                                    <td><span className={`badge ${roleColors[user.role]}`}>{roleLabels[user.role]}</span></td>
                                    <td>
                                        <span className={`badge ${user.status === 'active' ? 'badge-success' : user.status === 'locked' ? 'badge-danger' : 'badge-warning'}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'active' ? 'bg-green-500' : user.status === 'locked' ? 'bg-red-500' : 'bg-yellow-500'}`} />
                                            {user.status === 'active' ? 'Hoạt động' : user.status === 'locked' ? 'Đã khóa' : 'Chờ duyệt'}
                                        </span>
                                    </td>
                                    <td className="text-right font-medium">{user.orders}</td>
                                    <td className="text-right font-medium">{formatPrice(user.spent)}₫</td>
                                    <td className="text-gray-500">{user.joined}</td>
                                    <td><span className="text-xs text-gray-400">{user.lastActive || 'N/A'}</span></td>
                                    <td className="text-center">
                                        <div className="flex items-center justify-center gap-1">
                                            <button onClick={() => handleViewDetail(user)} className="btn-ghost btn-xs">👁️</button>
                                            <button onClick={() => handleEdit(user)} className="btn-ghost btn-xs">✏️</button>
                                            <button onClick={() => handleToggleLock(user)} className={`btn-ghost btn-xs ${user.status === 'active' ? 'text-red-600' : 'text-green-600'}`}>{user.status === 'active' ? '🔒' : '🔓'}</button>
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

                {filteredUsers.length > 0 && (
                    <div className="card-footer flex items-center justify-between">
                        <p className="text-sm text-gray-500">Hiển thị {((page - 1) * rowsPerPage) + 1}-{Math.min(page * rowsPerPage, filteredUsers.length)} / {filteredUsers.length} người dùng</p>
                        <div className="flex items-center gap-1">
                            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="btn-outline btn-xs">Trước</button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                                <button key={p} onClick={() => setPage(p)} className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${page === p ? 'bg-primary-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>{p}</button>
                            ))}
                            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="btn-outline btn-xs">Sau</button>
                        </div>
                    </div>
                )}
            </div>

            {/* User Detail Modal */}
            <Modal open={showUserDetail} onClose={() => setShowUserDetail(false)} title={`Chi tiết người dùng`} size="md">
                {selectedUser && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">{selectedUser.name.charAt(0)}</div>
                            <div><h3 className="text-lg font-semibold">{selectedUser.name}</h3><p className="text-sm text-gray-500">{selectedUser.email}</p></div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-50 p-3 rounded-lg"><p className="text-xs text-gray-500">SĐT</p><p className="font-medium">{selectedUser.phone}</p></div>
                            <div className="bg-gray-50 p-3 rounded-lg"><p className="text-xs text-gray-500">Vai trò</p><span className={`badge ${roleColors[selectedUser.role]}`}>{roleLabels[selectedUser.role]}</span></div>
                            <div className="bg-gray-50 p-3 rounded-lg"><p className="text-xs text-gray-500">Trạng thái</p><span className={`badge ${selectedUser.status === 'active' ? 'badge-success' : selectedUser.status === 'locked' ? 'badge-danger' : 'badge-warning'}`}>{selectedUser.status}</span></div>
                            <div className="bg-gray-50 p-3 rounded-lg"><p className="text-xs text-gray-500">Ngày tham gia</p><p className="font-medium">{selectedUser.joined}</p></div>
                            <div className="bg-gray-50 p-3 rounded-lg"><p className="text-xs text-gray-500">Đơn hàng</p><p className="font-medium">{selectedUser.orders}</p></div>
                            <div className="bg-gray-50 p-3 rounded-lg"><p className="text-xs text-gray-500">Đã chi</p><p className="font-medium">{formatPrice(selectedUser.spent)}₫</p></div>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Edit User Modal */}
            <Modal open={showEditUser} onClose={() => setShowEditUser(false)} title="Chỉnh sửa người dùng" size="md">
                <div className="space-y-4">
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Tên</label><input type="text" value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} className="input-field" /></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Email</label><input type="email" value={editForm.email} onChange={e => setEditForm({ ...editForm, email: e.target.value })} className="input-field" /></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">SĐT</label><input type="text" value={editForm.phone} onChange={e => setEditForm({ ...editForm, phone: e.target.value })} className="input-field" /></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Vai trò</label>
                        <select value={editForm.role} onChange={e => setEditForm({ ...editForm, role: e.target.value })} className="select-field">
                            <option value="customer">Khách hàng</option>
                            <option value="store_owner">Chủ cửa hàng</option>
                            <option value="staff">Nhân viên</option>
                            <option value="admin">Quản trị viên</option>
                        </select>
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                        <button onClick={() => setShowEditUser(false)} className="btn-secondary">Hủy</button>
                        <button onClick={handleSaveEdit} className="btn-primary">Lưu</button>
                    </div>
                </div>
            </Modal>

            {/* Add User Modal */}
            <Modal open={showAddUser} onClose={() => setShowAddUser(false)} title="Thêm người dùng mới" size="md">
                <div className="space-y-4">
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Tên *</label><input type="text" value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} className="input-field" placeholder="Nhập tên người dùng" /></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Email *</label><input type="email" value={editForm.email} onChange={e => setEditForm({ ...editForm, email: e.target.value })} className="input-field" placeholder="Nhập email" /></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">SĐT</label><input type="text" value={editForm.phone} onChange={e => setEditForm({ ...editForm, phone: e.target.value })} className="input-field" placeholder="Nhập số điện thoại" /></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Vai trò</label>
                        <select value={editForm.role} onChange={e => setEditForm({ ...editForm, role: e.target.value })} className="select-field">
                            <option value="customer">Khách hàng</option>
                            <option value="store_owner">Chủ cửa hàng</option>
                            <option value="staff">Nhân viên</option>
                        </select>
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                        <button onClick={() => setShowAddUser(false)} className="btn-secondary">Hủy</button>
                        <button onClick={handleAddUser} className="btn-primary">Thêm</button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}