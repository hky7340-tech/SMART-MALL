import React, { useState } from 'react';
import Link from 'next/link';

const events = [
  {
    id: 'evt_1',
    name: 'Lễ Hội Ẩm Thực Quốc Tế',
    description: 'Thưởng thức ẩm thực từ 20 quốc gia với sự tham gia của 50+ nhà hàng nổi tiếng. Các hoạt động: nấu ăn trực tiếp, thi ẩm thực, workshop miễn phí.',
    images: ['https://picsum.photos/seed/event1/800/400', 'https://picsum.photos/seed/event1b/800/400'],
    startDate: '2024-12-20',
    endDate: '2024-12-25',
    time: '10:00 - 22:00',
    location: 'Tầng 1 - Sảnh chính',
    type: 'food',
    capacity: 5000,
    registeredCount: 3200,
    isActive: true,
    organizer: 'Smart Mall',
    tags: ['ẩm thực', 'quốc tế', 'lễ hội', 'miễn phí'],
    price: 'Miễn phí',
  },
  {
    id: 'evt_2',
    name: 'Siêu Sale Cuối Năm',
    description: 'Giảm đến 70% tất cả các mặt hàng. Flash sale mỗi ngày từ 10h-12h và 20h-22h. Tích điểm x3 cho thành viên VIP.',
    images: ['https://picsum.photos/seed/event2/800/400', 'https://picsum.photos/seed/event2b/800/400'],
    startDate: '2024-12-15',
    endDate: '2024-12-31',
    time: '08:00 - 23:00',
    location: 'Tất cả các tầng',
    type: 'promotion',
    capacity: 10000,
    registeredCount: 8500,
    isActive: true,
    organizer: 'Smart Mall',
    tags: ['sale', 'khuyến mãi', 'cuối năm', 'flash sale'],
    price: 'Miễn phí',
  },
  {
    id: 'evt_3',
    name: 'Workshop Handmade',
    description: 'Tự tay làm quà tặng Giáng Sinh. Hướng dẫn bởi các nghệ nhân lành nghề. Nguyên liệu được chuẩn bị sẵn.',
    images: ['https://picsum.photos/seed/event3/800/400', 'https://picsum.photos/seed/event3b/800/400'],
    startDate: '2024-12-22',
    endDate: '2024-12-24',
    time: '14:00 - 17:00',
    location: 'Tầng 2 - Khu vực sự kiện',
    type: 'workshop',
    capacity: 200,
    registeredCount: 156,
    isActive: true,
    organizer: 'Creative Studio',
    tags: ['workshop', 'handmade', 'giáng sinh', 'quà tặng'],
    price: '100.000₫/người',
  },
  {
    id: 'evt_4',
    name: 'Triển Lãm Nghệ Thuật',
    description: 'Triển lãm tranh của 30 họa sĩ trẻ tài năng. Kết hợp biểu diễn âm nhạc cổ điển và trà đạo.',
    images: ['https://picsum.photos/seed/event4/800/400', 'https://picsum.photos/seed/event4b/800/400'],
    startDate: '2024-12-18',
    endDate: '2024-12-30',
    time: '09:00 - 21:00',
    location: 'Tầng 6 - Gallery',
    type: 'exhibition',
    capacity: 1000,
    registeredCount: 450,
    isActive: true,
    organizer: 'Art Vietnam',
    tags: ['triển lãm', 'nghệ thuật', 'âm nhạc', 'văn hóa'],
    price: 'Miễn phí',
  },
  {
    id: 'evt_5',
    name: 'Giải Đấu Game',
    description: 'Giải đấu Valorant và Liên Quân Mobile. Giải thưởng lên đến 50 triệu đồng.',
    images: ['https://picsum.photos/seed/event5/800/400', 'https://picsum.photos/seed/event5b/800/400'],
    startDate: '2024-12-28',
    endDate: '2024-12-29',
    time: '09:00 - 20:00',
    location: 'Tầng 5 - Game Center',
    type: 'entertainment',
    capacity: 500,
    registeredCount: 480,
    isActive: true,
    organizer: 'Game Center & Esports',
    tags: ['game', 'esports', 'giải đấu', 'valorant'],
    price: 'Miễn phí đăng ký',
  },
  {
    id: 'evt_6',
    name: 'Đêm Nhạc Acoustic',
    description: 'Buổi hòa nhạc acoustic với các ca sĩ nổi tiếng. Không gian ấm cúng, thân mật.',
    images: ['https://picsum.photos/seed/event6/800/400', 'https://picsum.photos/seed/event6b/800/400'],
    startDate: '2024-12-24',
    endDate: '2024-12-24',
    time: '19:00 - 22:00',
    location: 'Tầng 1 - Sân khấu chính',
    type: 'music',
    capacity: 1000,
    registeredCount: 780,
    isActive: true,
    organizer: 'Smart Mall & Music Vietnam',
    tags: ['nhạc', 'acoustic', 'giáng sinh', 'miễn phí'],
    price: 'Miễn phí',
  },
  {
    id: 'evt_7',
    name: 'Ngày Hội Việc Làm',
    description: 'Cơ hội việc làm tại 50+ cửa hàng trong trung tâm thương mại. Phỏng vấn trực tiếp, nhận việc ngay.',
    images: ['https://picsum.photos/seed/event7/800/400', 'https://picsum.photos/seed/event7b/800/400'],
    startDate: '2025-01-05',
    endDate: '2025-01-06',
    time: '09:00 - 17:00',
    location: 'Tầng 3 - Hội trường A',
    type: 'workshop',
    capacity: 2000,
    registeredCount: 890,
    isActive: true,
    organizer: 'Smart Mall HR',
    tags: ['việc làm', 'tuyển dụng', 'sự nghiệp'],
    price: 'Miễn phí',
  },
  {
    id: 'evt_8',
    name: 'Vui Tết Thiếu Nhi',
    description: 'Chương trình dành cho thiếu nhi với nhiều hoạt động: vẽ tranh, tô màu, nhảy múa, ảo thuật.',
    images: ['https://picsum.photos/seed/event8/800/400', 'https://picsum.photos/seed/event8b/800/400'],
    startDate: '2025-01-15',
    endDate: '2025-01-20',
    time: '10:00 - 18:00',
    location: 'Tầng 2 - Khu vui chơi',
    type: 'kids',
    capacity: 1000,
    registeredCount: 340,
    isActive: true,
    organizer: 'Smart Mall & Kids World',
    tags: ['thiếu nhi', 'vui chơi', 'gia đình', 'miễn phí'],
    price: 'Miễn phí',
  },
];

const eventTypes = [
  { id: 'all', name: 'Tất cả', icon: '📋' },
  { id: 'promotion', name: 'Khuyến mãi', icon: '🏷️' },
  { id: 'food', name: 'Ẩm thực', icon: '🍽️' },
  { id: 'music', name: 'Âm nhạc', icon: '🎵' },
  { id: 'workshop', name: 'Workshop', icon: '🎨' },
  { id: 'exhibition', name: 'Triển lãm', icon: '🖼️' },
  { id: 'entertainment', name: 'Giải trí', icon: '🎮' },
  { id: 'kids', name: 'Thiếu nhi', icon: '🧸' },
  { id: 'sports', name: 'Thể thao', icon: '⚽' },
];

export default function EventsPage() {
  const [selectedType, setSelectedType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  let filteredEvents = [...events];

  if (selectedType !== 'all') {
    filteredEvents = filteredEvents.filter(e => e.type === selectedType);
  }
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    filteredEvents = filteredEvents.filter(e => e.name.toLowerCase().includes(q) || e.description.toLowerCase().includes(q));
  }

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="container-custom py-8">
          <h1 className="text-3xl font-bold">Sự Kiện</h1>
          <p className="text-white/80 mt-1">Các sự kiện và chương trình đặc biệt tại Smart Mall</p>
        </div>
      </div>

      <div className="container-custom py-6">
        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
          {eventTypes.map(type => (
            <button
              key={type.id}
              onClick={() => setSelectedType(type.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                selectedType === type.id
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-primary-300'
              }`}
            >
              {type.icon} {type.name}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Tìm kiếm sự kiện..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field pl-10"
          />
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Event Grid */}
        {filteredEvents.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Không tìm thấy sự kiện</h3>
            <p className="text-gray-600">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredEvents.map(event => (
              <div key={event.id} className="card overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer">
                <div className="relative h-48 bg-gray-100">
                  <img src={event.images[0]} alt={event.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-3 left-3">
                    <span className="badge bg-white/90 text-gray-800 text-xs font-medium">
                      {eventTypes.find(t => t.id === event.type)?.icon} {eventTypes.find(t => t.id === event.type)?.name}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className={`badge ${event.price === 'Miễn phí' ? 'bg-green-500' : 'bg-primary-600'} text-white text-xs font-medium`}>
                      {event.price}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{event.name}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">{event.description}</p>
                  <div className="space-y-1.5 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <span>📅</span>
                      <span>{formatDate(event.startDate)} - {formatDate(event.endDate)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>🕐</span>
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>📍</span>
                      <span>{event.location}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <span>👥</span>
                      <span>{event.registeredCount.toLocaleString()}/{event.capacity.toLocaleString()}</span>
                    </div>
                    <button className="btn-primary text-sm px-4 py-1.5">
                      {event.registeredCount >= event.capacity ? 'Hết vé' : 'Đăng ký'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
