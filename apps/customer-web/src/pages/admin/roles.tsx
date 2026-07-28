import React, { useState } from 'react';
import toast from 'react-hot-toast';

const roles = [
    { id: 1, name: 'Super Admin', users: 2, permissions: ['Tất cả'], color: 'badge-danger' },
    { id: 2, name: 'Quản lý', users: 5, permissions: ['Quản lý cửa hàng', 'Sản phẩm', 'Đơn hàng', 'Báo cáo'], color: 'badge-warning' },
    { id: 3, name: 'Nhân viên', users: 15, permissions: ['Xem đơn hàng', 'Xử lý đơn', 'Xem báo cáo'], color: 'badge-info' },
    { id: 4, name: 'Chủ cửa hàng', users: 10, permissions: ['Quản lý SP của mình', 'Xem đơn hàng của mình'], color: 'badge-success' },
];

export default function RolesPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div><h1 className="text-2xl font-bold text-gray-900">🔐 Phân quyền</h1><p className="text-sm text-gray-500 mt-1">Quản lý vai trò, phân quyền người dùng</p></div>
                <button onClick={() => toast.success('Thêm vai trò mới')} className="btn-primary">+ Thêm vai trò</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {roles.map(r => (
                    <div key={r.id} className="card p-5">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold">{r.name.charAt(0)}</div>
                                <div><h3 className="font-semibold text-gray-900">{r.name}</h3><p className="text-xs text-gray-500">{r.users} người dùng</p></div>
                            </div>
                            <span className={`badge ${r.color}`}>{r.users} users</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                            {r.permissions.map(p => (
                                <span key={p} className="badge badge-neutral">{p}</span>
                            ))}
                        </div>
                        <div className="flex gap-2 mt-4">
                            <button onClick={() => toast.success('Chỉnh sửa quyền')} className="flex-1 btn-outline btn-sm">Chỉnh sửa</button>
                            <button onClick={() => toast.success('Xem người dùng')} className="flex-1 btn-ghost btn-sm">Xem users</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}