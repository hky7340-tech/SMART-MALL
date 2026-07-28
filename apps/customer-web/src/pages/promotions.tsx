import React, { useState } from 'react';
import Link from 'next/link';

interface Promotion {
  id: string;
  title: string;
  description: string;
  image: string;
  discountPercent: number;
  code: string;
  validFrom: string;
  validUntil: string;
  storeName?: string;
  color: string;
  type: 'flash_sale' | 'discount' | 'voucher' | 'free_ship' | 'gift';
}

const promotions: Promotion[] = [
  { id: 'p1', title: 'Flash Sale 12h', description: 'Giảm đến 70% cho hàng ngàn sản phẩm', image: 'https://picsum.photos/seed/promo1/600/400', discountPercent: 70, code: 'FLASH70', validFrom: '2024-01-15', validUntil: '2024-01-31', color: 'from-red-600 to-orange-500', type: 'flash_sale' },
  { id: 'p2', title: 'Mua 1 Tặng 1', description: 'Tất cả các cửa hàng thời trang', image: 'https://picsum.photos/seed/promo2/600/400', discountPercent: 50, code: 'BUY1GET1', validFrom: '2024-01-10', validUntil: '2024-02-10', color: 'from-blue-600 to-purple-500', type: 'discount' },
  { id: 'p3', title: 'Free Ship Toàn Quốc', description: 'Miễn phí vận chuyển cho đơn từ 500K', image: 'https://picsum.photos/seed/promo3/600/400', discountPercent: 0, code: 'FREESHIP', validFrom: '2024-01-01', validUntil: '2024-12-31', color: 'from-green-500 to-teal-500', type: 'free_ship' },
  { id: 'p4', title: 'Giờ Vàng Mua Sắm', description: 'Giảm thêm 20% từ 14h-16h mỗi ngày', image: 'https://picsum.photos/seed/promo4/600/400', discountPercent: 20, code: 'GOLDEN20', validFrom: '2024-01-01', validUntil: '2024-12-31', color: 'from-yellow-500 to-red-500', type: 'flash_sale' },
  { id: 'p5', title: 'Voucher 100K', description: 'Cho đơn hàng đầu tiên trên App', image: 'https://picsum.photos/seed/promo5/600/400', discountPercent: 0, code: 'WELCOME100', validFrom: '2024-01-01', validUntil: '2024-12-31', color: 'from-pink-500 to-rose-500', type: 'voucher' },
  { id: 'p6', title: 'Tặng Trà Sữa', description: 'Tặng 1 ly trà sữa cho hóa đơn từ 200K', image: 'https://picsum.photos/seed/promo6/600/400', discountPercent: 0, code: 'TEATIME', validFrom: '2024-01-15', validUntil: '2024-02-15', color: 'from-cyan-500 to-blue-500', type: 'gift' },
];

const typeIcons: Record<string, string> = {
  flash_sale: '⚡',
  discount: '🏷️',
  voucher: '🎟️',
  free_ship: '🚚',
  gift: '🎁',
};

const typeLabels: Record<string, string> = {
  flash_sale: 'Flash Sale',
  discount: 'Giảm giá',
  voucher: 'Voucher',
  free_ship: 'Free Ship',
  gift: 'Quà tặng',
};

export default function PromotionsPage() {
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const filtered = activeFilter === 'all' ? promotions : promotions.filter(p => p.type === activeFilter);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-600 via-purple-600 to-pink-600 text-white py-16">
        <div className="container-custom text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">🎉 Khuyến Mãi Hot</h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">Săn deal hời, nhận quà khủng mỗi ngày tại Smart Mall</p>
        </div>
      </section>

      {/* Flash Sale Timer */}
      <section className="bg-gradient-to-r from-red-600 to-orange-600 py-6">
        <div className="container-custom">
          <div className="flex items-center justify-center gap-8 text-white">
            <div className="text-center">
              <span className="text-3xl font-bold">12</span>
              <p className="text-xs text-white/70">Giờ</p>
            </div>
            <span className="text-3xl font-bold">:</span>
            <div className="text-center">
              <span className="text-3xl font-bold">30</span>
              <p className="text-xs text-white/70">Phút</p>
            </div>
            <span className="text-3xl font-bold">:</span>
            <div className="text-center">
              <span className="text-3xl font-bold">45</span>
              <p className="text-xs text-white/70">Giây</p>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-6 bg-white border-b sticky top-0 z-20">
        <div className="container-custom">
          <div className="flex gap-3 overflow-x-auto">
            <button onClick={() => setActiveFilter('all')} className={`px-5 py-2.5 rounded-full whitespace-nowrap font-medium transition-all ${activeFilter === 'all' ? 'bg-primary-600 text-white shadow-lg' : 'bg-gray-100 text-gray-600'}`}>🔥 Tất cả</button>
            {Object.entries(typeLabels).map(([key, label]) => (
              <button key={key} onClick={() => setActiveFilter(key)} className={`px-5 py-2.5 rounded-full whitespace-nowrap font-medium transition-all ${activeFilter === key ? 'bg-primary-600 text-white shadow-lg' : 'bg-gray-100 text-gray-600'}`}>{typeIcons[key]} {label}</button>
            ))}
          </div>
        </div>
      </section>

      {/* Promotions Grid */}
      <section className="py-12">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((promo) => (
              <div key={promo.id} className="card overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all group">
                <div className={`relative h-48 bg-gradient-to-br ${promo.color}`}>
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
                  <div className="relative z-10 p-6 text-white h-full flex flex-col justify-between">
                    <div>
                      <span className="text-4xl">{typeIcons[promo.type]}</span>
                      <span className="ml-2 bg-white/20 rounded-full px-3 py-1 text-xs">{typeLabels[promo.type]}</span>
                    </div>
                    {promo.discountPercent > 0 && (
                      <div className="text-5xl font-extrabold">-{promo.discountPercent}%</div>
                    )}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-gray-900 text-lg mb-2">{promo.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{promo.description}</p>
                  <div className="flex items-center gap-2 mb-4">
                    <code className="bg-gray-100 text-primary-600 px-3 py-1.5 rounded-lg font-mono text-sm font-bold">{promo.code}</code>
                    <button onClick={() => navigator.clipboard.writeText(promo.code)} className="text-xs text-primary-600 hover:text-primary-700 font-medium">Sao chép</button>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>📅 {promo.validFrom} → {promo.validUntil}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

