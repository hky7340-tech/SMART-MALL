import React, { useState } from 'react';
import toast from 'react-hot-toast';

interface TrackedOrder {
    id: string;
    customer: string;
    store: string;
    total: number;
    status: 'pending' | 'confirmed' | 'packing' | 'shipping' | 'delivered' | 'cancelled';
    payment: 'cod' | 'banking' | 'wallet' | 'card';
    items: { name: string; qty: number; price: number; image: string }[];
    timeline: { status: string; time: string; desc: string; done: boolean }[];
}

const mockOrders: TrackedOrder[] = [
    {
        id: 'DH001', customer: 'Nguyễn Văn A', store: 'Fashion Hub', total: 299000, status: 'shipping', payment: 'banking',
        items: [{ name: 'Áo thun nam cao cấp', qty: 2, price: 299000, image: '👕' }],
        timeline: [
            { status: 'pending', time: '2024-07-27 09:15', desc: 'Đơn hàng đã được đặt', done: true },
            { status: 'confirmed', time: '2024-07-27 09:30', desc: 'Đơn hàng đã được xác nhận', done: true },
            { status: 'packing', time: '2024-07-27 10:00', desc: 'Đơn hàng đang được đóng gói', done: true },
            { status: 'shipping', time: '2024-07-27 14:00', desc: 'Đơn hàng đang được giao', done: true },
            { status: 'delivered', time: '', desc: 'Đơn hàng đã được giao thành công', done: false },
        ]
    },
    {
        id: 'DH002', customer: 'Trần Thị B', store: 'TechZone', total: 15999000, status: 'delivered', payment: 'card',
        items: [{ name: 'Điện thoại XYZ Pro', qty: 1, price: 15999000, image: '📱' }],
        timeline: [
            { status: 'pending', time: '2024-07-26 08:00', desc: 'Đơn hàng đã được đặt', done: true },
            { status: 'confirmed', time: '2024-07-26 08:30', desc: 'Đơn hàng đã được xác nhận', done: true },
            { status: 'packing', time: '2024-07-26 09:00', desc: 'Đơn hàng đang được đóng gói', done: true },
            { status: 'shipping', time: '2024-07-26 14:00', desc: 'Đơn hàng đang được giao', done: true },
            { status: 'delivered', time: '2024-07-27 10:00', desc: 'Đơn hàng đã được giao thành công', done: true },
        ]
    },
];

const statusLabels: Record<string, string> = {
    pending: 'Chờ xác nhận', confirmed: 'Đã xác nhận', packing: 'Đang đóng gói',
    shipping: 'Đang giao hàng', delivered: 'Đã giao thành công', cancelled: 'Đã hủy'
};
const statusIcons: Record<string, string> = {
    pending: '⏳', confirmed: '✅', packing: '📦', shipping: '🚚', delivered: '🎉', cancelled: '❌'
};

export default function TrackingPage() {
    const [orderId, setOrderId] = useState('');
    const [trackedOrder, setTrackedOrder] = useState<TrackedOrder | null>(null);
    const [searched, setSearched] = useState(false);

    const handleSearch = () => {
        if (!orderId.trim()) {
            toast.error('Vui lòng nhập mã đơn hàng');
            return;
        }
        const found = mockOrders.find(o => o.id.toLowerCase() === orderId.trim().toLowerCase());
        setTrackedOrder(found || null);
        setSearched(true);
        if (!found) {
            toast.error('Không tìm thấy đơn hàng');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
                <div className="container-custom py-10">
                    <h1 className="text-3xl font-bold">📦 Tra cứu đơn hàng</h1>
                    <p className="text-white/80 mt-2">Nhập mã đơn hàng để kiểm tra tình trạng</p>
                    <div className="flex gap-3 max-w-lg mt-6">
                        <input
                            type="text"
                            value={orderId}
                            onChange={e => setOrderId(e.target.value)}
                            placeholder="Nhập mã đơn hàng (VD: DH001)"
                            className="input-field flex-1 bg-white/10 border-white/20 text-white placeholder-white/50"
                            onKeyDown={e => e.key === 'Enter' && handleSearch()}
                        />
                        <button onClick={handleSearch} className="btn-primary bg-accent-500 hover:bg-accent-600 border-0">
                            🔍 Tra cứu
                        </button>
                    </div>
                </div>
            </div>

            <div className="container-custom py-8">
                {!searched && !trackedOrder && (
                    <div className="text-center py-20">
                        <div className="text-7xl mb-6">🔍</div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Nhập mã đơn hàng để tra cứu</h3>
                        <p className="text-gray-500">Ví dụ: DH001, DH002,...</p>
                    </div>
                )}

                {searched && !trackedOrder && (
                    <div className="text-center py-20">
                        <div className="text-7xl mb-6">😕</div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Không tìm thấy đơn hàng</h3>
                        <p className="text-gray-500">Vui lòng kiểm tra lại mã đơn hàng</p>
                    </div>
                )}

                {trackedOrder && (
                    <div className="max-w-3xl mx-auto space-y-6">
                        {/* Order Info */}
                        <div className="card p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">Đơn hàng #{trackedOrder.id}</h2>
                                    <p className="text-sm text-gray-500">{trackedOrder.store}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-lg font-bold text-primary-600">{trackedOrder.total.toLocaleString('vi-VN')}₫</p>
                                    <span className={`badge ${trackedOrder.status === 'delivered' ? 'badge-success' : trackedOrder.status === 'cancelled' ? 'badge-danger' : 'badge-info'}`}>
                                        {statusIcons[trackedOrder.status]} {statusLabels[trackedOrder.status]}
                                    </span>
                                </div>
                            </div>
                            <div className="border-t border-gray-100 pt-4">
                                <p className="text-sm text-gray-500">Phương thức thanh toán: {trackedOrder.payment === 'cod' ? 'COD' : trackedOrder.payment === 'banking' ? 'Chuyển khoản' : trackedOrder.payment === 'wallet' ? 'Ví điện tử' : 'Thẻ'}</p>
                            </div>
                        </div>

                        {/* Products */}
                        <div className="card p-6">
                            <h3 className="font-semibold text-gray-900 mb-4">Sản phẩm</h3>
                            <div className="space-y-3">
                                {trackedOrder.items.map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                                        <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-2xl shadow-sm">{item.image}</div>
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-900">{item.name}</p>
                                            <p className="text-sm text-gray-500">x{item.qty}</p>
                                        </div>
                                        <p className="font-semibold text-gray-900">{item.price.toLocaleString('vi-VN')}₫</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Timeline */}
                        <div className="card p-6">
                            <h3 className="font-semibold text-gray-900 mb-6">Lịch trình đơn hàng</h3>
                            <div className="relative">
                                {trackedOrder.timeline.map((step, idx) => (
                                    <div key={step.status} className="flex gap-4 pb-6 last:pb-0">
                                        <div className="flex flex-col items-center">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step.done ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'}`}>
                                                {step.done ? '✓' : idx + 1}
                                            </div>
                                            {idx < trackedOrder.timeline.length - 1 && (
                                                <div className={`w-0.5 flex-1 mt-1 ${step.done ? 'bg-green-500' : 'bg-gray-200'}`} />
                                            )}
                                        </div>
                                        <div className="flex-1 pb-4">
                                            <p className={`font-medium ${step.done ? 'text-gray-900' : 'text-gray-400'}`}>{step.desc}</p>
                                            <p className="text-sm text-gray-500 mt-0.5">{step.time || 'Đang cập nhật...'}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}