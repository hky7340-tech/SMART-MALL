import React, { useState } from 'react';
import toast from 'react-hot-toast';

export default function ReportsPage() {
    const [reportType, setReportType] = useState('revenue');
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div><h1 className="text-2xl font-bold">📈 Báo cáo & Thống kê</h1><p className="text-sm text-gray-500 mt-1">Xuất báo cáo, phân tích dữ liệu</p></div>
                <div className="flex gap-2">
                    <button onClick={() => toast.success('Đang xuất PDF...')} className="btn-outline">📄 Xuất PDF</button>
                    <button onClick={() => toast.success('Đang xuất Excel...')} className="btn-primary">📥 Xuất Excel</button>
                </div>
            </div>
            <div className="flex gap-1.5 bg-gray-100 p-1 rounded-lg w-fit">
                {[
                    { key: 'revenue', label: 'Doanh thu' },
                    { key: 'orders', label: 'Đơn hàng' },
                    { key: 'customers', label: 'Khách hàng' },
                    { key: 'products', label: 'Sản phẩm' },
                ].map(t => (
                    <button key={t.key} onClick={() => setReportType(t.key)} className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${reportType === t.key ? 'bg-white shadow-sm text-primary-700' : 'text-gray-500 hover:text-gray-700'}`}>{t.label}</button>
                ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="card p-6 text-center"><div className="text-4xl mb-3">💰</div><h3 className="font-semibold mb-1">Doanh thu tháng này</h3><p className="text-2xl font-bold text-primary-600">12.58 tỷ</p><p className="text-xs text-green-600 mt-1">↑ 12.5% so với tháng trước</p></div>
                <div className="card p-6 text-center"><div className="text-4xl mb-3">📦</div><h3 className="font-semibold mb-1">Đơn hàng tháng này</h3><p className="text-2xl font-bold text-primary-600">12,560</p><p className="text-xs text-green-600 mt-1">↑ 15.2% so với tháng trước</p></div>
                <div className="card p-6 text-center"><div className="text-4xl mb-3">👥</div><h3 className="font-semibold mb-1">Khách hàng mới</h3><p className="text-2xl font-bold text-primary-600">1,234</p><p className="text-xs text-green-600 mt-1">↑ 8.3% so với tháng trước</p></div>
            </div>
            <div className="card"><div className="card-body text-center py-12"><div className="text-6xl mb-4">📊</div><h3 className="text-lg font-medium mb-2">Báo cáo chi tiết</h3><p className="text-sm text-gray-500 mb-4">Tính năng đang được phát triển. Bạn có thể xuất báo cáo ở định dạng PDF/Excel.</p><button onClick={() => toast.success('Đang tạo báo cáo...')} className="btn-primary">Tạo báo cáo mới</button></div></div>
        </div>
    );
}