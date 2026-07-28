import React, { useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';

const formatPrice = (amount: number) => {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

const mockWishlistItems = [
    { id: 'prod_1', name: 'Áo thun nam cao cấp', price: 299000, comparePrice: 499000, images: ['https://picsum.photos/seed/prod1/400/400'], rating: 4.5, totalSold: 1500, discountPercent: 40, storeName: 'Fashion Hub', inStock: true, addedAt: '2024-12-20' },
    { id: 'prod_2', name: 'Điện thoại thông minh XYZ', price: 15999000, comparePrice: 19999000, images: ['https://picsum.photos/seed/prod2/400/400'], rating: 4.8, totalSold: 892, discountPercent: 20, storeName: 'TechZone', inStock: true, addedAt: '2024-12-18' },
    { id: 'prod_3', name: 'Combo trà sữa đặc biệt', price: 49000, comparePrice: 65000, images: ['https://picsum.photos/seed/prod3/400/400'], rating: 4.3, totalSold: 5000, discountPercent: 25, storeName: 'Trà Sữa Đài Loan', inStock: true, addedAt: '2024-12-15' },
    { id: 'prod_4', name: 'Tai nghe Bluetooth Pro', price: 899000, comparePrice: 1299000, images: ['https://picsum.photos/seed/prod4/400/400'], rating: 4.6, totalSold: 2300, discountPercent: 30, storeName: 'TechZone', inStock: false, addedAt: '2024-12-10' },
    { id: 'prod_5', name: 'Kem dưỡng da mặt', price: 599000, comparePrice: 799000, images: ['https://picsum.photos/seed/prod5/400/400'], rating: 4.4, totalSold: 3200, discountPercent: 25, storeName: 'Fashion Hub', inStock: true, addedAt: '2024-12-08' },
    { id: 'prod_6', name: 'Balo thời trang', price: 399000, comparePrice: 599000, images: ['https://picsum.photos/seed/prod6/400/400'], rating: 4.2, totalSold: 1800, discountPercent: 35, storeName: 'Fashion Hub', inStock: true, addedAt: '2024-12-05' },
    { id: 'prod_7', name: 'Đồng hồ thông minh', price: 2999000, comparePrice: 3999000, images: ['https://picsum.photos/seed/prod7/400/400'], rating: 4.7, totalSold: 560, discountPercent: 25, storeName: 'TechZone', inStock: false, addedAt: '2024-12-01' },
];

export default function WishlistPage() {
    const [items, setItems] = useState(mockWishlistItems);
    const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

    const removeItem = (id: string) => {
        setItems(items.filter(item => item.id !== id));
        toast.success('Đã xóa khỏi danh sách yêu thích');
    };

    const toggleSelect = (id: string) => {
        const newSelected = new Set(selectedItems);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedItems(newSelected);
    };

    const selectAll = () => {
        if (selectedItems.size === items.length) {
            setSelectedItems(new Set());
        } else {
            setSelectedItems(new Set(items.map(i => i.id)));
        }
    };

    const addToCart = (id: string) => {
        toast.success('Đã thêm vào giỏ hàng');
    };

    const addSelectedToCart = () => {
        if (selectedItems.size === 0) {
            toast.error('Vui lòng chọn sản phẩm');
            return;
        }
        toast.success(`Đã thêm ${selectedItems.size} sản phẩm vào giỏ hàng`);
        setSelectedItems(new Set());
    };

    const shareWishlist = () => {
        navigator.clipboard?.writeText(window.location.href);
        toast.success('Đã copy link chia sẻ');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
                <div className="container-custom py-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold">❤️ Danh Sách Yêu Thích</h1>
                            <p className="text-white/80 mt-1">{items.length} sản phẩm</p>
                        </div>
                        <div className="flex gap-3">
                            <button onClick={shareWishlist} className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl hover:bg-white/30 transition-colors text-sm">
                                📤 Chia sẻ
                            </button>
                            <button onClick={addSelectedToCart} className="bg-white text-primary-600 px-4 py-2 rounded-xl hover:bg-gray-100 transition-colors text-sm font-semibold">
                                🛒 Thêm vào giỏ
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container-custom py-6">
                {items.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="text-6xl mb-4">💔</div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Danh sách yêu thích trống</h3>
                        <p className="text-gray-600 mb-6">Hãy khám phá và thêm sản phẩm bạn yêu thích</p>
                        <Link href="/products" className="btn-primary">Khám phá ngay</Link>
                    </div>
                ) : (
                    <div className="flex flex-col lg:flex-row gap-6">
                        {/* Main List */}
                        <div className="flex-1 space-y-4">
                            {/* Select All Bar */}
                            <div className="bg-white rounded-xl p-4 shadow-sm flex items-center justify-between">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input type="checkbox" checked={selectedItems.size === items.length} onChange={selectAll} className="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                                    <span className="font-medium text-gray-700">Chọn tất cả ({items.length})</span>
                                </label>
                                <span className="text-sm text-gray-500">
                                    {selectedItems.size > 0 && `Đã chọn ${selectedItems.size}`}
                                </span>
                            </div>

                            {items.map(product => (
                                <div key={product.id} className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex gap-4">
                                        {/* Checkbox */}
                                        <div className="flex items-start pt-2">
                                            <input type="checkbox" checked={selectedItems.has(product.id)} onChange={() => toggleSelect(product.id)} className="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                                        </div>

                                        {/* Image */}
                                        <Link href={`/products/${product.id}`} className="flex-shrink-0">
                                            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 rounded-xl overflow-hidden">
                                                <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                                            </div>
                                        </Link>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <Link href={`/products/${product.id}`}>
                                                        <h3 className="font-semibold text-gray-900 hover:text-primary-600 transition-colors line-clamp-1">{product.name}</h3>
                                                    </Link>
                                                    <p className="text-xs text-gray-500 mt-0.5">{product.storeName}</p>
                                                </div>
                                                <button onClick={() => removeItem(product.id)} className="text-gray-400 hover:text-red-500 transition-colors p-1">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                </button>
                                            </div>

                                            <div className="flex items-center gap-2 mt-1">
                                                <div className="flex items-center gap-1">
                                                    <span className="text-yellow-400 text-xs">★</span>
                                                    <span className="text-sm font-medium">{product.rating}</span>
                                                </div>
                                                <span className="text-xs text-gray-400">Đã bán {formatPrice(product.totalSold)}</span>
                                            </div>

                                            <div className="flex items-baseline gap-2 mt-2">
                                                <span className="text-lg font-bold text-primary-600">{formatPrice(product.price)}₫</span>
                                                {product.comparePrice > product.price && (
                                                    <span className="text-xs text-gray-400 line-through">{formatPrice(product.comparePrice)}₫</span>
                                                )}
                                                {product.discountPercent > 0 && (
                                                    <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-semibold">-{product.discountPercent}%</span>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-2 mt-3">
                                                {product.inStock ? (
                                                    <button onClick={() => addToCart(product.id)} className="flex-1 sm:flex-none bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors">
                                                        🛒 Thêm vào giỏ
                                                    </button>
                                                ) : (
                                                    <span className="text-sm text-gray-400 bg-gray-100 px-3 py-2 rounded-lg">Hết hàng</span>
                                                )}
                                                <button onClick={() => removeItem(product.id)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors sm:hidden">
                                                    Xóa
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Sidebar Summary */}
                        <div className="lg:w-80">
                            <div className="bg-white rounded-xl p-6 shadow-sm sticky top-24">
                                <h3 className="font-semibold text-gray-900 mb-4">Tóm tắt</h3>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Tổng sản phẩm</span>
                                        <span className="font-medium">{items.length}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Còn hàng</span>
                                        <span className="font-medium text-green-600">{items.filter(i => i.inStock).length}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Hết hàng</span>
                                        <span className="font-medium text-red-600">{items.filter(i => !i.inStock).length}</span>
                                    </div>
                                    <div className="border-t pt-3">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Đã chọn</span>
                                            <span className="font-bold text-primary-600">{selectedItems.size}</span>
                                        </div>
                                    </div>
                                </div>
                                <button onClick={addSelectedToCart} disabled={selectedItems.size === 0} className="btn-primary w-full mt-4 disabled:opacity-50 disabled:cursor-not-allowed">
                                    🛒 Thêm vào giỏ hàng
                                </button>
                                <Link href="/products" className="block text-center text-sm text-primary-600 mt-3 hover:underline">
                                    ← Tiếp tục mua sắm
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}