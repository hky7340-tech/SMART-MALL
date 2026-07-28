import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import toast from 'react-hot-toast';

const productsData: Record<string, any> = {
  prod_1: {
    id: 'prod_1', name: 'Áo thun nam cao cấp', description: 'Áo thun nam chất liệu cotton 100% cao cấp, thoáng mát, thấm hút mồ hôi tốt. Thiết kế cổ tròn đơn giản, phù hợp mọi hoàn cảnh. Có nhiều màu sắc để lựa chọn.', price: 299000, comparePrice: 499000, discountPercent: 40, images: ['https://picsum.photos/seed/prod1/800/800', 'https://picsum.photos/seed/prod1v2/800/800', 'https://picsum.photos/seed/prod1v3/800/800'], rating: 4.5, totalSold: 1500, totalReviews: 200, storeId: 'store_1', storeName: 'Fashion Hub', categoryId: 'cat_1', isNew: true, brand: 'Fashion Hub', sku: 'FHSH001', attributes: { 'Màu sắc': ['Đen', 'Trắng', 'Xám', 'Xanh navy'], 'Kích cỡ': ['S', 'M', 'L', 'XL', 'XXL'] }, reviews: [
      { id: 1, user: 'Nguyễn Văn A', avatar: 'https://picsum.photos/seed/u1/100/100', rating: 5, comment: 'Áo đẹp, chất vải tốt, mặc rất thoải mái!', date: '2024-03-15' },
      { id: 2, user: 'Trần Thị B', avatar: 'https://picsum.photos/seed/u2/100/100', rating: 4, comment: 'Sản phẩm ok, giao hàng nhanh.', date: '2024-03-12' },
    ],
  },
  prod_2: {
    id: 'prod_2', name: 'Điện thoại thông minh XYZ', description: 'Điện thoại thông minh thế hệ mới với camera 108MP, pin 5000mAh, chip xử lý mạnh mẽ.', price: 15999000, comparePrice: 19999000, discountPercent: 20, images: ['https://picsum.photos/seed/prod2/800/800', 'https://picsum.photos/seed/prod2v2/800/800'], rating: 4.8, totalSold: 892, totalReviews: 150, storeId: 'store_3', storeName: 'TechZone', isNew: true, brand: 'XYZ Tech', sku: 'XYZ001', attributes: { 'Màu sắc': ['Đen', 'Xanh', 'Bạc'], 'Dung lượng': ['128GB', '256GB', '512GB'] },
    reviews: [{ id: 3, user: 'Phạm Văn C', avatar: 'https://picsum.photos/seed/u3/100/100', rating: 5, comment: 'Điện thoại chính hãng, giá tốt.', date: '2024-03-10' }],
  },
};

export default function ProductDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const product = productsData[id as string];
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'reviews'>('description');

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🛍️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Không tìm thấy sản phẩm</h2>
          <Link href="/products" className="btn-primary">Quay lại danh sách</Link>
        </div>
      </div>
    );
  }

  const formatPrice = (price: number) => price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '₫';

  const handleAddToCart = () => {
    toast.success('Đã thêm vào giỏ hàng!');
  };

  const handleBuyNow = () => {
    toast.success('Đang chuyển đến trang thanh toán...');
    router.push('/cart');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-primary-600">Trang chủ</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-primary-600">Sản phẩm</Link>
          <span>/</span>
          <Link href={`/products?category=${product.categoryId}`} className="hover:text-primary-600">{product.brand}</Link>
          <span>/</span>
          <span className="text-gray-900">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Images */}
          <div>
            <div className="aspect-square bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 mb-4">
              <img src={product.images[selectedImage]} alt={product.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img: string, index: number) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-colors ${selectedImage === index ? 'border-primary-500' : 'border-gray-200 hover:border-gray-300'
                    }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              {product.isNew && <span className="badge-success text-xs">Mới</span>}
              {product.discountPercent > 0 && <span className="badge-danger text-xs">-{product.discountPercent}%</span>}
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
            <div className="flex items-center gap-4 mb-4">
              <Link href={`/stores/${product.storeId}`} className="text-sm text-primary-600 hover:underline">
                🏪 {product.storeName}
              </Link>
              <div className="flex items-center gap-1 text-sm">
                <span className="text-yellow-400">★</span>
                <span className="font-semibold">{product.rating}</span>
                <span className="text-gray-400">({product.totalReviews} đánh giá)</span>
              </div>
              <span className="text-sm text-gray-500">Đã bán {product.totalSold.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}</span>
            </div>

            {/* Price */}
            <div className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-xl p-4 mb-6">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-primary-600">{formatPrice(product.price)}</span>
                {product.comparePrice > product.price && (
                  <span className="text-lg text-gray-400 line-through">{formatPrice(product.comparePrice)}</span>
                )}
              </div>
              <p className="text-sm text-primary-600 mt-1">Tiết kiệm: {formatPrice(product.comparePrice - product.price)}</p>
            </div>

            {/* Attributes */}
            {product.attributes && Object.entries(product.attributes).map(([key, values]: [string, any]) => (
              <div key={key} className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">{key}:</label>
                <div className="flex gap-2 flex-wrap">
                  {values.map((value: string) => {
                    const isSelected = key === 'Màu sắc' ? selectedColor === value : selectedSize === value;
                    const onClick = () => key === 'Màu sắc' ? setSelectedColor(value) : setSelectedSize(value);
                    return (
                      <button
                        key={value}
                        onClick={onClick}
                        className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${isSelected ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-200 text-gray-700 hover:border-gray-300'
                          }`}
                      >
                        {value}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Quantity */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Số lượng:</label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50"
                >
                  -
                </button>
                <span className="w-12 text-center font-semibold text-lg">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50"
                >
                  +
                </button>
                <span className="text-sm text-gray-500">Còn 50 sản phẩm</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mb-6">
              <button onClick={handleAddToCart} className="btn-secondary flex-1 flex items-center justify-center gap-2 py-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
                </svg>
                Thêm vào giỏ
              </button>
              <button onClick={handleBuyNow} className="btn-primary flex-1 py-3">Mua ngay</button>
            </div>

            {/* SKU & Barcode */}
            <div className="text-xs text-gray-400 space-y-1">
              <p>SKU: {product.sku}</p>
              <p>Danh mục: {product.categoryId}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-12">
          <div className="flex border-b border-gray-200 mb-6">
            {[
              { id: 'description', label: 'Mô tả sản phẩm' },
              { id: 'reviews', label: `Đánh giá (${product.totalReviews})` },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.id ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === 'description' ? (
            <div className="card p-6">
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {product.reviews.map((review: any) => (
                <div key={review.id} className="card p-4">
                  <div className="flex items-start gap-3">
                    <img src={review.avatar} alt="" className="w-10 h-10 rounded-full" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-gray-900">{review.user}</span>
                        <span className="text-xs text-gray-400">{review.date}</span>
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        {[1, 2, 3, 4, 5].map(star => (
                          <span key={star} className={`text-sm ${star <= review.rating ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>
                        ))}
                      </div>
                      <p className="text-gray-600 text-sm mt-2">{review.comment}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
