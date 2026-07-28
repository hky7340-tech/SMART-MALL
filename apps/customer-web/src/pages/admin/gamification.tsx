import React from 'react';
import toast from 'react-hot-toast';
import { formatNumber, formatFullPrice } from '@/utils/format';

const games = [
    { name: 'Vòng quay may mắn', icon: '🎡', players: 12500, prizes: 4500, active: true },
    { name: 'Mini Game Bingo', icon: '🎯', players: 8900, prizes: 3200, active: true },
    { name: 'Nhiệm vụ hàng ngày', icon: '📋', players: 15000, prizes: 12000, active: true },
    { name: 'Thử thách tuần', icon: '🏆', players: 5600, prizes: 1800, active: false },
];

export default function GamificationPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div><h1 className="text-2xl font-bold text-gray-900">🎮 Gamification</h1><p className="text-sm text-gray-500 mt-1">Mini game, vòng quay, nhiệm vụ</p></div>
                <button onClick={() => toast.success('Thêm mini game mới')} className="btn-primary">+ Thêm game</button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="stat-card stat-card-purple"><p className="text-sm text-gray-500">Người chơi</p><p className="text-2xl font-bold text-purple-600">{formatNumber(42000)}</p></div>
                <div className="stat-card stat-card-green"><p className="text-sm text-gray-500">Giải thưởng</p><p className="text-2xl font-bold text-green-600">{formatNumber(21500)}</p></div>
                <div className="stat-card stat-card-blue"><p className="text-sm text-gray-500">Tỷ lệ thắng</p><p className="text-2xl font-bold text-blue-600">51.2%</p></div>
                <div className="stat-card stat-card-orange"><p className="text-sm text-gray-500">Điểm đã thưởng</p><p className="text-2xl font-bold text-orange-600">{formatFullPrice(25000000)}</p></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {games.map(g => (
                    <div key={g.name} className={`card p-5 ${!g.active ? 'opacity-60' : ''}`}>
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-2xl">{g.icon}</div>
                            <div><h3 className="font-semibold text-gray-900">{g.name}</h3><p className="text-xs text-gray-500">{g.active ? '🟢 Đang hoạt động' : '🔴 Tạm dừng'}</p></div>
                        </div>
                        <div className="grid grid-cols-3 gap-3 text-center text-sm">
                            <div><p className="text-gray-500">Người chơi</p><p className="font-semibold">{formatNumber(g.players)}</p></div>
                            <div><p className="text-gray-500">Giải thưởng</p><p className="font-semibold text-green-600">{formatNumber(g.prizes)}</p></div>
                            <div><p className="text-gray-500">Tỷ lệ</p><p className="font-semibold text-blue-600">{((g.prizes / g.players) * 100).toFixed(1)}%</p></div>
                        </div>
                        <div className="flex gap-2 mt-4">
                            <button onClick={() => toast.success('Cấu hình game')} className="flex-1 btn-outline btn-sm">Cấu hình</button>
                            <button onClick={() => toast.success(g.active ? 'Tạm dừng game' : 'Kích hoạt game')} className="flex-1 btn-ghost btn-sm">{g.active ? '⏸️ Tạm dừng' : '▶️ Kích hoạt'}</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}