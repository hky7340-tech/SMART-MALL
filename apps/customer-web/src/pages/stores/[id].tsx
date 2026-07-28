import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const storeData: Record<string, any> = {
  store_1: {
    id: 'store_1', name: 'Fashion Hub', description: 'Cửa hàng thời trang cao cấp với các thương hiệu nổi tiếng trong và ngoài nước. Chúng tôi cam kết mang đến cho bạn những trải nghiệm mua sắm tuyệt vời nhất với các bộ sưu tập thời trang mới nhất.', shortDescription: 'Thời trang nam nữ', logo: 'https://picsum.photos/seed/store1/200/200', banner: 'https://picsum.photos/seed/store1b/1200/400', floor: 1, unit: 'L1-01', phone: '0901 234 567', email: 'fashionhub@smartmall.com', website: 'https://fashionhub.vn', facebook: 'https://facebook.com/fashionhub', instagram: 'https://instagram.com/fashionhub', rating: 4.5, totalReviews: 320, isFeatured: true, isOpen: true, openTime: '09:00', closeTime: '22:00', tags: ['thời trang', 'cao cấp', 'xu hướng', 'nam', 'nữ'],
    gallery: ['https://picsum.photos/seed/g1/800/600', 'https://picsum.photos/seed/g2/800/600', 'https://picsum.photos/seed/g3/800/600', 'https://picsum.photos/seed/g4/800/600'],
    reviews: [
      { id: 1, user: 'Nguyễn Văn A', avatar: 'https://picsum.photos/seed/u1/100/100', rating: 5, comment: 'Sản phẩm chất lượng, nhân viên nhiệt tình!', date: '2024-03-15' },
      { id: 2, user: 'Trần Thị B', avatar: 'https://picsum.photos/seed/u2/100/100', rating: 4, comment: 'Thiết kế đẹp, sẽ quay lại ủng hộ.', date: '2024-03-10' },
    ],
    products: [
      { id: 'prod_1', name: 'Áo thun nam cao cấp', price: 299000, comparePrice: 499000, discountPercent: 40, image: 'https://picsum.photos/seed/prod1/400/400', sold: 1500 },
      { id: 'prod_6', name: 'Balo thời trang', price: 399000, comparePrice: 599000, discountPercent: 35, image: 'https://picsum.photos/seed/prod6/400/400', sold: 1800 },
    ],
  },
  store_2: {
    id: 'store_2', name: 'Trà Sữa Đài Loan', description: 'Trà sữa ngon nhất quận với nguyên liệu nhập khẩu trực tiếp từ Đài Loan.', shortDescription: 'Trà sữa chất lượng', logo: 'https://picsum.photos/seed/store2/200/200', banner: 'https://picsum.photos/seed/store2b/1200/400', floor: 2, unit: 'L2-05', phone: '0902 345 678', email: 'milktea@smartmall.com', rating: 4.3, totalReviews: 580, isFeatured: true, isOpen: true, openTime: '08:00', closeTime: '23:00', tags: ['trà sữa', 'đồ uống', 'ăn vặt'],
    gallery: ['https://picsum.photos/seed/g5/800/600', 'https://picsum.photos/seed/g6/800/600'],
    reviews: [
      { id: 3, user: 'Lê Văn C', avatar: 'https://picsum.photos/seed/u3/100/100', rating: 5, comment: 'Trà sữa ngon, giá cả hợp lý!', date: '2024-03-12' },
    ],
    products: [
      { id: 'prod_3', name: 'Combo trà sữa đặc biệt', price: 49000, comparePrice: 65000, discountPercent: 25, image: 'https://picsum.photos/seed/prod3/400/400', sold: 5000 },
    ],
  },
  store_3: {
    id: 'store_3', name: 'TechZone', description: 'Điện thoại, laptop & phụ kiện chính hãng. Bảo hành 12 tháng.', shortDescription: 'Công nghệ chính hãng', logo: 'https://picsum.photos/seed/store3/200/200', banner: 'https://picsum.photos/seed/store3b/1200/400', floor: 3, unit: 'L3-10', phone: '0903 456 789', email: 'info@techzone.vn', website: 'https://techzone.vn', rating: 4.7, totalReviews: 420, isFeatured: true, isOpen: true, openTime: '09:30', closeTime: '21:30', tags: ['điện tử', 'điện thoại', 'laptop', 'công nghệ'],
    gallery: ['https://picsum.photos/seed/g7/800/600', 'https://picsum.photos/seed/g8/800/600'],
    reviews: [
      { id: 4, user: 'Phạm Văn D', avatar: 'https://picsum.photos/seed/u4/100/100', rating: 5, comment: 'Sản phẩm chính hãng, giá tốt.', date: '2024-03-08' },
    ],
    products: [
      { id: 'prod_2', name: 'Điện thoại thông minh XYZ', price: 15999000, comparePrice: 19999000, discountPercent: 20, image: 'https://picsum.photos/seed/prod2/400/400', sold: 892 },
      { id: 'prod_4', name: 'Tai nghe Bluetooth Pro', price: 899000, comparePrice: 1299000, discountPercent: 30, image: 'https://picsum.photos/seed/prod4/400/400', sold: 2300 },
      { id: 'prod_7', name: 'Đồng hồ thông minh', price: 2999000, comparePrice: 3999000, discountPercent: 25, image: 'https://picsum.photos/seed/prod7/400/400', sold: 560 },
    ],
  },
};

export default function StoreDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const store = storeData[id as string];
  const [activeTab, setActiveTab] = useState<'products' | 'reviews' | 'info'>('products');

  if (!store) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🏪</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Không tìm thấy cửa hàng</h2>
          <Link href="/stores" className="btn-primary">Quay lại danh sách</Link>
        </div>
      </div>
    );
  }

  const formatPrice = (price: number) => price.toLocaleString('vi-VN') + '₫';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Banner */}
      <div className="relative h-64 md:h-80 lg:h-96 bg-gradient-to-r from-primary-700 to-primary-900 overflow-hidden">
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <div className="container-custom">
            <div className="flex items-end gap-6">
              <div className="w-20 h-20 md:w-28 md:h-28 rounded-2xl overflow-hidden border-4 border-white shadow-xl flex-shrink-0">
                <img src={store.logo} alt={store.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <h1 className="text-2xl md:text-4xl font-bold text-white mb-2">{store.name}</h1>
                <p className="text-white/80 text-sm md:text-base">{store.shortDescription}</p>
                <div className="flex items-center gap-4 mt-2 text-white/80 text-sm">
                  <span>🏠 Tầng {store.floor} - {store.unit}</span>
                  <span>🕐 {store.openTime} - {store.closeTime}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-custom py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="flex border-b border-gray-200 mb-6">
              {[
                { id: 'products', label: 'Sản phẩm', icon: '🛍️' },
                { id: 'reviews', label: 'Đánh giá', icon: '⭐' },
                { id: 'info', label: 'Thông tin', icon: 'ℹ️' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.id
                      ? 'border-primary-600 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
            </div>

            {/* Products Tab */}
            {activeTab === 'products' && (
              <div className="space-y-6">
                {store.products?.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {store.products.map((product: any) => (
                      <Link key={product.id} href={`/products/${product.id}`} className="group">
                        <div className="card overflow-hidden hover:shadow-lg transition-all">
                          <div className="aspect-square bg-gray-100">
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                            {product.discountPercent > 0 && (
                              <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-bold">
                                -{product.discountPercent}%
                              </div>
                            )}
                          </div>
                          <div className="p-3">
                            <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-2">{product.name}</h3>
                            <div className="flex items-baseline gap-2">
                              <span className="font-bold text-primary-600">{formatPrice(product.price)}</span>
                              {product.comparePrice && <span className="text-xs text-gray-400 line-through">{formatPrice(product.comparePrice)}</span>}
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Đã bán {product.sold.toLocaleString()}</p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-10">Chưa có sản phẩm nào</p>
                )}
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div className="space-y-4">
                {store.reviews?.map((review: any) => (
                  <div key={review.id} className="card p-4">
                    <div className="flex items-start gap-3">
                      <img src={review.avatar} alt={review.user} className="w-10 h-10 rounded-full" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-gray-900">{review.user}</span>
                          <span className="text-xs text-gray-400">{review.date}</span>
                        </div>
                        <div className="flex items-center gap-1 mb-2">
                          {[1, 2, 3, 4, 5].map(star => (
                            <span key={star} className={`text-sm ${star <= review.rating ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>
                          ))}
                        </div>
                        <p className="text-gray-600 text-sm">{review.comment}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Info Tab */}
            {activeTab === 'info' && (
              <div className="card p-6 space-y-4">
                <h3 className="font-semibold text-lg text-gray-900">Giới thiệu</h3>
                <p className="text-gray-600">{store.description}</p>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-500 mb-1">📍 Vị trí</p>
                    <p className="font-medium text-gray-900">Tầng {store.floor} - {store.unit}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-500 mb-1">🕐 Giờ mở cửa</p>
                    <p className="font-medium text-gray-900">{store.openTime} - {store.closeTime}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-500 mb-1">📞 Điện thoại</p>
                    <a href={`tel:${store.phone}`} className="font-medium text-primary-600 hover:underline">{store.phone}</a>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-500 mb-1">✉️ Email</p>
                    <a href={`mailto:${store.email}`} className="font-medium text-primary-600 hover:underline">{store.email}</a>
                  </div>
                </div>

                {store.website && (
                  <div className="flex items-center gap-4">
                    <a href={store.website} target="_blank" className="text-primary-600 hover:underline text-sm">🌐 Website</a>
                    {store.facebook && <a href={store.facebook} target="_blank" className="text-blue-600 hover:underline text-sm">📘 Facebook</a>}
                    {store.instagram && <a href={store.instagram} target="_blank" className="text-pink-600 hover:underline text-sm">📸 Instagram</a>}
                  </div>
                )}

                {/* Tags */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Từ khóa</h4>
                  <div className="flex gap-2 flex-wrap">
                    {store.tags.map((tag: string) => (
                      <span key={tag} className="badge-primary text-sm">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Store Actions */}
            <div className="card p-5 space-y-3">
              <h3 className="font-semibold text-gray-900">Liên hệ</h3>
              <a href={`tel:${store.phone}`} className="flex items-center gap-3 text-gray-600 hover:text-primary-600">
                <span className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600">📞</span>
                <span>{store.phone}</span>
              </a>
              <a href={`mailto:${store.email}`} className="flex items-center gap-3 text-gray-600 hover:text-primary-600">
                <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">✉️</span>
                <span>{store.email}</span>
              </a>
              <div className="flex items-center gap-3 text-gray-600">
                <span className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">📍</span>
                <span>Tầng {store.floor} - Gian hàng {store.unit}</span>
              </div>
            </div>

            {/* Rating Summary */}
            <div className="card p-5">
              <h3 className="font-semibold text-gray-900 mb-4">Đánh giá</h3>
              <div className="flex items-center gap-4 mb-4">
                <div className="text-4xl font-bold text-gray-900">{store.rating}</div>
                <div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <span key={star} className={star <= Math.round(store.rating) ? 'text-yellow-400' : 'text-gray-300'}>★</span>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500">{store.totalReviews.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')} đánh giá</p>
                </div>
              </div>
              {[5, 4, 3, 2, 1].map(star => {
                const percent = store.totalReviews > 0 ? Math.round((store.reviews?.filter((r: any) => r.rating === star)?.length || 0) / store.totalReviews * 100) : 0;
                return (
                  <div key={star} className="flex items-center gap-2 text-sm mb-1">
                    <span className="w-8 text-gray-600">{star}★</span>
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${percent}%` }} />
                    </div>
                    <span className="w-8 text-gray-400 text-xs">{percent}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
