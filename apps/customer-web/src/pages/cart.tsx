import React, { useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';

const initialCartItems = [
  { id: '1', productId: 'prod_1', name: 'Áo thun nam cao cấp', price: 299000, quantity: 2, image: 'https://picsum.photos/seed/prod1/200/200', storeName: 'Fashion Hub', selected: true },
  { id: '2', productId: 'prod_4', name: 'Tai nghe Bluetooth Pro', price: 899000, quantity: 1, image: 'https://picsum.photos/seed/prod4/200/200', storeName: 'TechZone', selected: true },
  { id: '3', productId: 'prod_3', name: 'Combo trà sữa đặc biệt', price: 49000, quantity: 3, image: 'https://picsum.photos/seed/prod3/200/200', storeName: 'Trà Sữa Đài Loan', selected: false },
];

const vouchers = [
  { id: 'v1', code: 'SALE50', description: 'Giảm 50.000₫ cho đơn từ 200.000₫', discount: 50000, minOrder: 200000, expiry: '31/12/2024' },
  { id: 'v2', code: 'FREESHIP', description: 'Miễn phí vận chuyển cho đơn từ 100.000₫', discount: 30000, minOrder: 100000, expiry: '31/12/2024' },
  { id: 'v3', code: 'WELCOME10', description: 'Giảm 10% cho đơn hàng đầu tiên', discount: 0.1, minOrder: 0, expiry: '31/12/2024', isPercent: true },
];

export default function CartPage() {
  const [cartItems, setCartItems] = useState(initialCartItems);
  const [selectedVoucher, setSelectedVoucher] = useState<string | null>(null);
  const [voucherCode, setVoucherCode] = useState('');
  const [showVoucherModal, setShowVoucherModal] = useState(false);
  const [usePoints, setUsePoints] = useState(false);
  const [useGiftCard, setUseGiftCard] = useState(false);

  const formatPrice = (price: number) => price.toLocaleString('vi-VN') + '₫';

  const toggleSelect = (id: string) => {
    setCartItems(prev => prev.map(item => item.id === id ? { ...item, selected: !item.selected } : item));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeItem = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
    toast.success('Đã xóa sản phẩm khỏi giỏ hàng');
  };

  const selectedItems = cartItems.filter(item => item.selected);
  const subtotal = selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingFee = subtotal >= 500000 ? 0 : 30000;
  const voucherDiscount = selectedVoucher ? (() => {
    const v = vouchers.find(v => v.id === selectedVoucher);
    if (!v) return 0;
    if (v.isPercent) return subtotal * v.discount;
    return v.discount;
  })() : 0;
  const pointsDiscount = usePoints ? Math.min(subtotal * 0.05, 50000) : 0;
  const total = Math.max(0, subtotal - voucherDiscount - pointsDiscount + shippingFee);

  const handleCheckout = () => {
    if (selectedItems.length === 0) {
      toast.error('Vui lòng chọn sản phẩm để thanh toán');
      return;
    }
    toast.success('Đang chuyển đến trang thanh toán...');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Giỏ Hàng</h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Giỏ hàng trống</h2>
            <p className="text-gray-600 mb-6">Hãy khám phá các sản phẩm tại Smart Mall</p>
            <Link href="/products" className="btn-primary">Mua sắm ngay</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {/* Select All */}
              <div className="card p-4 flex items-center justify-between">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={cartItems.every(item => item.selected)}
                    onChange={() => {
                      const allSelected = cartItems.every(item => item.selected);
                      setCartItems(prev => prev.map(item => ({ ...item, selected: !allSelected })));
                    }}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Chọn tất cả ({cartItems.length} sản phẩm)</span>
                </label>
                <button onClick={() => { setCartItems([]); toast.success('Đã xóa tất cả'); }} className="text-sm text-red-500 hover:underline">Xóa tất cả</button>
              </div>

              {/* Items */}
              {cartItems.map(item => (
                <div key={item.id} className="card p-4">
                  <div className="flex gap-4">
                    <input
                      type="checkbox"
                      checked={item.selected}
                      onChange={() => toggleSelect(item.id)}
                      className="mt-12 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <Link href={`/products/${item.productId}`} className="w-24 h-24 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500 mb-1">{item.storeName}</p>
                      <Link href={`/products/${item.productId}`} className="font-semibold text-gray-900 hover:text-primary-600 line-clamp-2">
                        {item.name}
                      </Link>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-3">
                          <button onClick={() => updateQuantity(item.id, -1)} className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50">-</button>
                          <span className="font-semibold">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)} className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50">+</button>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-primary-600">{formatPrice(item.price * item.quantity)}</p>
                          <p className="text-xs text-gray-400">{formatPrice(item.price)}/cái</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100">
                        <button onClick={() => removeItem(item.id)} className="text-sm text-gray-400 hover:text-red-500 flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          Xóa
                        </button>
                        <button className="text-sm text-gray-400 hover:text-primary-600">❤️ Yêu thích</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Cart Summary */}
            <div className="lg:col-span-1">
              <div className="card p-5 sticky top-24 space-y-4">
                <h3 className="font-semibold text-lg text-gray-900">Tóm tắt đơn hàng</h3>

                {/* Voucher */}
                <div className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-xl p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">🎫 Mã giảm giá</span>
                    <button onClick={() => setShowVoucherModal(true)} className="text-xs text-primary-600 hover:underline">Chọn mã</button>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={voucherCode}
                      onChange={(e) => setVoucherCode(e.target.value)}
                      placeholder="Nhập mã giảm giá"
                      className="input-field flex-1 text-sm"
                    />
                    <button onClick={() => { if (voucherCode) { setSelectedVoucher('v1'); toast.success('Áp dụng mã thành công!'); } }} className="btn-primary text-sm px-4">Áp dụng</button>
                  </div>
                </div>

                {/* Points & Gift Card */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={usePoints} onChange={() => setUsePoints(!usePoints)} className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                    <span className="text-sm text-gray-700">Sử dụng điểm thưởng (5.000 điểm = 50.000₫)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={useGiftCard} onChange={() => setUseGiftCard(!useGiftCard)} className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                    <span className="text-sm text-gray-700">Sử dụng Gift Card</span>
                  </label>
                </div>

                {/* Totals */}
                <div className="border-t border-gray-100 pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Tạm tính</span>
                    <span className="text-gray-900">{formatPrice(subtotal)}</span>
                  </div>
                  {voucherDiscount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-green-600">Giảm giá</span>
                      <span className="text-green-600">-{formatPrice(voucherDiscount)}</span>
                    </div>
                  )}
                  {pointsDiscount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-green-600">Điểm thưởng</span>
                      <span className="text-green-600">-{formatPrice(pointsDiscount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Phí vận chuyển</span>
                    <span className={shippingFee === 0 ? 'text-green-600' : 'text-gray-900'}>
                      {shippingFee === 0 ? 'Miễn phí' : formatPrice(shippingFee)}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-3 border-t border-gray-200">
                    <span>Tổng cộng</span>
                    <span className="text-primary-600">{formatPrice(total)}</span>
                  </div>
                </div>

                <button onClick={handleCheckout} className="btn-primary w-full py-3 text-lg" disabled={selectedItems.length === 0}>
                  Thanh toán ({selectedItems.length} sản phẩm)
                </button>

                <div className="flex items-center justify-center gap-3 text-xs text-gray-400">
                  <span>🔒 Thanh toán an toàn</span>
                  <span>🚚 Miễn phí vận chuyển cho đơn từ 500.000₫</span>
                </div>

                {/* Payment Methods */}
                <div className="text-center">
                  <p className="text-xs text-gray-500 mb-2">Chấp nhận thanh toán</p>
                  <div className="flex items-center justify-center gap-3">
                    <span className="px-2 py-1 bg-gray-100 rounded text-xs font-medium">VNPay</span>
                    <span className="px-2 py-1 bg-gray-100 rounded text-xs font-medium">MoMo</span>
                    <span className="px-2 py-1 bg-gray-100 rounded text-xs font-medium">ZaloPay</span>
                    <span className="px-2 py-1 bg-gray-100 rounded text-xs font-medium">Visa</span>
                    <span className="px-2 py-1 bg-gray-100 rounded text-xs font-medium">COD</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Voucher Modal */}
      {showVoucherModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowVoucherModal(false)}>
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Chọn mã giảm giá</h3>
              <button onClick={() => setShowVoucherModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <div className="p-5 space-y-3">
              {vouchers.map(voucher => (
                <button
                  key={voucher.id}
                  onClick={() => { setSelectedVoucher(voucher.id); setShowVoucherModal(false); toast.success('Áp dụng mã thành công!'); }}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-colors ${
                    selectedVoucher === voucher.id ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <span className="font-bold text-primary-600">{voucher.code}</span>
                      <p className="text-sm text-gray-600 mt-1">{voucher.description}</p>
                    </div>
                    <span className="text-xs text-gray-400">HSD: {voucher.expiry}</span>
                  </div>
                  {voucher.minOrder > 0 && <p className="text-xs text-gray-400">Đơn tối thiểu: {formatPrice(voucher.minOrder)}</p>}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
