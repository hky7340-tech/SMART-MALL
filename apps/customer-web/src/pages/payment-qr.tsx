import React, { useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';

const formatPrice = (amount: number) => {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

const mockPaymentHistory = [
    { id: 'pm_1', store: 'Fashion Hub', amount: 299000, date: '2024-12-22 14:30', status: 'completed', method: 'QR' },
    { id: 'pm_2', store: 'Trà Sữa Đài Loan', amount: 49000, date: '2024-12-21 10:15', status: 'completed', method: 'QR' },
    { id: 'pm_3', store: 'TechZone', amount: 15999000, date: '2024-12-20 16:45', status: 'completed', method: 'VNPay' },
    { id: 'pm_4', store: 'Hải Sản Biển Đông', amount: 890000, date: '2024-12-19 19:00', status: 'completed', method: 'MoMo' },
    { id: 'pm_5', store: 'Galaxy Cinema', amount: 250000, date: '2024-12-18 14:30', status: 'pending', method: 'QR' },
];

const paymentMethods = [
    { id: 'vietqr', name: 'VietQR', icon: '🏦', description: 'Chuyển khoản ngân hàng' },
    { id: 'momo', name: 'MoMo', icon: '🟣', description: 'Ví điện tử MoMo' },
    { id: 'zalopay', name: 'ZaloPay', icon: '🔵', description: 'Ví điện tử ZaloPay' },
    { id: 'vnpay', name: 'VNPay', icon: '💳', description: 'Cổng thanh toán VNPay' },
    { id: 'wallet', name: 'Ví SM', icon: '💰', description: 'Số dư: 1.250.000₫' },
];

export default function PaymentQRPage() {
    const [activeTab, setActiveTab] = useState<'scan' | 'generate' | 'history'>('generate');
    const [amount, setAmount] = useState('');
    const [selectedMethod, setSelectedMethod] = useState('vietqr');
    const [note, setNote] = useState('');
    const [showQR, setShowQR] = useState(false);
    const [paymentResult, setPaymentResult] = useState<'pending' | 'success' | null>(null);

    const handleGenerateQR = () => {
        const amt = Number(amount);
        if (!amt || amt < 1000) {
            toast.error('Số tiền tối thiểu 1.000₫');
            return;
        }
        setShowQR(true);
        setPaymentResult(null);
    };

    const checkPayment = () => {
        // Simulate payment check
        setTimeout(() => {
            setPaymentResult('success');
            toast.success('Thanh toán thành công!');
        }, 3000);
        setPaymentResult('pending');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
                <div className="container-custom py-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold">📱 QR Thanh toán</h1>
                            <p className="text-white/80 mt-1">Thanh toán nhanh chóng qua mã QR</p>
                        </div>
                        <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2 text-center">
                            <p className="text-xs text-white/70">Số dư ví</p>
                            <p className="text-xl font-bold">1.250.000₫</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white shadow-sm">
                <div className="container-custom">
                    <div className="flex gap-0">
                        {[
                            { id: 'generate', label: '📤 Tạo mã QR' },
                            { id: 'scan', label: '📸 Quét QR thanh toán' },
                            { id: 'history', label: '📜 Lịch sử' },
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.id
                                    ? 'border-green-600 text-green-600'
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
                {activeTab === 'generate' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Left: Input Form */}
                        <div className="bg-white rounded-xl p-6 shadow-sm">
                            <h3 className="font-semibold text-gray-900 mb-6">Tạo mã QR thanh toán</h3>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Số tiền</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        placeholder="Nhập số tiền..."
                                        className="input-field text-2xl font-bold pr-12"
                                        disabled={showQR}
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">₫</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-4 gap-2 mb-6">
                                {[100000, 200000, 500000, 1000000].map(amt => (
                                    <button
                                        key={amt}
                                        onClick={() => { setAmount(amt.toString()); setShowQR(false); }}
                                        className="py-2 rounded-lg text-sm font-medium border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-colors"
                                        disabled={showQR}
                                    >
                                        {formatPrice(amt)}₫
                                    </button>
                                ))}
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Phương thức thanh toán</label>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {paymentMethods.map(method => (
                                        <button
                                            key={method.id}
                                            onClick={() => { setSelectedMethod(method.id); setShowQR(false); }}
                                            className={`p-4 rounded-xl border-2 text-center transition-all ${selectedMethod === method.id
                                                ? 'border-green-600 bg-green-50'
                                                : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                            disabled={showQR}
                                        >
                                            <div className="text-2xl mb-1">{method.icon}</div>
                                            <span className="text-sm font-medium">{method.name}</span>
                                            <p className="text-xs text-gray-500 mt-0.5">{method.description}</p>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nội dung chuyển khoản</label>
                                <input
                                    type="text"
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                    placeholder="Thanh toán đơn hàng..."
                                    className="input-field"
                                    disabled={showQR}
                                />
                            </div>

                            {!showQR ? (
                                <button onClick={handleGenerateQR} className="btn-primary w-full bg-green-600 hover:bg-green-700">
                                    📤 Tạo mã QR
                                </button>
                            ) : (
                                <div className="flex gap-3">
                                    <button onClick={() => { setShowQR(false); setPaymentResult(null); }} className="btn-outline flex-1">
                                        🔄 Sửa lại
                                    </button>
                                    <button onClick={checkPayment} className="btn-primary flex-1 bg-green-600 hover:bg-green-700">
                                        ✅ Đã thanh toán
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Right: QR Display */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-xl p-6 shadow-sm sticky top-24">
                                {!showQR ? (
                                    <div className="text-center py-12">
                                        <div className="w-32 h-32 mx-auto bg-gray-100 rounded-2xl flex items-center justify-center mb-6">
                                            <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                                            </svg>
                                        </div>
                                        <h3 className="font-semibold text-gray-900 mb-2">Nhập thông tin để tạo QR</h3>
                                        <p className="text-sm text-gray-500">Nhập số tiền và chọn phương thức thanh toán</p>
                                    </div>
                                ) : paymentResult === 'success' ? (
                                    <div className="text-center py-8">
                                        <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
                                            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <h3 className="text-xl font-semibold text-green-600 mb-2">Thanh toán thành công!</h3>
                                        <p className="text-2xl font-bold text-gray-900 mb-2">{formatPrice(Number(amount))}₫</p>
                                        <p className="text-sm text-gray-500 mb-6">Qua {paymentMethods.find(m => m.id === selectedMethod)?.name}</p>
                                        <button
                                            onClick={() => { setShowQR(false); setPaymentResult(null); setAmount(''); }}
                                            className="btn-primary bg-green-600 hover:bg-green-700"
                                        >
                                            🔄 Tạo QR mới
                                        </button>
                                    </div>
                                ) : paymentResult === 'pending' ? (
                                    <div className="text-center py-8">
                                        <div className="w-48 h-48 mx-auto bg-white border-2 border-gray-200 rounded-2xl p-4 mb-6 flex items-center justify-center animate-pulse">
                                            <div className="text-center">
                                                <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                                                <p className="text-green-600 font-medium">Đang chờ thanh toán...</p>
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-500">Vui lòng quét mã QR và thanh toán</p>
                                    </div>
                                ) : (
                                    <div className="text-center py-4">
                                        <h3 className="font-semibold text-gray-900 mb-4">Quét mã QR để thanh toán</h3>
                                        <div className="w-56 h-56 mx-auto bg-white border-2 border-gray-200 rounded-2xl p-4 mb-4 flex items-center justify-center">
                                            <div className="w-full h-full bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl flex items-center justify-center">
                                                <div className="text-center">
                                                    <div className="w-36 h-36 mx-auto relative">
                                                        <div className="grid grid-cols-6 gap-1">
                                                            {Array.from({ length: 36 }).map((_, i) => (
                                                                <div key={i} className={`w-4 h-4 rounded-sm ${Math.random() > 0.5 ? 'bg-gray-900' : 'bg-white'}`} />
                                                            ))}
                                                        </div>
                                                        <div className="absolute inset-0 flex items-center justify-center">
                                                            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                                                                <span className="text-green-600 font-bold text-xs">SM</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-2xl font-bold text-gray-900 mb-1">{formatPrice(Number(amount))}₫</p>
                                        <p className="text-sm text-gray-500 mb-3">Qua {paymentMethods.find(m => m.id === selectedMethod)?.name}</p>
                                        {note && <p className="text-xs text-gray-400 mb-4">Nội dung: {note}</p>}
                                        <div className="flex gap-2 justify-center">
                                            <button onClick={() => toast.success('Đã tải xuống mã QR')} className="btn-outline text-sm">
                                                📥 Tải QR
                                            </button>
                                            <button onClick={() => { navigator.clipboard?.writeText(note || ''); toast.success('Đã copy nội dung'); }} className="btn-outline text-sm">
                                                📋 Copy nội dung
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'scan' && (
                    <div className="max-w-lg mx-auto">
                        <div className="bg-white rounded-xl p-6 shadow-sm text-center">
                            <div className="w-32 h-32 mx-auto bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl flex items-center justify-center mb-6">
                                <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Quét mã QR cửa hàng</h3>
                            <p className="text-gray-600 mb-6">Đưa mã QR của cửa hàng vào khung hình để thanh toán</p>
                            <button
                                onClick={() => {
                                    toast.success('Mở camera để quét QR...');
                                }}
                                className="btn-primary bg-green-600 hover:bg-green-700 px-8 py-3 text-lg"
                            >
                                📸 Mở máy ảnh
                            </button>

                            <div className="mt-8 pt-6 border-t">
                                <p className="text-sm text-gray-500 mb-4">Các cửa hàng hỗ trợ QR Pay</p>
                                <div className="grid grid-cols-2 gap-3">
                                    {['Fashion Hub', 'TechZone', 'Trà Sữa', 'Hải Sản', 'Galaxy Cinema', 'Nhà Sách'].map(store => (
                                        <button key={store} className="p-3 border border-gray-200 rounded-xl hover:border-green-300 hover:bg-green-50 transition-colors text-sm font-medium">
                                            🏪 {store}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Supported Payment Methods */}
                        <div className="mt-6 bg-white rounded-xl p-6 shadow-sm">
                            <h3 className="font-semibold text-gray-900 mb-4">Chấp nhận thanh toán</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                {[
                                    { icon: '🏦', name: 'VietQR' },
                                    { icon: '🟣', name: 'MoMo' },
                                    { icon: '🔵', name: 'ZaloPay' },
                                    { icon: '💳', name: 'VNPay' },
                                ].map(method => (
                                    <div key={method.name} className="p-3 bg-gray-50 rounded-xl text-center">
                                        <div className="text-2xl mb-1">{method.icon}</div>
                                        <span className="text-xs font-medium">{method.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'history' && (
                    <div className="max-w-2xl mx-auto">
                        <div className="bg-white rounded-xl shadow-sm">
                            <div className="p-6 border-b">
                                <h3 className="font-semibold text-gray-900">Lịch sử thanh toán</h3>
                            </div>
                            <div className="divide-y">
                                {mockPaymentHistory.map(item => (
                                    <div key={item.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-lg">
                                                🏪
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900 text-sm">{item.store}</p>
                                                <p className="text-xs text-gray-500">{item.date} • {item.method}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold text-red-600">-{formatPrice(item.amount)}₫</p>
                                            <span className={`text-xs px-2 py-0.5 rounded-full ${item.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                {item.status === 'completed' ? 'Hoàn thành' : 'Đang xử lý'}
                                            </span>
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