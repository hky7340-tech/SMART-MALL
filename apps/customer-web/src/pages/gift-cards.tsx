import React, { useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';

const formatPrice = (amount: number) => {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

const giftCardDesigns = [
    { id: 'gc_1', name: 'Thiệp Hoa Hồng', image: 'https://picsum.photos/seed/gc1/400/300', color: 'from-pink-500 to-rose-600', theme: 'romantic' },
    { id: 'gc_2', name: 'Phong Cách Hiện Đại', image: 'https://picsum.photos/seed/gc2/400/300', color: 'from-blue-500 to-indigo-600', theme: 'modern' },
    { id: 'gc_3', name: 'Tết Sum Vầy', image: 'https://picsum.photos/seed/gc3/400/300', color: 'from-red-600 to-yellow-500', theme: 'festive' },
    { id: 'gc_4', name: 'Thiên Nhiên Xanh', image: 'https://picsum.photos/seed/gc4/400/300', color: 'from-green-500 to-emerald-600', theme: 'nature' },
    { id: 'gc_5', name: 'Sang Trọng Đen Vàng', image: 'https://picsum.photos/seed/gc5/400/300', color: 'from-gray-900 to-yellow-600', theme: 'luxury' },
    { id: 'gc_6', name: 'Dễ Thương', image: 'https://picsum.photos/seed/gc6/400/300', color: 'from-purple-500 to-pink-500', theme: 'cute' },
];

const fixedAmounts = [100000, 200000, 500000, 1000000, 2000000, 5000000];

const mockMyGiftCards = [
    { id: 'mygc_1', code: 'GC-2024-001', balance: 500000, initialBalance: 1000000, status: 'active', expiresAt: '2025-06-30', design: 'modern' },
    { id: 'mygc_2', code: 'GC-2024-002', balance: 200000, initialBalance: 500000, status: 'active', expiresAt: '2025-03-15', design: 'romantic' },
    { id: 'mygc_3', code: 'GC-2024-003', balance: 0, initialBalance: 300000, status: 'used', expiresAt: '2024-10-01', design: 'festive' },
];

const mockHistory = [
    { id: 'h1', type: 'received', amount: 500000, from: 'Nguyễn Văn A', date: '2024-12-20', code: 'GC-2024-001' },
    { id: 'h2', type: 'sent', amount: 300000, to: 'Trần Thị B', date: '2024-12-15', code: 'GC-2024-004' },
    { id: 'h3', type: 'used', amount: 150000, store: 'Fashion Hub', date: '2024-12-10', code: 'GC-2024-001' },
    { id: 'h4', type: 'purchased', amount: 1000000, date: '2024-12-01', code: 'GC-2024-001' },
];

export default function GiftCardsPage() {
    const [activeTab, setActiveTab] = useState<'buy' | 'my-cards' | 'history'>('buy');
    const [selectedDesign, setSelectedDesign] = useState(giftCardDesigns[0].id);
    const [amount, setAmount] = useState(500000);
    const [customAmount, setCustomAmount] = useState('');
    const [recipientName, setRecipientName] = useState('');
    const [recipientEmail, setRecipientEmail] = useState('');
    const [senderName, setSenderName] = useState('Bạn của bạn');
    const [message, setMessage] = useState('Chúc bạn mua sắm vui vẻ! 🎉');
    const [sendMethod, setSendMethod] = useState<'email' | 'zalo' | 'sms' | 'link'>('email');

    const totalBalance = mockMyGiftCards
        .filter(c => c.status === 'active')
        .reduce((sum, c) => sum + c.balance, 0);

    const handleBuy = () => {
        toast.success(`Mua Gift Card ${formatPrice(amount)}₫ thành công!`);
    };

    const handleSend = () => {
        if (!recipientName || (!recipientEmail && sendMethod === 'email')) {
            toast.error('Vui lòng nhập thông tin người nhận');
            return;
        }
        toast.success(`Đã tặng Gift Card ${formatPrice(amount)}₫ đến ${recipientName}!`);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-600 to-purple-600 text-white">
                <div className="container-custom py-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold">🎁 Gift Card</h1>
                            <p className="text-white/80 mt-1">Mua và tặng quà cho người thân, bạn bè</p>
                        </div>
                        <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2 text-center">
                            <p className="text-xs text-white/70">Số dư Gift Card</p>
                            <p className="text-xl font-bold">{formatPrice(totalBalance)}₫</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white shadow-sm">
                <div className="container-custom">
                    <div className="flex gap-0">
                        {[
                            { id: 'buy', label: '🛒 Mua Gift Card' },
                            { id: 'my-cards', label: '💳 Gift Card của tôi' },
                            { id: 'history', label: '📜 Lịch sử' },
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.id
                                        ? 'border-primary-600 text-primary-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="container-custom py-6">
                {activeTab === 'buy' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Design Selection */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Step 1: Choose Design */}
                            <div className="bg-white rounded-xl p-6 shadow-sm">
                                <h3 className="font-semibold text-gray-900 mb-4">1. Chọn mẫu thiệp</h3>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                    {giftCardDesigns.map(design => (
                                        <button
                                            key={design.id}
                                            onClick={() => setSelectedDesign(design.id)}
                                            className={`relative rounded-xl overflow-hidden border-2 transition-all ${selectedDesign === design.id ? 'border-primary-600 ring-2 ring-primary-200' : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                        >
                                            <div className={`h-24 bg-gradient-to-br ${design.color} flex items-center justify-center`}>
                                                <span className="text-white font-bold text-lg">Gift</span>
                                            </div>
                                            <div className="p-2 text-center">
                                                <span className="text-xs font-medium">{design.name}</span>
                                            </div>
                                            {selectedDesign === design.id && (
                                                <div className="absolute top-2 right-2 w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center">
                                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Step 2: Choose Amount */}
                            <div className="bg-white rounded-xl p-6 shadow-sm">
                                <h3 className="font-semibold text-gray-900 mb-4">2. Chọn mệnh giá</h3>
                                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-4">
                                    {fixedAmounts.map(fixedAmount => (
                                        <button
                                            key={fixedAmount}
                                            onClick={() => { setAmount(fixedAmount); setCustomAmount(''); }}
                                            className={`py-3 rounded-xl text-sm font-semibold border-2 transition-all ${amount === fixedAmount && !customAmount
                                                    ? 'border-primary-600 bg-primary-50 text-primary-600'
                                                    : 'border-gray-200 text-gray-700 hover:border-gray-300'
                                                }`}
                                        >
                                            {formatPrice(fixedAmount)}₫
                                        </button>
                                    ))}
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-sm text-gray-600">Hoặc nhập số tiền:</span>
                                    <div className="relative flex-1 max-w-xs">
                                        <input
                                            type="number"
                                            value={customAmount}
                                            onChange={(e) => { setCustomAmount(e.target.value); setAmount(Number(e.target.value) || 0); }}
                                            placeholder="Nhập số tiền..."
                                            className="input-field pr-12"
                                        />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">₫</span>
                                    </div>
                                </div>
                            </div>

                            {/* Step 3: Recipient Info */}
                            <div className="bg-white rounded-xl p-6 shadow-sm">
                                <h3 className="font-semibold text-gray-900 mb-4">3. Thông tin người nhận</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Tên người nhận *</label>
                                        <input type="text" value={recipientName} onChange={(e) => setRecipientName(e.target.value)} placeholder="Nhập tên..." className="input-field" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Tên người gửi</label>
                                        <input type="text" value={senderName} onChange={(e) => setSenderName(e.target.value)} className="input-field" />
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Phương thức gửi</label>
                                    <div className="flex gap-3">
                                        {[
                                            { id: 'email', label: '📧 Email' },
                                            { id: 'zalo', label: '💬 Zalo' },
                                            { id: 'sms', label: '📱 SMS' },
                                            { id: 'link', label: '🔗 Link' },
                                        ].map(method => (
                                            <button
                                                key={method.id}
                                                onClick={() => setSendMethod(method.id as typeof sendMethod)}
                                                className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${sendMethod === method.id
                                                        ? 'border-primary-600 bg-primary-50 text-primary-600'
                                                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                                                    }`}
                                            >
                                                {method.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {sendMethod === 'email' && (
                                    <div className="mt-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Email người nhận *</label>
                                        <input type="email" value={recipientEmail} onChange={(e) => setRecipientEmail(e.target.value)} placeholder="example@email.com" className="input-field" />
                                    </div>
                                )}

                                <div className="mt-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Lời chúc</label>
                                    <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={3} className="input-field resize-none" placeholder="Viết lời chúc của bạn..." />
                                </div>
                            </div>
                        </div>

                        {/* Preview & Checkout */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-xl p-6 shadow-sm sticky top-24">
                                <h3 className="font-semibold text-gray-900 mb-4">Xem trước</h3>

                                {/* Card Preview */}
                                <div className={`h-48 rounded-xl bg-gradient-to-br ${giftCardDesigns.find(d => d.id === selectedDesign)?.color} p-6 flex flex-col justify-between mb-6`}>
                                    <div className="flex justify-between items-start">
                                        <span className="text-white/80 text-sm">Gift Card</span>
                                        <span className="text-white font-bold">SMART MALL</span>
                                    </div>
                                    <div>
                                        <p className="text-3xl font-bold text-white">{formatPrice(amount)}₫</p>
                                        <p className="text-white/80 text-sm mt-1">{message}</p>
                                    </div>
                                </div>

                                <div className="space-y-3 text-sm mb-6">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Mệnh giá</span>
                                        <span className="font-semibold">{formatPrice(amount)}₫</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Người nhận</span>
                                        <span className="font-semibold">{recipientName || '—'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Người gửi</span>
                                        <span className="font-semibold">{senderName}</span>
                                    </div>
                                    <div className="border-t pt-3">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Tổng thanh toán</span>
                                            <span className="text-xl font-bold text-primary-600">{formatPrice(amount)}₫</span>
                                        </div>
                                    </div>
                                </div>

                                <button onClick={handleBuy} className="btn-primary w-full mb-3">
                                    🛒 Mua ngay
                                </button>
                                <button onClick={handleSend} className="btn-outline w-full">
                                    🎁 Tặng ngay
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'my-cards' && (
                    <div className="space-y-6">
                        {/* Balance Summary */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="bg-white rounded-xl p-6 shadow-sm">
                                <p className="text-sm text-gray-600">Tổng số dư</p>
                                <p className="text-2xl font-bold text-primary-600">{formatPrice(totalBalance)}₫</p>
                            </div>
                            <div className="bg-white rounded-xl p-6 shadow-sm">
                                <p className="text-sm text-gray-600">Thẻ đang hoạt động</p>
                                <p className="text-2xl font-bold text-green-600">{mockMyGiftCards.filter(c => c.status === 'active').length}</p>
                            </div>
                            <div className="bg-white rounded-xl p-6 shadow-sm">
                                <p className="text-sm text-gray-600">Đã sử dụng</p>
                                <p className="text-2xl font-bold text-gray-600">{mockMyGiftCards.filter(c => c.status === 'used').length}</p>
                            </div>
                        </div>

                        {/* Card List */}
                        {mockMyGiftCards.map(card => (
                            <div key={card.id} className="bg-white rounded-xl p-6 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-semibold text-gray-900">{card.code}</p>
                                        <p className="text-sm text-gray-500">HSD: {card.expiresAt}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xl font-bold text-primary-600">{formatPrice(card.balance)}₫</p>
                                        <p className="text-xs text-gray-400">/ {formatPrice(card.initialBalance)}₫</p>
                                    </div>
                                </div>
                                <div className="mt-3 bg-gray-100 rounded-full h-2">
                                    <div
                                        className="bg-primary-600 h-2 rounded-full transition-all"
                                        style={{ width: `${(card.balance / card.initialBalance) * 100}%` }}
                                    />
                                </div>
                                <div className="flex items-center justify-between mt-3">
                                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${card.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                                        }`}>
                                        {card.status === 'active' ? 'Đang hoạt động' : 'Đã sử dụng'}
                                    </span>
                                    {card.status === 'active' && (
                                        <button className="text-sm text-primary-600 hover:underline">Sử dụng ngay</button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'history' && (
                    <div className="bg-white rounded-xl shadow-sm">
                        <div className="p-6 border-b">
                            <h3 className="font-semibold text-gray-900">Lịch sử giao dịch Gift Card</h3>
                        </div>
                        <div className="divide-y">
                            {mockHistory.map(item => (
                                <div key={item.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${item.type === 'received' ? 'bg-green-100' :
                                                item.type === 'sent' ? 'bg-blue-100' :
                                                    item.type === 'used' ? 'bg-orange-100' : 'bg-purple-100'
                                            }`}>
                                            {item.type === 'received' ? '📥' : item.type === 'sent' ? '📤' : item.type === 'used' ? '🛍️' : '🎁'}
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900 text-sm">
                                                {item.type === 'received' && `Nhận từ ${item.from}`}
                                                {item.type === 'sent' && `Gửi đến ${item.to}`}
                                                {item.type === 'used' && `Thanh toán tại ${item.store}`}
                                                {item.type === 'purchased' && 'Mua Gift Card'}
                                            </p>
                                            <p className="text-xs text-gray-500">{item.date} • {item.code}</p>
                                        </div>
                                    </div>
                                    <span className={`font-semibold ${item.type === 'received' || item.type === 'purchased' ? 'text-green-600' : 'text-red-600'
                                        }`}>
                                        {item.type === 'received' || item.type === 'purchased' ? '+' : '-'}{formatPrice(item.amount)}₫
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}