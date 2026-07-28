import React from 'react';
import Link from 'next/link';

export default function StoreOwnerDashboard() {
    return (
        <div style={{ minHeight: '100vh', background: '#f9fafb', padding: '40px', fontFamily: 'Inter, system-ui, sans-serif' }}>
            <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                <h1 style={{ fontSize: 28, fontWeight: 700, color: '#111827', marginBottom: 8 }}>🏪 Store Owner Portal</h1>
                <p style={{ color: '#6b7280', marginBottom: 32 }}>Quản lý cửa hàng của bạn</p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
                    {[
                        { icon: '📊', title: 'Dashboard', desc: 'Doanh thu, đơn hàng, KPI', href: '#' },
                        { icon: '📦', title: 'Sản phẩm', desc: 'Quản lý sản phẩm, tồn kho', href: '#' },
                        { icon: '📋', title: 'Đơn hàng', desc: 'Xem và xử lý đơn hàng', href: '#' },
                        { icon: '📈', title: 'Doanh thu', desc: 'Báo cáo doanh thu, lợi nhuận', href: '#' },
                        { icon: '🎫', title: 'Khuyến mãi', desc: 'Tạo voucher, flash sale', href: '#' },
                        { icon: '💬', title: 'Chat', desc: 'Hỗ trợ khách hàng', href: '#' },
                    ].map(item => (
                        <div key={item.title} style={{
                            background: 'white', borderRadius: 16, padding: 24,
                            border: '1px solid #e5e7eb', cursor: 'pointer',
                            transition: 'all 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
                        }}>
                            <div style={{ fontSize: 32, marginBottom: 12 }}>{item.icon}</div>
                            <h3 style={{ fontSize: 16, fontWeight: 600, color: '#111827', marginBottom: 4 }}>{item.title}</h3>
                            <p style={{ fontSize: 13, color: '#6b7280' }}>{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}