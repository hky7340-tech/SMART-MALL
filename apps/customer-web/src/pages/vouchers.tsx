import React, { useState } from 'react';
import Link from 'next/link';

interface Voucher {
  id: string;
  code: string;
  name: string;
  description: string;
  type: 'store' | 'mall' | 'shipping' | 'welcome' | 'birthday' | 'event';
  discountType: 'percentage' | 'fixed' | 'free_shipping';
  discountValue: number;
  maxDiscount?: number;
  minOrderValue: number;
  validUntil: string;
  isUsed: boolean;
  storeName?: string;
}

const mockVouchers: Voucher[] = [
  { id: 'v1', code: 'WELCOME50', name: 'Voucher Chào Mừng', description: 'Giảm 50% cho đơn hàng đầu tiên', type: 'welcome', discountType: 'percentage', discountValue: 50, maxDiscount: 100000, minOrderValue: 200000, validUntil: '2024-12-31', isUsed: false },
  { id: 'v2', code: 'BIRTHDAY100', name: 'Quà Sinh Nhật', description: 'Voucher 100K mừng sinh nhật', type: 'birthday', discountType: 'fixed', discountValue: 100000, minOrderValue: 300000, validUntil: '2024-12-31', isUsed: false },
  { id: 'v3', code: 'FREESHIP', name: 'Free Ship', description: 'Miễn phí vận chuyển toàn quốc', type: 'shipping', discountType: 'free_shipping', discountValue: 0, minOrderValue: 500000, validUntil: '2024-12-31', isUsed: false },
  { id: 'v4', code: 'SALE20', name: 'Giảm 20% Thời Trang', description: 'Giảm 20% cho sản phẩm thời trang', type: 'store', discountType: 'percentage', discountValue: 20, maxDiscount: 200000, minOrderValue: 500000, validUntil: '2024-02-15', isUsed: true, storeName: 'Fashion Hub' },
  { id: 'v5', code: 'MALL50K', name: 'Voucher Trung Tâm', description: 'Giảm 50K cho mọi đơn hàng', type: 'mall', discountType: 'fixed', discountValue: 50000, minOrderValue: 200000, validUntil: '2024-12-31', isUsed: false },
  { id: 'v6', code: 'EVENT30', name: 'Sự Kiện Đặc Biệt', description: 'Giảm 30% cho sự kiện cuối tuần', type: 'event', discountType: 'percentage', discountValue: 30, maxDiscount: 150000, minOrderValue: 300000, validUntil: '2024-02-20', isUsed: false },
];

const typeIcons: Record<string, string> = {
  store: '🏪', mall: '🏬', shipping: '🚚', welcome: '👋', birthday: '🎂', event: '🎪',
};
const typeLabels: Record<string, string> = {
  store: 'Cửa hàng', mall: 'Trung tâm', shipping: 'Vận chuyển', welcome: 'Chào mừng', birthday: 'Sinh nhật', event: 'Sự kiện',
};

export default function VouchersPage() {
  const [activeTab, setActiveTab] = useState<'available' | 'used'>('available');
  const filtered = mockVouchers.filter(v => activeTab === 'available' ? !v.isUsed : v.isUsed);

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
        <div className="container-custom">
          <h1 className="text-4xl font-extrabold mb-4">🎟️ Kho Voucher</h1>
          <p className="text-primary-100">Sử dụng voucher để nhận ưu đãi hấp dẫn</p>
        </div>
      </section>

      <section className="py-6 bg-white border-b sticky top-0 z-20">
        <div className="container-custom">
          <div className="flex gap-4">
            <button onClick={() => setActiveTab('available')} className={`px-6 py-3 rounded-xl font-medium transition-all ${activeTab === 'available' ? 'bg-primary-600 text-white shadow-lg' : 'bg-gray-100 text-gray-600'}`}>🔖 Có sẵn ({mockVouchers.filter(v => !v.isUsed).length})</button>
            <button onClick={() => setActiveTab('used')} className={`px-6 py-3 rounded-xl font-medium transition-all ${activeTab === 'used' ? 'bg-primary-600 text-white shadow-lg' : 'bg-gray-100 text-gray-600'}`}>✅ Đã dùng ({mockVouchers.filter(v => v.isUsed).length})</button>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container-custom">
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <span className="text-6xl block mb-4">📭</span>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{activeTab === 'available' ? 'Bạn chưa có voucher nào' : 'Chưa dùng voucher nào'}</h3>
              <p className="text-gray-500">Khám phá các chương trình khuyến mãi để nhận thêm voucher</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filtered.map((voucher) => (
                <div key={voucher.id} className={`card p-6 hover:shadow-xl transition-all ${voucher.isUsed ? 'opacity-60' : ''}`}>
                  <div className="flex items-start gap-4">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl ${voucher.isUsed ? 'bg-gray-200' : 'bg-gradient-to-br from-primary-100 to-primary-200'}`}>
                      {typeIcons[voucher.type]}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-gray-900">{voucher.name}</h3>
                        <span className="text-xs bg-gray-100 rounded-full px-2 py-0.5 text-gray-500">{typeLabels[voucher.type]}</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{voucher.description}</p>
                      {voucher.discountType === 'percentage' && (
                        <p className="text-2xl font-extrabold text-primary-600">-{voucher.discountValue}% {voucher.maxDiscount && <span className="text-sm font-normal text-gray-500">(tối đa {voucher.maxDiscount.toLocaleString()}đ)</span>}</p>
                      )}
                      {voucher.discountType === 'fixed' && (
                        <p className="text-2xl font-extrabold text-primary-600">-{voucher.discountValue.toLocaleString()}đ</p>
                      )}
                      {voucher.discountType === 'free_shipping' && (
                        <p className="text-lg font-bold text-primary-600">🚚 Miễn phí vận chuyển</p>
                      )}
                      <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                        <span>📋 Đơn tối thiểu: {voucher.minOrderValue.toLocaleString()}đ</span>
                        <span>📅 HSD: {voucher.validUntil}</span>
                      </div>
                      <div className="flex items-center gap-3 mt-4">
                        <code className="bg-gray-100 text-primary-600 px-3 py-1.5 rounded-lg font-mono text-sm font-bold">{voucher.code}</code>
                        <button onClick={() => navigator.clipboard.writeText(voucher.code)} className="text-xs text-primary-600 hover:text-primary-700 font-medium">📋 Sao chép</button>
                        {!voucher.isUsed && (
                          <button className="btn-primary text-sm ml-auto">Sử dụng ngay</button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

