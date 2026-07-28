import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { formatFullPrice } from '@/utils/format';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';

const revenueData = [
    { month: 'T1', revenue: 8500000000, profit: 2100000000, orders: 8500 },
    { month: 'T2', revenue: 9200000000, profit: 2400000000, orders: 9100 },
    { month: 'T3', revenue: 10100000000, profit: 2800000000, orders: 10200 },
    { month: 'T4', revenue: 11500000000, profit: 3200000000, orders: 11500 },
    { month: 'T5', revenue: 10800000000, profit: 2900000000, orders: 10800 },
    { month: 'T6', revenue: 12580000000, profit: 3500000000, orders: 12560 },
];

export default function ReportsPage() {
    const [reportType, setReportType] = useState('revenue');

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div><h1 className="text-2xl font-bold text-gray-900">📈 Báo cáo</h1><p className="text-sm text-gray-500 mt-1">Báo cáo doanh thu, sản phẩm, cửa hàng</p></div>
                <div className="flex gap-2">
                    <button onClick={() => toast.success('Xuất PDF')} className="btn-secondary">📥 PDF</button>
                    <button onClick={() => toast.success('Xuất Excel')} className="btn-secondary">📥 Excel</button>
                </div>
            </div>

            <div className="flex gap-2">
                {['revenue', 'products', 'stores', 'customers'].map(type => (
                    <button key={type} onClick={() => setReportType(type)} className={`tab ${reportType === type ? 'tab-active' : 'tab-inactive'}`}>
                        {type === 'revenue' ? '💰 Doanh thu' : type === 'products' ? '📦 Sản phẩm' : type === 'stores' ? '🏪 Cửa hàng' : '👥 Khách hàng'}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 card">
                    <div className="card-header"><h3 className="font-semibold text-gray-900">Doanh thu & Lợi nhuận</h3></div>
                    <div className="card-body">
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={revenueData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                                    <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `${(v / 1000000000).toFixed(1)}B`} />
                                    <Tooltip formatter={(value: any) => formatFullPrice(Number(value))} />
                                    <Bar dataKey="revenue" name="Doanh thu" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="profit" name="Lợi nhuận" fill="#10b981" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
                <div className="card">
                    <div className="card-header"><h3 className="font-semibold text-gray-900">Tổng quan</h3></div>
                    <div className="card-body space-y-4">
                        {[
                            { label: 'Tổng doanh thu', value: formatFullPrice(62700000000), change: '+12.5%', color: 'text-green-600' },
                            { label: 'Tổng lợi nhuận', value: formatFullPrice(16900000000), change: '+15.2%', color: 'text-green-600' },
                            { label: 'Tổng đơn hàng', value: '62,660', change: '+18.3%', color: 'text-green-600' },
                            { label: 'AOV', value: formatFullPrice(892000), change: '+5.1%', color: 'text-green-600' },
                        ].map(item => (
                            <div key={item.label} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div><p className="text-sm text-gray-600">{item.label}</p><p className="text-lg font-bold text-gray-900">{item.value}</p></div>
                                <span className={`text-sm font-medium ${item.color}`}>{item.change}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}