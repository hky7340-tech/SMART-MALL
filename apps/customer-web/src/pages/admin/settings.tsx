import React, { useState } from 'react';
import toast from 'react-hot-toast';

export default function SettingsPage() {
    const [activeSection, setActiveSection] = useState('general');

    const sections = [
        { id: 'general', label: 'Tổng quan', icon: '⚙️' },
        { id: 'appearance', label: 'Giao diện', icon: '🎨' },
        { id: 'payment', label: 'Thanh toán', icon: '💳' },
        { id: 'notification', label: 'Thông báo', icon: '🔔' },
        { id: 'email', label: 'Email', icon: '📧' },
        { id: 'security', label: 'Bảo mật', icon: '🔒' },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">⚙️ Cài đặt</h1>
                <p className="text-sm text-gray-500 mt-1">Cấu hình hệ thống</p>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2">
                {sections.map(s => (
                    <button key={s.id} onClick={() => setActiveSection(s.id)} className={`tab whitespace-nowrap ${activeSection === s.id ? 'tab-active' : 'tab-inactive'}`}>
                        {s.icon} {s.label}
                    </button>
                ))}
            </div>

            <div className="max-w-2xl space-y-4">
                <div className="card p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Thông tin trung tâm</h3>
                    <div className="space-y-4">
                        <div><label className="block text-sm font-medium text-gray-700 mb-1">Tên trung tâm</label><input type="text" defaultValue="Smart Mall" className="input-field" /></div>
                        <div><label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label><input type="text" defaultValue="123 Nguyễn Huệ, Quận 1, TP.HCM" className="input-field" /></div>
                        <div><label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label><input type="text" defaultValue="1900 1234" className="input-field" /></div>
                        <div><label className="block text-sm font-medium text-gray-700 mb-1">Email</label><input type="email" defaultValue="info@smartmall.vn" className="input-field" /></div>
                        <div><label className="block text-sm font-medium text-gray-700 mb-1">Giờ mở cửa</label><input type="text" defaultValue="08:00 - 22:00" className="input-field" /></div>
                        <button onClick={() => toast.success('Đã lưu cài đặt')} className="btn-primary">Lưu thay đổi</button>
                    </div>
                </div>
            </div>
        </div>
    );
}