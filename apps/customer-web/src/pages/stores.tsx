import React, { useState } from 'react';
import Link from 'next/link';

const storeCategories = [
  { id: 'all', name: 'Tất cả', icon: '🏪' },
  { id: 'scat_1', name: 'Thời trang & Làm đẹp', icon: '👗' },
  { id: 'scat_2', name: 'Điện tử & Công nghệ', icon: '📱' },
  { id: 'scat_3', name: 'Ẩm thực & Đồ uống', icon: '🍽️' },
  { id: 'scat_4', name: 'Giải trí & Thể thao', icon: '🎯' },
  { id: 'scat_5', name: 'Sức khỏe & Sắc đẹp', icon: '💆' },
  { id: 'scat_6', name: 'Giáo dục & Sách', icon: '📚' },
  { id: 'scat_7', name: 'Dịch vụ & Tiện ích', icon: '🔧' },
];

const allStores = [
  { id: 'store_1', name: 'Fashion Hub', description: 'Cửa hàng thời trang cao cấp với các thương hiệu nổi tiếng trong và ngoài nước.', shortDescription: 'Thời trang nam nữ', logo: 'https://picsum.photos/seed/store1/200/200', banner: 'https://picsum.photos/seed/store1b/1200/400', floor: 1, unit: 'L1-01', categoryId: 'scat_1', rating: 4.5, totalReviews: 320, isFeatured: true, isOpen: true, openTime: '09:00', closeTime: '22:00', tags: ['thời trang', 'cao cấp', 'xu hướng'] },
  { id: 'store_2', name: 'Trà Sữa Đài Loan', description: 'Trà sữa ngon nhất quận với nguyên liệu nhập khẩu trực tiếp từ Đài Loan.', shortDescription: 'Trà sữa chất lượng', logo: 'https://picsum.photos/seed/store2/200/200', banner: 'https://picsum.photos/seed/store2b/1200/400', floor: 2, unit: 'L2-05', categoryId: 'scat_3', rating: 4.3, totalReviews: 580, isFeatured: true, isOpen: true, openTime: '08:00', closeTime: '23:00', tags: ['trà sữa', 'đồ uống', 'ăn vặt'] },
  { id: 'store_3', name: 'TechZone', description: 'Điện thoại, laptop & phụ kiện chính hãng. Bảo hành 12 tháng.', shortDescription: 'Công nghệ chính hãng', logo: 'https://picsum.photos/seed/store3/200/200', banner: 'https://picsum.photos/seed/store3b/1200/400', floor: 3, unit: 'L3-10', categoryId: 'scat_2', rating: 4.7, totalReviews: 420, isFeatured: true, isOpen: true, openTime: '09:30', closeTime: '21:30', tags: ['điện tử', 'điện thoại', 'laptop', 'công nghệ'] },
  { id: 'store_4', name: 'Nhà hàng Hải Sản Biển Đông', description: 'Hải sản tươi sống giá tốt, chế biến theo phong cách Á - Âu.', shortDescription: 'Hải sản tươi ngon', logo: 'https://picsum.photos/seed/store4/200/200', banner: 'https://picsum.photos/seed/store4b/1200/400', floor: 4, unit: 'L4-02', categoryId: 'scat_3', rating: 4.6, totalReviews: 890, isFeatured: true, isOpen: true, openTime: '10:00', closeTime: '22:30', tags: ['hải sản', 'nhà hàng', 'ẩm thực', 'đặc sản'] },
  { id: 'store_5', name: 'Rạp Chiếu Phim Galaxy', description: 'Rạp chiếu phim hiện đại với 10 phòng chiếu, công nghệ IMAX.', shortDescription: 'Phim hay mỗi ngày', logo: 'https://picsum.photos/seed/store5/200/200', banner: 'https://picsum.photos/seed/store5b/1200/400', floor: 5, unit: 'L5-01-05', categoryId: 'scat_4', rating: 4.4, totalReviews: 1200, isFeatured: true, isOpen: true, openTime: '08:00', closeTime: '00:00', tags: ['phim', 'giải trí', 'rạp chiếu phim'] },
  { id: 'store_6', name: 'GYM & Fitness Center', description: 'Phòng tập hiện đại với đầy đủ trang thiết bị.', shortDescription: 'Rèn luyện sức khỏe', logo: 'https://picsum.photos/seed/store6/200/200', banner: 'https://picsum.photos/seed/store6b/1200/400', floor: 6, unit: 'L6-03', categoryId: 'scat_5', rating: 4.2, totalReviews: 156, isFeatured: false, isOpen: true, openTime: '06:00', closeTime: '22:00', tags: ['gym', 'fitness', 'sức khỏe', 'thể thao'] },
  { id: 'store_7', name: 'Nhà Sách Minh Khai', description: 'Nhà sách với hàng ngàn đầu sách trong và ngoài nước.', shortDescription: 'Sách hay mỗi ngày', logo: 'https://picsum.photos/seed/store7/200/200', banner: 'https://picsum.photos/seed/store7b/1200/400', floor: 2, unit: 'L2-08', categoryId: 'scat_6', rating: 4.8, totalReviews: 780, isFeatured: true, isOpen: true, openTime: '08:30', closeTime: '21:30', tags: ['sách', 'văn phòng', 'quà tặng'] },
  { id: 'store_8', name: 'Game Center', description: 'Trung tâm giải trí với các máy game hiện đại.', shortDescription: 'Giải trí đỉnh cao', logo: 'https://picsum.photos/seed/store8/200/200', banner: 'https://picsum.photos/seed/store8b/1200/400', floor: 5, unit: 'L5-10', categoryId: 'scat_4', rating: 4.1, totalReviews: 430, isFeatured: false, isOpen: true, openTime: '09:00', closeTime: '23:00', tags: ['game', 'giải trí', 'esports'] },
  { id: 'store_9', name: 'Tiệm Bánh Sweet Home', description: 'Bánh ngọt, bánh mì và đồ uống.', shortDescription: 'Bánh ngọt thơm ngon', logo: 'https://picsum.photos/seed/store9/200/200', banner: 'https://picsum.photos/seed/store9b/1200/400', floor: 1, unit: 'L1-15', categoryId: 'scat_3', rating: 4.5, totalReviews: 920, isFeatured: false, isOpen: true, openTime: '07:00', closeTime: '22:00', tags: ['bánh', 'cà phê', 'đồ uống'] },
  { id: 'store_10', name: 'Spa & Beauty', description: 'Dịch vụ chăm sóc sắc đẹp chuyên nghiệp.', shortDescription: 'Chăm sóc sắc đẹp', logo: 'https://picsum.photos/seed/store10/200/200', banner: 'https://picsum.photos/seed/store10b/1200/400', floor: 6, unit: 'L6-07', categoryId: 'scat_5', rating: 4.6, totalReviews: 340, isFeatured: false, isOpen: true, openTime: '09:00', closeTime: '21:00', tags: ['spa', 'massage', 'làm đẹp'] },
];

const floors = [1, 2, 3, 4, 5, 6];

export default function StoresPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedFloor, setSelectedFloor] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyOpen, setOnlyOpen] = useState(false);

  let filteredStores = [...allStores];

  if (selectedCategory !== 'all') {
    filteredStores = filteredStores.filter(s => s.categoryId === selectedCategory);
  }
  if (selectedFloor !== null) {
    filteredStores = filteredStores.filter(s => s.floor === selectedFloor);
  }
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    filteredStores = filteredStores.filter(s => s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q) || s.tags.some(t => t.includes(q)));
  }
  if (onlyOpen) {
    filteredStores = filteredStores.filter(s => s.isOpen);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="container-custom py-8">
          <h1 className="text-3xl font-bold">Cửa Hàng</h1>
          <p className="text-white/80 mt-1">Khám phá hơn 100 cửa hàng tại Smart Mall</p>
        </div>
      </div>

      {/* Map Preview */}
      <div className="bg-white shadow-sm">
        <div className="container-custom py-4">
          <div className="flex items-center gap-4 overflow-x-auto pb-2">
            <button
              onClick={() => setSelectedFloor(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${selectedFloor === null ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              🏢 Tất cả tầng
            </button>
            {floors.map(floor => (
              <button
                key={floor}
                onClick={() => setSelectedFloor(floor)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${selectedFloor === floor ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                Tầng {floor}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container-custom py-6">
        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Tìm kiếm cửa hàng..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-10"
            />
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={onlyOpen} onChange={(e) => setOnlyOpen(e.target.checked)} className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
            <span className="text-sm text-gray-700">Đang mở cửa</span>
          </label>
        </div>

        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
          {storeCategories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${selectedCategory === cat.id ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-primary-300'}`}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>

        {/* Store Grid */}
        {filteredStores.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🏪</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Không tìm thấy cửa hàng</h3>
            <p className="text-gray-600">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredStores.map(store => (
              <Link key={store.id} href={`/stores/${store.id}`} className="group">
                <div className="card overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <div className="relative h-40 bg-gradient-to-br from-primary-600 to-primary-800">
                    <div className="absolute inset-0 bg-black/10" />
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      {store.isOpen ? (
                        <span className="badge-success text-xs">Đang mở cửa</span>
                      ) : (
                        <span className="badge bg-gray-500 text-white text-xs">Đã đóng cửa</span>
                      )}
                      {store.isFeatured && (
                        <span className="bg-yellow-400 text-yellow-900 px-2 py-0.5 rounded-full text-xs font-bold">★ Nổi bật</span>
                      )}
                    </div>
                    <div className="absolute bottom-3 left-3 right-3">
                      <h3 className="text-white font-bold text-lg drop-shadow-lg">{store.name}</h3>
                      <p className="text-white/80 text-sm">Tầng {store.floor} - {store.unit}</p>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">{store.shortDescription}</p>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-400">★</span>
                        <span className="font-semibold text-gray-900">{store.rating}</span>
                        <span className="text-xs text-gray-400">({store.totalReviews.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')} đánh giá)</span>
                      </div>
                      <span className="text-xs text-gray-500">{store.openTime} - {store.closeTime}</span>
                    </div>
                    <div className="flex gap-1.5 flex-wrap">
                      {store.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="badge-primary text-xs">{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
