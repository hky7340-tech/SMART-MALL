import React, { useState } from 'react';
import Link from 'next/link';
import { formatFullPrice, formatCount, formatRating } from '@/utils/format';

const categories = [
  { id: 'all', name: 'Tất cả', icon: '📋' },
  { id: 'cat_1', name: 'Thời trang', icon: '👕' },
  { id: 'cat_2', name: 'Điện tử', icon: '📱' },
  { id: 'cat_3', name: 'Ẩm thực', icon: '🍜' },
  { id: 'cat_4', name: 'Sức khỏe', icon: '💄' },
  { id: 'cat_5', name: 'Giải trí', icon: '🎮' },
  { id: 'cat_6', name: 'Thể thao', icon: '⚽' },
  { id: 'cat_7', name: 'Sách', icon: '📚' },
  { id: 'cat_8', name: 'Trang sức', icon: '💎' },
];

const allProducts = [
  { id: 'prod_1', name: 'Áo thun nam cao cấp', price: 299000, comparePrice: 499000, images: ['https://picsum.photos/seed/prod1/400/400'], rating: 4.5, totalSold: 1500, discountPercent: 40, storeName: 'Fashion Hub', categoryId: 'cat_1', isNew: true },
  { id: 'prod_2', name: 'Điện thoại thông minh XYZ', price: 15999000, comparePrice: 19999000, images: ['https://picsum.photos/seed/prod2/400/400'], rating: 4.8, totalSold: 892, discountPercent: 20, storeName: 'TechZone', categoryId: 'cat_2', isNew: true },
  { id: 'prod_3', name: 'Combo trà sữa đặc biệt', price: 49000, comparePrice: 65000, images: ['https://picsum.photos/seed/prod3/400/400'], rating: 4.3, totalSold: 5000, discountPercent: 25, storeName: 'Trà Sữa Đài Loan', categoryId: 'cat_3', isNew: false },
  { id: 'prod_4', name: 'Tai nghe Bluetooth Pro', price: 899000, comparePrice: 1299000, images: ['https://picsum.photos/seed/prod4/400/400'], rating: 4.6, totalSold: 2300, discountPercent: 30, storeName: 'TechZone', categoryId: 'cat_2', isNew: true },
  { id: 'prod_5', name: 'Kem dưỡng da mặt', price: 599000, comparePrice: 799000, images: ['https://picsum.photos/seed/prod5/400/400'], rating: 4.4, totalSold: 3200, discountPercent: 25, storeName: 'Beauty Shop', categoryId: 'cat_4', isNew: false },
  { id: 'prod_6', name: 'Balo thời trang', price: 399000, comparePrice: 599000, images: ['https://picsum.photos/seed/prod6/400/400'], rating: 4.2, totalSold: 1800, discountPercent: 35, storeName: 'Fashion Hub', categoryId: 'cat_1', isNew: false },
  { id: 'prod_7', name: 'Đồng hồ thông minh', price: 2999000, comparePrice: 3999000, images: ['https://picsum.photos/seed/prod7/400/400'], rating: 4.7, totalSold: 560, discountPercent: 25, storeName: 'TechZone', categoryId: 'cat_2', isNew: true },
  { id: 'prod_8', name: 'Sách hay mỗi ngày', price: 89000, comparePrice: 120000, images: ['https://picsum.photos/seed/prod8/400/400'], rating: 4.9, totalSold: 7800, discountPercent: 26, storeName: 'BookStore', categoryId: 'cat_7', isNew: false },
  { id: 'prod_9', name: 'Giày thể thao nam', price: 799000, comparePrice: 1299000, images: ['https://picsum.photos/seed/prod9/400/400'], rating: 4.3, totalSold: 2100, discountPercent: 38, storeName: 'Sport Center', categoryId: 'cat_6', isNew: false },
  { id: 'prod_10', name: 'Mỹ phẩm Hàn Quốc', price: 399000, comparePrice: 599000, images: ['https://picsum.photos/seed/prod10/400/400'], rating: 4.5, totalSold: 4500, discountPercent: 33, storeName: 'Beauty Shop', categoryId: 'cat_4', isNew: true },
  { id: 'prod_11', name: 'Bộ board game', price: 299000, comparePrice: 399000, images: ['https://picsum.photos/seed/prod11/400/400'], rating: 4.1, totalSold: 890, discountPercent: 25, storeName: 'Game Center', categoryId: 'cat_5', isNew: false },
  { id: 'prod_12', name: 'Vòng tay bạc', price: 159000, comparePrice: 259000, images: ['https://picsum.photos/seed/prod12/400/400'], rating: 4.6, totalSold: 6700, discountPercent: 39, storeName: 'Jewelry Store', categoryId: 'cat_8', isNew: false },
];

const sortOptions = [
  { value: 'default', label: 'Mặc định' },
  { value: 'price_asc', label: 'Giá: Thấp đến Cao' },
  { value: 'price_desc', label: 'Giá: Cao đến Thấp' },
  { value: 'rating', label: 'Đánh giá cao nhất' },
  { value: 'sold', label: 'Bán chạy nhất' },
  { value: 'newest', label: 'Mới nhất' },
];

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('default');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000000]);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  let filteredProducts = [...allProducts];

  if (selectedCategory !== 'all') {
    filteredProducts = filteredProducts.filter(p => p.categoryId === selectedCategory);
  }

  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    filteredProducts = filteredProducts.filter(p =>
      p.name.toLowerCase().includes(q) || p.storeName.toLowerCase().includes(q)
    );
  }

  filteredProducts = filteredProducts.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

  switch (sortBy) {
    case 'price_asc': filteredProducts.sort((a, b) => a.price - b.price); break;
    case 'price_desc': filteredProducts.sort((a, b) => b.price - a.price); break;
    case 'rating': filteredProducts.sort((a, b) => b.rating - a.rating); break;
    case 'sold': filteredProducts.sort((a, b) => b.totalSold - a.totalSold); break;
    default: break;
  }

  const formatPrice = (price: number) => price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '₫';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="container-custom py-8">
          <h1 className="text-3xl font-bold">Sản Phẩm</h1>
          <p className="text-white/80 mt-1">Khám phá hàng ngàn sản phẩm chất lượng</p>
        </div>
      </div>

      <div className="container-custom py-6">
        {/* Search & Sort Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-10"
            />
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input-field w-auto"
            >
              {sortOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn-secondary flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Bộ lọc
            </button>
            <button
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className="btn-secondary p-2.5"
            >
              {viewMode === 'grid' ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Sidebar Filters */}
          <div className={`w-64 flex-shrink-0 ${showFilters ? 'block' : 'hidden'} lg:block`}>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 sticky top-24">
              {/* Categories */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Danh mục</h3>
                <div className="space-y-1">
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${selectedCategory === cat.id
                        ? 'bg-primary-50 text-primary-700 font-medium'
                        : 'text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                      <span>{cat.icon}</span>
                      <span>{cat.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Khoảng giá</h3>
                <div className="space-y-2">
                  {[
                    { label: 'Dưới 100.000₫', min: 0, max: 100000 },
                    { label: '100.000₫ - 500.000₫', min: 100000, max: 500000 },
                    { label: '500.000₫ - 1.000.000₫', min: 500000, max: 1000000 },
                    { label: '1.000.000₫ - 5.000.000₫', min: 1000000, max: 5000000 },
                    { label: 'Trên 5.000.000₫', min: 5000000, max: 50000000 },
                  ].map((range) => (
                    <button
                      key={range.label}
                      onClick={() => setPriceRange([range.min, range.max])}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${priceRange[0] === range.min && priceRange[1] === range.max
                        ? 'bg-primary-50 text-primary-700 font-medium'
                        : 'text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Clear Filters */}
              <button
                onClick={() => { setSelectedCategory('all'); setPriceRange([0, 50000000]); setSortBy('default'); setSearchQuery(''); }}
                className="w-full btn-secondary text-sm"
              >
                Xóa bộ lọc
              </button>
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-600">
                Hiển thị <strong>{filteredProducts.length}</strong> sản phẩm
              </p>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Không tìm thấy sản phẩm</h3>
                <p className="text-gray-600">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredProducts.map(product => (
                  <Link key={product.id} href={`/products/${product.id}`} className="group">
                    <div className="card overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                      <div className="relative aspect-square bg-gray-100">
                        <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        {product.discountPercent > 0 && (
                          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-bold">
                            -{product.discountPercent}%
                          </div>
                        )}
                        {product.isNew && (
                          <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-lg text-xs font-bold">
                            Mới
                          </div>
                        )}
                        <button className="absolute bottom-2 right-2 w-8 h-8 bg-white/80 backdrop-blur rounded-full flex items-center justify-center hover:bg-white transition-colors">
                          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                        </button>
                      </div>
                      <div className="p-3">
                        <p className="text-xs text-gray-500 mb-1">{product.storeName}</p>
                        <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-2">{product.name}</h3>
                        <div className="flex items-baseline gap-2 mb-2">
                          <span className="text-lg font-bold text-primary-600">{formatPrice(product.price)}</span>
                          {product.comparePrice > product.price && (
                            <span className="text-xs text-gray-400 line-through">{formatPrice(product.comparePrice)}</span>
                          )}
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <span className="text-yellow-400">★</span>
                            <span>{product.rating}</span>
                          </div>
                          <span>Đã bán {product.totalSold.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredProducts.map(product => (
                  <Link key={product.id} href={`/products/${product.id}`} className="block">
                    <div className="card overflow-hidden hover:shadow-xl transition-all duration-300">
                      <div className="flex gap-4 p-4">
                        <div className="w-32 h-32 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                          <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-500 mb-1">{product.storeName}</p>
                          <h3 className="font-semibold text-gray-900 mb-2">{product.name}</h3>
                          <div className="flex items-baseline gap-2 mb-2">
                            <span className="text-2xl font-bold text-primary-600">{formatPrice(product.price)}</span>
                            {product.comparePrice > product.price && (
                              <span className="text-sm text-gray-400 line-through">{formatPrice(product.comparePrice)}</span>
                            )}
                            {product.discountPercent > 0 && (
                              <span className="badge-danger text-xs">-{product.discountPercent}%</span>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <span className="text-yellow-400">★</span>
                              <span>{product.rating}</span>
                            </div>
                            <span>Đã bán {product.totalSold.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Pagination */}
            <div className="flex items-center justify-center gap-2 mt-8">
              <button className="btn-secondary px-4 py-2 text-sm">Trước</button>
              <button className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium">1</button>
              <button className="btn-secondary px-4 py-2 text-sm">2</button>
              <button className="btn-secondary px-4 py-2 text-sm">3</button>
              <span className="text-gray-400">...</span>
              <button className="btn-secondary px-4 py-2 text-sm">10</button>
              <button className="btn-secondary px-4 py-2 text-sm">Sau</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
