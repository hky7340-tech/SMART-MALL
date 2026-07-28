import React from 'react';
import toast from 'react-hot-toast';
import { formatNumber, formatFullPrice } from '@/utils/format';

export default function ParkingPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div><h1 className="text-2xl font-bold text-gray-900">🅿️ Bãi xe</h1><p className="text-sm text-gray-500 mt-1">Quản lý bãi xe, camera, vé</p></div>
                <button onClick={() => toast.success('Thêm bãi xe')} className="btn-primary">+ Cấu hình</button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="stat-card stat-card-green"><p className="text-sm text-gray-500">Còn trống</p><p className="text-2xl font-bold text-green-600">245</p></div>
                <div className="stat-card stat-card-red"><p className="text-sm text-gray-500">Đã đỗ</p><p className="text-2xl font-bold text-red-600">155</p></div>
                <div className="stat-card stat-card-blue"><p className="text-sm text-gray-500">Tổng chỗ</p><p className="text-2xl font-bold text-blue-600">400</p></div>
                <div className="stat-card stat-card-purple"><p className="text-sm text-gray-500">Doanh thu hôm nay</p><p className="text-2xl font-bold text-purple-600">{formatFullPrice(12500000)}</p></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {['Tầng hầm B1', 'Tầng hầm B2', 'Sân thượng'].map((zone, i) => (
                    <div key={zone} className="card p-5">
                        <h3 className="font-semibold text-gray-900 mb-2">{zone}</h3>
                        <div className="text-3xl font-bold text-green-600 mb-1">{120 - i * 30}</div>
                        <p className="text-sm text-gray-500">chỗ trống / {150 - i * 10} tổng</p>
                        <div className="progress-bar h-2 mt-3">
                            <div className="progress-bar-fill bg-green-500" style={{ width: `${(120 - i * 30) / (150 - i * 10) * 100}%` }} />
                        </div>
                        <button onClick={() => toast.success('Xem chi tiết')} className="btn-outline btn-sm w-full mt-3">Quản lý</button>
                    </div>
                ))}
            </div>
        </div>
    );
}