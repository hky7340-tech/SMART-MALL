import React from 'react';
import toast from 'react-hot-toast';
import { formatNumber, formatFullPrice } from '@/utils/format';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const pointsData = [
    { month: 'T1', earned: 125000, burned: 45000 },
    { month: 'T2', earned: 142000, burned: 52000 },
    { month: 'T3', earned: 168000, burned: 61000 },
    { month: 'T4', earned: 185000, burned: 72000 },
    { month: 'T5', earned: 158000, burned: 58000 },
    { month: 'T6', earned: 192000, burned: 75000 },
];

export default function LoyaltyPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">🎯 Loyalty</h1>
                    <p className="text-sm text-gray-500 mt-1">Quản lý điểm thưởng, tích điểm</p>
                </div>
                <button onClick={() => toast.success('Tính năng cấu hình loyalty')} className="btn-primary">⚙️ Cấu hình</button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="stat-card stat-card-purple"><p className="text-sm text-gray-500">Tổng điểm đã phát</p><p className="text-2xl font-bold text-purple-600">{formatNumber(970000)}</p></div>
                <div className="stat-card stat-card-blue"><p className="text-sm text-gray-500">Điểm đã dùng</p><p className="text-2xl font-bold text-blue-600">{formatNumber(363000)}</p></div>
                <div className="stat-card stat-card-green"><p className="text-sm text-gray-500">Tích lũy chờ</p><p className="text-2xl font-bold text-green-600">{formatNumber(607000)}</p></div>
                <div className="stat-card stat-card-orange"><p className="text-sm text-gray-500">Tỷ lệ đổi thưởng</p><p className="text-2xl font-bold text-orange-600">37.4%</p></div>
            </div>

            <div className="card">
                <div className="card-header"><h3 className="font-semibold text-gray-900">Điểm phát & Điểm dùng</h3></div>
                <div className="card-body">
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={pointsData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                                <YAxis tick={{ fontSize: 12 }} />
                                <Tooltip />
                                <Bar dataKey="earned" name="Điểm phát" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="burned" name="Điểm dùng" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}