import React, { useState, useEffect } from 'react';
import Link from 'next/link';

// ==================== HELPER FUNCTIONS (PREVENT HYDRATION MISMATCH) ====================

// Hàm định dạng số/tiền nhất quán 100% giữa Server và Client (không dùng toLocaleString)
const formatPrice = (amount: number) => {
  return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

const formatCount = (count: number) => {
  return count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

// Tách ngày tháng trực tiếp từ chuỗi YYYY-MM-DD để tránh lệch múi giờ giữa Server và Browser
const parseDateStr = (dateStr: string) => {
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    return {
      day: parseInt(parts[2], 10),
      month: parseInt(parts[1], 10),
    };
  }
  return { day: 1, month: 1 };
};

// ==================== MOCK DATA ====================

const mockStores = [
  { id: 'store_1', name: 'Fashion Hub', description: 'Thời trang nam nữ cao cấp', logo: 'https://picsum.photos/seed/store1/200/200', banner: 'https://picsum.photos/seed/store1b/1200/400', floor: 1, categoryId: 'scat_1', rating: 4.5, totalReviews: 320, isFeatured: true, isOpen: true, tags: ['thời trang', 'cao cấp'] },
  { id: 'store_2', name: 'Trà Sữa Đài Loan', description: 'Trà sữa ngon nhất quận', logo: 'https://picsum.photos/seed/store2/200/200', banner: 'https://picsum.photos/seed/store2b/1200/400', floor: 2, rating: 4.3, totalReviews: 580, isFeatured: true, isOpen: true, tags: ['trà sữa', 'đồ uống'] },
  { id: 'store_3', name: 'TechZone', description: 'Điện thoại, laptop & phụ kiện', logo: 'https://picsum.photos/seed/store3/200/200', banner: 'https://picsum.photos/seed/store3b/1200/400', floor: 3, rating: 4.7, totalReviews: 420, isFeatured: true, isOpen: true, tags: ['điện tử', 'công nghệ'] },
  { id: 'store_4', name: 'Hải Sản Biển Đông', description: 'Hải sản tươi sống', logo: 'https://picsum.photos/seed/store4/200/200', banner: 'https://picsum.photos/seed/store4b/1200/400', floor: 4, rating: 4.6, totalReviews: 890, isFeatured: true, isOpen: true, tags: ['hải sản', 'nhà hàng'] },
  { id: 'store_5', name: 'Galaxy Cinema', description: 'Rạp chiếu phim hiện đại', logo: 'https://picsum.photos/seed/store5/200/200', banner: 'https://picsum.photos/seed/store5b/1200/400', floor: 5, rating: 4.4, totalReviews: 1200, isFeatured: true, isOpen: true, tags: ['phim', 'giải trí'] },
];

const mockProducts = [
  { id: 'prod_1', name: 'Áo thun nam cao cấp', price: 299000, comparePrice: 499000, images: ['https://picsum.photos/seed/prod1/400/400'], rating: 4.5, totalSold: 1500, discountPercent: 40, storeName: 'Fashion Hub' },
  { id: 'prod_2', name: 'Điện thoại thông minh XYZ', price: 15999000, comparePrice: 19999000, images: ['https://picsum.photos/seed/prod2/400/400'], rating: 4.8, totalSold: 892, discountPercent: 20, storeName: 'TechZone' },
  { id: 'prod_3', name: 'Combo trà sữa đặc biệt', price: 49000, comparePrice: 65000, images: ['https://picsum.photos/seed/prod3/400/400'], rating: 4.3, totalSold: 5000, discountPercent: 25, storeName: 'Trà Sữa Đài Loan' },
  { id: 'prod_4', name: 'Tai nghe Bluetooth Pro', price: 899000, comparePrice: 1299000, images: ['https://picsum.photos/seed/prod4/400/400'], rating: 4.6, totalSold: 2300, discountPercent: 30, storeName: 'TechZone' },
  { id: 'prod_5', name: 'Kem dưỡng da mặt', price: 599000, comparePrice: 799000, images: ['https://picsum.photos/seed/prod5/400/400'], rating: 4.4, totalSold: 3200, discountPercent: 25, storeName: 'Fashion Hub' },
  { id: 'prod_6', name: 'Balo thời trang', price: 399000, comparePrice: 599000, images: ['https://picsum.photos/seed/prod6/400/400'], rating: 4.2, totalSold: 1800, discountPercent: 35, storeName: 'Fashion Hub' },
  { id: 'prod_7', name: 'Đồng hồ thông minh', price: 2999000, comparePrice: 3999000, images: ['https://picsum.photos/seed/prod7/400/400'], rating: 4.7, totalSold: 560, discountPercent: 25, storeName: 'TechZone' },
  { id: 'prod_8', name: 'Sách hay mỗi ngày', price: 89000, comparePrice: 120000, images: ['https://picsum.photos/seed/prod8/400/400'], rating: 4.9, totalSold: 7800, discountPercent: 26, storeName: 'BookStore' },
];

const bannerSlides = [
  { id: 1, image: 'https://picsum.photos/seed/banner1/1920/600', title: 'Săn Sale Cuối Tuần', subtitle: 'Giảm đến 50% tất cả sản phẩm', link: '/promotions' },
  { id: 2, image: 'https://picsum.photos/seed/banner2/1920/600', title: 'Bộ Sưu Tập Mới', subtitle: 'Thời trang thu đông 2024', link: '/products' },
  { id: 3, image: 'https://picsum.photos/seed/banner3/1920/600', title: 'Ẩm Thực Tuyệt Vời', subtitle: 'Giảm 30% tại tất cả nhà hàng', link: '/restaurants' },
];

const promotions = [
  { id: 1, title: 'Flash Sale 12h', description: 'Giảm đến 70%', image: 'https://picsum.photos/seed/flash1/600/400', validUntil: '2024-12-31', color: 'from-red-500 to-orange-500' },
  { id: 2, title: 'Mua 1 Tặng 1', description: 'Tất cả cửa hàng', image: 'https://picsum.photos/seed/flash2/600/400', validUntil: '2024-12-31', color: 'from-blue-500 to-purple-500' },
  { id: 3, title: 'Free Ship', description: 'Đơn hàng từ 500K', image: 'https://picsum.photos/seed/flash3/600/400', validUntil: '2024-12-31', color: 'from-green-500 to-teal-500' },
  { id: 4, title: 'Giờ Vàng Mua Sắm', description: 'Từ 14h-16h mỗi ngày', image: 'https://picsum.photos/seed/flash4/600/400', validUntil: '2024-12-31', color: 'from-yellow-500 to-red-500' },
];

const events = [
  { id: 1, title: 'Live Music Night', description: 'Đêm nhạc Acoustic', date: '2024-12-25', image: 'https://picsum.photos/seed/event1/400/300', location: 'Sân khấu trung tâm' },
  { id: 2, title: 'Triển lãm Nghệ thuật', description: 'Hội họa đương đại', date: '2024-12-30', image: 'https://picsum.photos/seed/event2/400/300', location: 'Tầng 6' },
  { id: 3, title: 'Workshop Ẩm thực', description: 'Nấu ăn cùng đầu bếp Ý', date: '2025-01-05', image: 'https://picsum.photos/seed/event3/400/300', location: 'Khu ẩm thực' },
  { id: 4, title: 'Kids Festival', description: 'Ngày hội thiếu nhi', date: '2025-01-10', image: 'https://picsum.photos/seed/event4/400/300', location: 'Khu vui chơi' },
];

const categories = [
  { id: 1, name: 'Thời trang', icon: '👗', color: 'bg-pink-100 text-pink-600', count: 2500 },
  { id: 2, name: 'Điện tử', icon: '📱', color: 'bg-blue-100 text-blue-600', count: 1800 },
  { id: 3, name: 'Ẩm thực', icon: '🍜', color: 'bg-orange-100 text-orange-600', count: 3200 },
  { id: 4, name: 'Sức khỏe', icon: '💄', color: 'bg-purple-100 text-purple-600', count: 1200 },
  { id: 5, name: 'Giải trí', icon: '🎮', color: 'bg-green-100 text-green-600', count: 800 },
  { id: 6, name: 'Thể thao', icon: '⚽', color: 'bg-red-100 text-red-600', count: 950 },
  { id: 7, name: 'Sách', icon: '📚', color: 'bg-yellow-100 text-yellow-600', count: 1500 },
  { id: 8, name: 'Trang sức', icon: '💎', color: 'bg-indigo-100 text-indigo-600', count: 600 },
];

// ==================== COMPONENTS ====================

function HeroBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative w-full overflow-hidden bg-gray-900" style={{ height: '600px' }}>
      {bannerSlides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-all duration-700 ease-in-out ${
            index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent z-10" />
          <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 z-20 flex items-center">
            <div className="container-custom">
              <div className="max-w-2xl animate-fade-in">
                <p className="text-accent-400 font-semibold text-lg mb-2">🔥 Khuyến mãi đặc biệt</p>
                <h2 className="text-5xl md:text-7xl font-extrabold text-white mb-4 leading-tight">
                  {slide.title}
                </h2>
                <p className="text-xl text-gray-200 mb-8">{slide.subtitle}</p>
                <div className="flex gap-4">
                  <Link href={slide.link} className="btn-primary text-lg px-8 py-3">
                    Khám phá ngay
                  </Link>
                  <Link href="/stores" className="btn-outline text-white border-white hover:bg-white hover:text-gray-900 text-lg px-8 py-3">
                    Xem cửa hàng
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-3">
        {bannerSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/70'
            }`}
          />
        ))}
      </div>

      <button
        onClick={() => setCurrentSlide((prev) => (prev - 1 + bannerSlides.length) % bannerSlides.length)}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm text-white flex items-center justify-center hover:bg-white/30 transition-all"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
      </button>
      <button
        onClick={() => setCurrentSlide((prev) => (prev + 1) % bannerSlides.length)}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm text-white flex items-center justify-center hover:bg-white/30 transition-all"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
      </button>
    </section>
  );
}

function CategorySection() {
  return (
    <section className="py-12 bg-white">
      <div className="container-custom">
        <div className="text-center mb-10">
          <h2 className="section-title">Danh Mục</h2>
          <p className="section-subtitle">Khám phá hàng ngàn sản phẩm theo danh mục</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {categories.map((cat) => (
            <Link key={cat.id} href={`/products?category=${cat.id}`} className="group">
              <div className="card p-6 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <div className={`w-16 h-16 mx-auto rounded-2xl ${cat.color} flex items-center justify-center text-3xl mb-3 group-hover:scale-110 transition-transform`}>
                  {cat.icon}
                </div>
                <h3 className="font-semibold text-gray-900 text-sm">{cat.name}</h3>
                <p className="text-xs text-gray-500 mt-0.5">{formatCount(cat.count)} sp</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturedStores() {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container-custom">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="section-title">Cửa Hàng Nổi Bật</h2>
            <p className="section-subtitle">Khám phá các cửa hàng được yêu thích nhất</p>
          </div>
          <Link href="/stores" className="btn-outline hidden sm:flex">Xem tất cả →</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {mockStores.map((store) => (
            <Link key={store.id} href={`/stores/${store.id}`} className="group">
              <div className="card overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="relative h-32 bg-gradient-to-br from-primary-600 to-primary-800">
                  <div className="absolute inset-0 bg-black/20" />
                  {store.isOpen && (
                    <span className="absolute top-3 left-3 badge-success text-xs">Đang mở cửa</span>
                  )}
                  <h3 className="absolute bottom-3 left-3 text-white font-bold text-lg drop-shadow-lg">{store.name}</h3>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-500">Tầng {store.floor}</span>
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-400">★</span>
                      <span className="text-sm font-semibold">{store.rating}</span>
                      <span className="text-xs text-gray-400">({store.totalReviews})</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">{store.description}</p>
                  <div className="flex gap-1.5 mt-3 flex-wrap">
                    {store.tags.slice(0, 2).map((tag) => (
                      <span key={tag} className="badge-primary text-xs">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div className="text-center mt-6 sm:hidden">
          <Link href="/stores" className="btn-outline">Xem tất cả cửa hàng →</Link>
        </div>
      </div>
    </section>
  );
}

function FlashSale() {
  const timeLeft = { hours: 12, minutes: 30, seconds: 45 };

  return (
    <section className="py-12 bg-gradient-to-r from-red-500 to-orange-500">
      <div className="container-custom">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-3xl md:text-4xl font-extrabold text-white">⚡ Flash Sale</h2>
              <span className="px-3 py-1 bg-white/20 rounded-full text-white text-sm font-semibold">
                Kết thúc trong
              </span>
            </div>
            <p className="text-white/80 mt-1">Săn deal siêu rẻ - Giảm đến 70%</p>
          </div>
          <div className="flex items-center gap-2 text-white">
            <div className="bg-white/20 backdrop-blur rounded-lg px-3 py-2 text-center">
              <span className="text-2xl font-bold">{String(timeLeft.hours).padStart(2, '0')}</span>
              <span className="text-xs block">Giờ</span>
            </div>
            <span className="text-2xl font-bold">:</span>
            <div className="bg-white/20 backdrop-blur rounded-lg px-3 py-2 text-center">
              <span className="text-2xl font-bold">{String(timeLeft.minutes).padStart(2, '0')}</span>
              <span className="text-xs block">Phút</span>
            </div>
            <span className="text-2xl font-bold">:</span>
            <div className="bg-white/20 backdrop-blur rounded-lg px-3 py-2 text-center">
              <span className="text-2xl font-bold">{String(timeLeft.seconds).padStart(2, '0')}</span>
              <span className="text-xs block">Giây</span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {mockProducts.slice(0, 4).map((product) => (
            <Link key={product.id} href={`/products/${product.id}`} className="group">
              <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                <div className="relative aspect-square bg-gray-100">
                  <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-bold">
                    -{product.discountPercent}%
                  </div>
                  {product.discountPercent > 30 && (
                    <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-lg text-xs font-bold animate-pulse">
                      🔥 HOT
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-1">{product.name}</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-bold text-red-500">{formatPrice(product.price)}₫</span>
                    <span className="text-xs text-gray-400 line-through">{formatPrice(product.comparePrice)}₫</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                    <span>★ {product.rating}</span>
                    <span>•</span>
                    <span>Đã bán {formatCount(product.totalSold)}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function PromotionSection() {
  return (
    <section className="py-12 bg-white">
      <div className="container-custom">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="section-title">🎉 Khuyến Mãi & Ưu Đãi</h2>
            <p className="section-subtitle">Đừng bỏ lỡ những ưu đãi hấp dẫn</p>
          </div>
          <Link href="/promotions" className="btn-outline hidden sm:flex">Xem tất cả →</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {promotions.map((promo) => (
            <Link key={promo.id} href="/promotions" className="group">
              <div className={`relative h-48 rounded-2xl overflow-hidden bg-gradient-to-br ${promo.color} shadow-lg`}>
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
                <div className="relative z-10 p-6 flex flex-col justify-between h-full">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">{promo.title}</h3>
                    <p className="text-white/90">{promo.description}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/70">HSD: {promo.validUntil}</span>
                    <span className="text-white font-semibold text-sm group-hover:translate-x-1 transition-transform">
                      Nhận ngay →
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturedProducts() {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container-custom">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="section-title">Sản Phẩm Nổi Bật</h2>
            <p className="section-subtitle">Sản phẩm bán chạy nhất tại Smart Mall</p>
          </div>
          <Link href="/products" className="btn-outline hidden sm:flex">Xem tất cả →</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {mockProducts.map((product) => (
            <Link key={product.id} href={`/products/${product.id}`} className="group">
              <div className="card overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="relative aspect-square bg-gray-100">
                  <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  {product.discountPercent > 0 && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-bold">
                      -{product.discountPercent}%
                    </div>
                  )}
                  <button className="absolute top-2 right-2 w-8 h-8 bg-white/80 backdrop-blur rounded-full flex items-center justify-center hover:bg-white transition-colors">
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                </div>
                <div className="p-3">
                  <p className="text-xs text-gray-500 mb-1">{product.storeName}</p>
                  <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-2">{product.name}</h3>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-lg font-bold text-primary-600">{formatPrice(product.price)}₫</span>
                    {product.comparePrice > product.price && (
                      <span className="text-xs text-gray-400 line-through">{formatPrice(product.comparePrice)}₫</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-400">★</span>
                      <span>{product.rating}</span>
                    </div>
                    <span>Đã bán {formatCount(product.totalSold)}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function EventsSection() {
  return (
    <section className="py-12 bg-white">
      <div className="container-custom">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="section-title">🎪 Sự Kiện Sắp Tới</h2>
            <p className="section-subtitle">Các hoạt động và sự kiện tại Smart Mall</p>
          </div>
          <Link href="/events" className="btn-outline hidden sm:flex">Xem tất cả →</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {events.map((event) => {
            const { day, month } = parseDateStr(event.date);
            return (
              <Link key={event.id} href={`/events/${event.id}`} className="group">
                <div className="card overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <div className="relative h-48 bg-gray-100">
                    <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur rounded-lg px-3 py-1.5 text-center">
                      <span className="text-lg font-bold text-primary-600 block leading-tight">{day}</span>
                      <span className="text-xs text-gray-600">{"Thg " + month}</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-1">{event.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{event.description}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>📍 {event.location}</span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ServiceSection() {
  const services = [
    { icon: '🎬', title: 'Rạp Phim', description: 'Xem phim chất lượng cao', link: '/cinema' },
    { icon: '🎮', title: 'Game Center', description: 'Giải trí đỉnh cao', link: '/game-center' },
    { icon: '🏋️', title: 'GYM & Yoga', description: 'Rèn luyện sức khỏe', link: '/fitness' },
    { icon: '📚', title: 'Thư Viện', description: 'Không gian đọc sách', link: '/library' },
    { icon: '🎨', title: 'Art Gallery', description: 'Triển lãm nghệ thuật', link: '/gallery' },
    { icon: '🎤', title: 'Karaoke', description: 'Hát ca vui vẻ', link: '/karaoke' },
  ];

  return (
    <section className="py-12 bg-gradient-to-br from-primary-600 to-primary-800 text-white">
      <div className="container-custom">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-extrabold">Dịch Vụ Tiện Ích</h2>
          <p className="text-white/80 mt-2">Trải nghiệm đẳng cấp tại Smart Mall</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {services.map((service) => (
            <Link key={service.title} href={service.link} className="group">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center hover:bg-white/20 transition-all hover:-translate-y-1">
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{service.icon}</div>
                <h3 className="font-semibold mb-1">{service.title}</h3>
                <p className="text-sm text-white/70">{service.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function AppDownloadSection() {
  return (
    <section className="py-16 bg-white">
      <div className="container-custom">
        <div className="bg-gradient-to-r from-primary-600 to-purple-600 rounded-3xl p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-white">
              <h2 className="text-3xl md:text-4xl font-extrabold mb-2">📱 Tải App Smart Mall</h2>
              <p className="text-white/80 text-lg mb-6">Trải nghiệm mua sắm thông minh trên thiết bị di động</p>
              <div className="flex flex-wrap gap-3">
                <a href="#" className="flex items-center gap-3 bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition-colors">
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>
                  <div>
                    <span className="text-xs">Tải trên</span>
                    <p className="font-semibold -mt-1">App Store</p>
                  </div>
                </a>
                <a href="#" className="flex items-center gap-3 bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition-colors">
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor"><path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.199l2.807 1.626a1 1 0 010 1.732l-2.807 1.626L15.206 12l2.492-2.492zM5.864 2.658L16.8 8.99l-2.302 2.302-8.634-8.634z"/></svg>
                  <div>
                    <span className="text-xs">Tải trên</span>
                    <p className="font-semibold -mt-1">Google Play</p>
                  </div>
                </a>
              </div>
            </div>
            <div className="relative">
              <div className="w-48 h-64 bg-gray-800 rounded-3xl border-4 border-gray-700 shadow-2xl flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center mb-2">
                    <span className="text-white font-bold text-2xl">SM</span>
                  </div>
                  <p className="text-white font-semibold text-sm">Smart Mall</p>
                  <p className="text-gray-400 text-xs mt-1">Trung tâm thương mại</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function NewsletterSection() {
  return (
    <section className="py-12 bg-gray-900">
      <div className="container-custom">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">📧 Đăng Ký Nhận Tin</h2>
          <p className="text-gray-400 mb-6">Nhận thông tin khuyến mãi và sự kiện mới nhất từ Smart Mall</p>
          <div className="flex gap-3">
            <input
              type="email"
              placeholder="Nhập email của bạn..."
              className="input-field flex-1 bg-gray-800 border-gray-700 text-white placeholder-gray-500"
            />
            <button className="btn-primary whitespace-nowrap">Đăng ký</button>
          </div>
        </div>
      </div>
    </section>
  );
}

// ==================== MAIN HOME PAGE ====================

export default function HomePage() {
  return (
    <div className="animate-fade-in">
      <HeroBanner />
      <CategorySection />
      <FeaturedStores />
      <FlashSale />
      <PromotionSection />
      <FeaturedProducts />
      <ServiceSection />
      <EventsSection />
      <AppDownloadSection />
      <NewsletterSection />
    </div>
  );
}