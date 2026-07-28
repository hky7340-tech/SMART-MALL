import React, { useState } from 'react';
import toast from 'react-hot-toast';

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState('general');

    const tabs = [
        { key: 'general', label: '⚙️ Cài đặt chung', desc: 'Thông tin cơ bản của hệ thống' },
        { key: 'payment', label: '💳 Cổng thanh toán', desc: 'Cấu hình payment gateway' },
        { key: 'email', label: '📧 Email/SMS', desc: 'Cấu hình gửi thông báo' },
        { key: 'security', label: '🔒 Bảo mật', desc: 'Cài đặt bảo mật hệ thống' },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">⚙️ Cài đặt</h1>
                <p className="text-sm text-gray-500 mt-1">Quản lý cấu hình hệ thống Smart Mall</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-6">
                {/* Sidebar */}
                <div className="w-full sm:w-64 flex-shrink-0">
                    <div className="card overflow-hidden">
                        {tabs.map(tab => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`w-full text-left px-4 py-3 border-b border-gray-100 last:border-0 transition-colors ${activeTab === tab.key ? 'bg-primary-50 text-primary-700' : 'hover:bg-gray-50'}`}
                            >
                                <p className="text-sm font-medium">{tab.label}</p>
                                <p className="text-xs text-gray-500 mt-0.5">{tab.desc}</p>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 card">
                    <div className="card-header"><h3 className="font-semibold">{tabs.find(t => t.key === activeTab)?.label}</h3></div>
                    <div className="card-body space-y-6">
                        {activeTab === 'general' && (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Tên trung tâm thương mại</label><input type="text" defaultValue="Smart Mall" className="input-field" /></div>
                                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Múi giờ</label><select className="select-field"><option>Asia/Ho_Chi_Minh (UTC+7)</option></select></div>
                                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Email liên hệ</label><input type="email" defaultValue="admin@smartmall.vn" className="input-field" /></div>
                                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label><input type="text" defaultValue="1900 1234" className="input-field" /></div>
                                    <div className="sm:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label><input type="text" defaultValue="123 Nguyễn Huệ, Quận 1, TP.HCM" className="input-field" /></div>
                                </div>
                                <div className="border-t pt-4 flex justify-end"><button onClick={() => toast.success('Đã lưu cài đặt')} className="btn-primary">Lưu thay đổi</button></div>
                            </>
                        )}
                        {activeTab === 'payment' && (
                            <div className="text-center py-8"><div className="text-5xl mb-4">💳</div><h3 className="font-medium mb-2">Cấu hình cổng thanh toán</h3><p className="text-sm text-gray-500">Tính năng đang phát triển</p></div>
                        )}
                        {(activeTab === 'email' || activeTab === 'security') && (
                            <div className="text-center py-8"><div className="text-5xl mb-4">{activeTab === 'email' ? '📧' : '🔒'}</div><h3 className="font-medium mb-2">Tính năng đang phát triển</h3><p className="text-sm text-gray-500">Sẽ sớm được cập nhật</p></div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}