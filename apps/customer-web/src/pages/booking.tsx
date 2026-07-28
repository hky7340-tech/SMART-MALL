import React, { useState } from 'react';
import Link from 'next/link';

type BookingType = 'table' | 'service' | 'meeting_room' | 'sports' | 'event';

interface BookingService {
  id: string;
  type: BookingType;
  name: string;
  storeName: string;
  image: string;
  duration: string;
  price: number;
  rating: number;
  available: boolean;
  description: string;
}

const services: BookingService[] = [
  { id: 'b1', type: 'table', name: 'Bàn 2 người - View Sông', storeName: 'Nhà hàng Hải Sản Biển Đông', image: 'https://picsum.photos/seed/table1/400/300', duration: '2 giờ', price: 500000, rating: 4.5, available: true, description: 'Bàn view đẹp, không gian lãng mạn' },
  { id: 'b2', type: 'table', name: 'Bàn VIP 6 người', storeName: 'Nhà hàng Nhật Bản', image: 'https://picsum.photos/seed/table2/400/300', duration: '3 giờ', price: 1500000, rating: 4.8, available: true, description: 'Phòng riêng, phục vụ cao cấp' },
  { id: 'b3', type: 'service', name: 'Massage Thư Giãn', storeName: 'Spa & Beauty', image: 'https://picsum.photos/seed/spa1/400/300', duration: '60 phút', price: 350000, rating: 4.6, available: true, description: 'Massage toàn thân, tinh dầu thơm' },
  { id: 'b4', type: 'meeting_room', name: 'Phòng Họp Nhỏ', storeName: 'Smart Mall Business Center', image: 'https://picsum.photos/seed/meeting1/400/300', duration: '4 giờ', price: 800000, rating: 4.3, available: true, description: 'Phòng 10 người, đầy đủ thiết bị' },
  { id: 'b5', type: 'sports', name: 'Sân Pickleball', storeName: 'Khu Thể Thao', image: 'https://picsum.photos/seed/sport1/400/300', duration: '1 giờ', price: 150000, rating: 4.4, available: true, description: 'Sân tiêu chuẩn, có giáo viên hướng dẫn' },
  { id: 'b6', type: 'event', name: 'Hội Trường 100 Khách', storeName: 'Smart Mall Event Hall', image: 'https://picsum.photos/seed/event1/400/300', duration: '8 giờ', price: 5000000, rating: 4.7, available: false, description: 'Tổ chức sự kiện, hội nghị' },
];

const typeLabels: Record<BookingType, string> = {
  table: '🪑 Đặt bàn',
  service: '💆 Dịch vụ',
  meeting_room: '🏢 Phòng họp',
  sports: '⚽ Sân chơi',
  event: '🎪 Sự kiện',
};

export default function BookingPage() {
  const [selectedType, setSelectedType] = useState<BookingType | 'all'>('all');
  const [selectedDate, setSelectedDate] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedService, setSelectedService] = useState<BookingService | null>(null);

  const filtered = services.filter(s => selectedType === 'all' || s.type === selectedType);

  const handleBook = (service: BookingService) => {
    setSelectedService(service);
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
        <div className="container-custom">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">📅 Đặt Dịch Vụ</h1>
            <p className="text-primary-100 text-lg">Đặt bàn, phòng họp, sân chơi và nhiều dịch vụ khác tại Smart Mall</p>
          </div>
        </div>
      </section>

      {/* Type Filter */}
      <section className="py-6 bg-white border-b sticky top-0 z-20">
        <div className="container-custom">
          <div className="flex gap-3 overflow-x-auto">
            <button
              onClick={() => setSelectedType('all')}
              className={`px-5 py-2.5 rounded-full whitespace-nowrap font-medium transition-all ${
                selectedType === 'all' ? 'bg-primary-600 text-white shadow-lg' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              📋 Tất cả
            </button>
            {(Object.entries(typeLabels) as [BookingType, string][]).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setSelectedType(key)}
                className={`px-5 py-2.5 rounded-full whitespace-nowrap font-medium transition-all ${
                  selectedType === key ? 'bg-primary-600 text-white shadow-lg' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-12">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((service) => (
              <div key={service.id} className="card overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all group">
                <div className="relative h-48">
                  <img src={service.image} alt={service.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <span className="absolute top-3 left-3 bg-white/90 backdrop-blur rounded-lg px-3 py-1.5 text-xs font-semibold text-gray-700">
                    {typeLabels[service.type]}
                  </span>
                  {!service.available && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold">Hết chỗ</span>
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-gray-900 text-lg mb-1">{service.name}</h3>
                  <p className="text-sm text-gray-500 mb-2">📍 {service.storeName}</p>
                  <p className="text-sm text-gray-600 mb-4">{service.description}</p>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-yellow-400">⭐</span>
                      <span className="font-semibold">{service.rating}</span>
                    </div>
                    <span className="text-sm text-gray-500">⏱ {service.duration}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-primary-600">
                      {service.price.toLocaleString()}đ
                    </span>
                    <button
                      onClick={() => handleBook(service)}
                      disabled={!service.available}
                      className="btn-primary text-sm disabled:opacity-50"
                    >
                      {service.available ? 'Đặt ngay' : 'Hết chỗ'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Modal */}
      {showModal && selectedService && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-3xl max-w-lg w-full p-8" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Xác nhận đặt</h3>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200">✕</button>
            </div>
            <div className="space-y-4">
              <div className="flex gap-4 p-4 bg-gray-50 rounded-xl">
                <img src={selectedService.image} alt="" className="w-20 h-20 rounded-xl object-cover" />
                <div>
                  <h4 className="font-semibold text-gray-900">{selectedService.name}</h4>
                  <p className="text-sm text-gray-500">{selectedService.storeName}</p>
                  <p className="text-lg font-bold text-primary-600 mt-1">{selectedService.price.toLocaleString()}đ</p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Chọn ngày</label>
                <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Chọn giờ</label>
                <select className="input-field">
                  {Array.from({ length: 12 }, (_, i) => i + 8).map(h => (
                    <option key={h}>{String(h).padStart(2, '0')}:00</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú</label>
                <textarea className="input-field" rows={3} placeholder="Yêu cầu đặc biệt..." />
              </div>
            </div>
            <button className="btn-primary w-full mt-6 text-lg py-3">
              Xác nhận đặt - {selectedService.price.toLocaleString()}đ
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

