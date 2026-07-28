import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { formatNumber, formatFullPrice } from '@/utils/format';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const tierData = [
    { tier: 'Kim cương', members: 45, minSpend: 50000000, color: '#8b5cf6', benefits: 'VIP parking, 20% discount, Birthday gift' },
    { tier: 'Bạch kim', members: 120, minSpend: 20000000, color: '#3b82f6', benefits: 'Free shipping, 15% discount' },
    { tier: 'Vàng', members: 350, minSpend: 5000000, color: '#f59e0b', benefits: '10% discount, Priority support' },
    { tier: 'Bạc', members: 800, minSpend: 1000000, color: '#6b7280', benefits: '5% discount, Birthday voucher' },
    { tier: 'Đồng', members: 2000, minSpend: 0, color: '#d97706', benefits: 'Basic rewards' },
];

export default function MembershipPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">⭐ Membership</h1>
                    <p className="text-sm text-gray-500 mt-1">Quản lý hạng thành viên, đặc quyền</p>
                </div>
                <button onClick={() => toast.success('Tính năng thêm hạng mới')} className="btn-primary">+ Thêm hạng</button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                {tierData.map(t => (
                    <div key={t.tier} className="stat-card text-center">
                        <p className="text-sm text-gray-500">{t.tier}</p>
                        <p className="text-2xl font-bold" style={{ color: t.color }}>{formatNumber(t.members)}</p>
                        <p className="text-xs text-gray-400">Min: {formatFullPrice(t.minSpend)}</p>
                    </div>
                ))}
            </div>

            <div className="card">
                <div className="card-header"><h3 className="font-semibold text-gray-900">Phân bố thành viên</h3></div>
                <div className="card-body">
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={tierData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="tier" tick={{ fontSize: 12 }} />
                                <YAxis tick={{ fontSize: 12 }} />
                                <Tooltip />
                                <Bar dataKey="members" name="Số lượng" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {tierData.map(t => (
                    <div key={t.tier} className="card p-5">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg" style={{ backgroundColor: t.color + '20', color: t.color }}>
                                {t.tier === 'Kim cương' ? '💎' : t.tier === 'Bạch kim' ? '💠' : t.tier === 'Vàng' ? '🥇' : t.tier === 'Bạc' ? '🥈' : '🥉'}
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900">{t.tier}</h3>
                                <p className="text-xs text-gray-500">{formatNumber(t.members)} thành viên</p>
                            </div>
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                            <p>💰 Chi tiêu tối thiểu: <span className="font-semibold">{formatFullPrice(t.minSpend)}</span></p>
                            <p>🎁 {t.benefits}</p>
                        </div>
                        <div className="flex gap-2 mt-4">
                            <button onClick={() => toast.success('Chỉnh sửa hạng')} className="flex-1 btn-outline btn-sm">Sửa</button>
                            <button onClick={() => toast.success('Xem danh sách')} className="flex-1 btn-ghost btn-sm">Xem DS</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}