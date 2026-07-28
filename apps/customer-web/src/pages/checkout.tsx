import React, { useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';

const paymentMethods = [
  { id: 'cod', name: 'COD (Thanh toán khi nhận hàng)', icon: '💵', desc: 'Thanh toán bằng tiền mặt khi nhận hàng' },
  { id: 'vnpay', name: 'VNPay', icon: '🏦', desc: 'Thanh toán qua cổng VNPay' },
  { id: 'momo', name: 'MoMo', icon: '💜', desc: 'Thanh toán qua ví MoMo' },
  { id: 'zalopay', name: 'ZaloPay', icon: '💙', desc: 'Thanh toán qua ví ZaloPay' },
  { id: 'visa', name: 'Visa/Mastercard', icon: '💳', desc: 'Thanh toán qua thẻ quốc tế' },
  { id: 'wallet', name: 'Ví điện tử Smart Mall', icon: '💰', desc: 'Sử dụng số dư trong ví' },
];

const deliveryMethods = [
  { id: 'standard', name: 'Giao hàng tiêu chuẩn', fee: 30000, days: '3-5 ngày' },
  { id: 'express', name: 'Giao hàng nhanh', fee: 50000, days: '1-2 ngày' },
  { id: 'same_day', name: 'Giao trong ngày', fee: 80000, days: 'Trong ngày' },
];

export default function CheckoutPage() {
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [deliveryMethod, setDeliveryMethod] = useState('standard');
  const [address, setAddress] = useState({
    fullName: 'Nguyễn Văn A',
    phone: '0912 345 678',
    street: '123 Nguyễn Huệ',
    ward: 'Phường Bến Nghé',
    district: 'Quận 1',
    city: 'TP. Hồ Chí Minh',
    note: '',
  });

  const formatPrice = (price: number) => price.toLocaleString('vi-VN') + '₫';
  const subtotal = 1497000;
  const shippingFee = deliveryMethods.find(d => d.id === deliveryMethod)?.fee || 0;
  const discount = 50000;
  const total = subtotal - discount + shippingFee;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-6">
        {/* Steps */}
        <div className="flex items-center justify-center gap-4 mb-8">
          {[
            { id: 1, label: 'Địa chỉ giao hàng' },
            { id: 2, label: 'Phương thức thanh toán' },
            { id: 3, label: 'Xác nhận đơn hàng' },
          ].map((s, i) => (
            <React.Fragment key={s.id}>
              <div className={`flex items-center gap-2 ${step >= s.id ? 'text-primary-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  step >= s.id ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-400'
                }`}>{s.id}</div>
                <span className="text-sm font-medium hidden sm:block">{s.label}</span>
              </div>
              {i < 2 && <div className={`w-12 h-0.5 ${step > s.id ? 'bg-primary-600' : 'bg-gray-200'}`} />}
            </React.Fragment>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Address */}
            {step === 1 && (
              <div className="card p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Địa chỉ giao hàng</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
                      <input type="text" value={address.fullName} onChange={e => setAddress({ ...address, fullName: e.target.value })} className="input-field" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                      <input type="tel" value={address.phone} onChange={e => setAddress({ ...address, phone: e.target.value })} className="input-field" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
                    <input type="text" value={address.street} onChange={e => setAddress({ ...address, street: e.target.value })} className="input-field" />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phường/Xã</label>
                      <input type="text" value={address.ward} onChange={e => setAddress({ ...address, ward: e.target.value })} className="input-field" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Quận/Huyện</label>
                      <input type="text" value={address.district} onChange={e => setAddress({ ...address, district: e.target.value })} className="input-field" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tỉnh/Thành phố</label>
                      <input type="text" value={address.city} onChange={e => setAddress({ ...address, city: e.target.value })} className="input-field" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú (không bắt buộc)</label>
                    <textarea value={address.note} onChange={e => setAddress({ ...address, note: e.target.value })} rows={2} className="input-field" placeholder="Ghi chú cho người giao hàng..." />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Payment */}
            {step === 2 && (
              <div className="card p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Phương thức thanh toán</h2>
                <div className="space-y-3 mb-6">
                  {paymentMethods.map(method => (
                    <label key={method.id} className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-colors ${
                      paymentMethod === method.id ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'
                    }`}>
                      <input type="radio" name="payment" value={method.id} checked={paymentMethod === method.id}
                        onChange={() => setPaymentMethod(method.id)} className="mt-1 text-primary-600 focus:ring-primary-500" />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{method.icon}</span>
                          <span className="font-medium text-gray-900">{method.name}</span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{method.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>

                <h2 className="text-lg font-bold text-gray-900 mb-4">Phương thức vận chuyển</h2>
                <div className="space-y-3">
                  {deliveryMethods.map(method => (
                    <label key={method.id} className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-colors ${
                      deliveryMethod === method.id ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'
                    }`}>
                      <div className="flex items-center gap-3">
                        <input type="radio" name="delivery" value={method.id} checked={deliveryMethod === method.id}
                          onChange={() => setDeliveryMethod(method.id)} className="text-primary-600 focus:ring-primary-500" />
                        <div>
                          <span className="font-medium text-gray-900">{method.name}</span>
                          <p className="text-sm text-gray-500">{method.days}</p>
                        </div>
                      </div>
                      <span className="font-medium text-gray-900">{method.fee === 0 ? 'Miễn phí' : formatPrice(method.fee)}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Confirm */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="card p-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">📍 Địa chỉ giao hàng</h2>
                  <p className="font-medium text-gray-900">{address.fullName} | {address.phone}</p>
                  <p className="text-sm text-gray-600">{address.street}, {address.ward}, {address.district}, {address.city}</p>
                  {address.note && <p className="text-sm text-gray-500 mt-1">Ghi chú: {address.note}</p>}
                </div>

                <div className="card p-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">🛍️ Sản phẩm</h2>
                  {[
                    { name: 'Áo thun nam cao cấp', qty: 2, price: 299000, store: 'Fashion Hub' },
                    { name: 'Tai nghe Bluetooth Pro', qty: 1, price: 899000, store: 'TechZone' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                      <div>
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-500">{item.store} x{item.qty}</p>
                      </div>
                      <span className="font-medium text-gray-900">{formatPrice(item.price * item.qty)}</span>
                    </div>
                  ))}
                </div>

                <div className="card p-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">💳 Phương thức thanh toán</h2>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{paymentMethods.find(p => p.id === paymentMethod)?.icon}</span>
                    <span className="font-medium text-gray-900">{paymentMethods.find(p => p.id === paymentMethod)?.name}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">🚚 {deliveryMethods.find(d => d.id === deliveryMethod)?.name}</p>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between">
              {step > 1 ? (
                <button onClick={() => setStep(step - 1)} className="btn-secondary">Quay lại</button>
              ) : (
                <Link href="/cart" className="btn-secondary">Quay lại giỏ hàng</Link>
              )}
              <button onClick={() => {
                if (step < 3) { setStep(step + 1); }
                else { toast.success('Đặt hàng thành công!'); }
              }} className="btn-primary px-8 py-3">
                {step < 3 ? 'Tiếp tục' : 'Đặt hàng'}
              </button>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="card p-5 sticky top-24 space-y-4">
              <h3 className="font-semibold text-lg text-gray-900">Đơn hàng</h3>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    <img src="https://picsum.photos/seed/prod1/200/200" alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 line-clamp-1">Áo thun nam cao cấp</p>
                    <p className="text-xs text-gray-500">x2</p>
                    <p className="text-sm font-medium text-primary-600">598.000₫</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    <img src="https://picsum.photos/seed/prod4/200/200" alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 line-clamp-1">Tai nghe Bluetooth Pro</p>
                    <p className="text-xs text-gray-500">x1</p>
                    <p className="text-sm font-medium text-primary-600">899.000₫</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Tạm tính</span>
                  <span className="text-gray-900">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-green-600">Giảm giá</span>
                  <span className="text-green-600">-{formatPrice(discount)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Phí vận chuyển</span>
                  <span className="text-gray-900">{formatPrice(shippingFee)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-3 border-t border-gray-200">
                  <span>Tổng cộng</span>
                  <span className="text-primary-600">{formatPrice(total)}</span>
                </div>
              </div>

              <div className="text-xs text-gray-400 space-y-1">
                <p>🔒 Thông tin của bạn được bảo mật</p>
                <p>🔄 Miễn phí đổi trả trong 30 ngày</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
