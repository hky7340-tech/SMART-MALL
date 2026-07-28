import React, { useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';

const formatPrice = (amount: number) => {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

const mockWalletData = {
    balance: 1250000,
    points: 8500,
    currency: 'VND',
    holdAmount: 150000,
    monthlySpend: 3200000,
    monthlyBudget: 5000000,
    depositMethods: [
        { id: 'qr', name: 'QR Code', icon: '📲' },
        { id: 'bank', name: 'Chuyển khoản', icon: '🏦' },
        { id: 'vnpay', name: 'VNPay', icon: '💳' },
        { id: 'momo', name: 'MoMo', icon: '🟣' },
        { id: 'zalopay', name: 'ZaloPay', icon: '🔵' },
    ],
};

const mockTransactions = [
    { id: 'tx1', type: 'payment', amount: -299000, description: 'Thanh toán đơn hàng #DH001', date: '2024-12-22 14:30', status: 'completed', category: 'shopping' },
    { id: 'tx2', type: 'deposit', amount: 500000, description: 'Nạp tiền qua QR', date: '2024-12-21 10:15', status: 'completed', category: 'deposit' },
    { id: 'tx3', type: 'refund', amount: 150000, description: 'Hoàn tiền đơn #DH002', date: '2024-12-20 16:45', status: 'completed', category: 'refund' },
    { id: 'tx4', type: 'transfer', amount: -200000, description: 'Chuyển đến Nguyễn Văn A', date: '2024-12-19 09:00', status: 'completed', category: 'transfer' },
    { id: 'tx5', type: 'withdraw', amount: -1000000, description: 'Rút về Vietcombank **1234', date: '2024-12-18 11:30', status: 'completed', category: 'withdraw' },
    { id: 'tx6', type: 'payment', amount: -45000, description: 'Thanh toán tại Trà Sữa Đài Loan', date: '2024-12-17 19:20', status: 'completed', category: 'food' },
    { id: 'tx7', type: 'deposit', amount: 1000000, description: 'Nạp tiền qua MoMo', date: '2024-12-15 08:00', status: 'completed', category: 'deposit' },
    { id: 'tx8', type: 'transfer', amount: 50000, description: 'Nhận từ Trần Thị B', date: '2024-12-14 15:10', status: 'completed', category: 'transfer' },
    { id: 'tx9', type: 'withdraw', amount: -500000, description: 'Yêu cầu rút tiền - Đang xử lý', date: '2024-12-23 08:00', status: 'pending', category: 'withdraw' },
];

export default function WalletPage() {
    const [activeTab, setActiveTab] = useState<'overview' | 'deposit' | 'withdraw' | 'transfer' | 'history'>('overview');
    const [depositAmount, setDepositAmount] = useState('');
    const [selectedMethod, setSelectedMethod] = useState('qr');
    const [withdrawAmount, setWithdrawAmount] = useState('');
    const [withdrawBank, setWithdrawBank] = useState('vietcombank');
    const [withdrawAccountNumber, setWithdrawAccountNumber] = useState('');
    const [withdrawAccountName, setWithdrawAccountName] = useState('');
    const [transferPhone, setTransferPhone] = useState('');
    const [transferAmount, setTransferAmount] = useState('');
    const [transferNote, setTransferNote] = useState('');

    const totalIn = mockTransactions.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0);
    const totalOut = mockTransactions.filter(t => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);

    const handleDeposit = () => {
        const amount = Number(depositAmount);
        if (!amount || amount < 10000) {
            toast.error('Số tiền nạp tối thiểu 10.000₫');
            return;
        }
        toast.success(`Đã tạo yêu cầu nạp ${formatPrice(amount)}₫ qua ${selectedMethod.toUpperCase()}`);
    };

    const handleWithdraw = () => {
        const amount = Number(withdrawAmount);
        if (!amount || amount < 50000) {
            toast.error('Số tiền rút tối thiểu 50.000₫');
            return;
        }
        if (amount > mockWalletData.balance) {
            toast.error('Số dư không đủ');
            return;
        }
        if (!withdrawAccountNumber || !withdrawAccountName) {
            toast.error('Vui lòng nhập thông tin tài khoản ngân hàng');
            return;
        }
        toast.success(`Yêu cầu rút ${formatPrice(amount)}₫ đã được ghi nhận`);
    };

    const handleTransfer = () => {
        const amount = Number(transferAmount);
        if (!transferPhone || transferPhone.length < 10) {
            toast.error('Vui lòng nhập số điện thoại hợp lệ');
            return;
        }
        if (!amount || amount < 10000) {
            toast.error('Số tiền chuyển tối thiểu 10.000₫');
            return;
        }
        if (amount > mockWalletData.balance) {
            toast.error('Số dư không đủ');
            return;
        }
        toast.success(`Đã chuyển ${formatPrice(amount)}₫ đến ${transferPhone}`);
    };

    const getTransactionIcon = (category: string) => {
        const icons: Record<string, string> = {
            shopping: '🛍️',
            deposit: '💰',
            refund: '🔄',
            transfer: '📤',
            withdraw: '🏦',
            food: '🍜',
        };
        return icons[category] || '💳';
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
                <div className="container-custom py-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold">💰 Ví điện tử</h1>
                            <p className="text-white/80 mt-1">Quản lý tài chính thông minh</p>
                        </div>
                        <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2 text-center">
                            <p className="text-xs text-white/70">Số dư khả dụng</p>
                            <p className="text-2xl font-bold">{formatPrice(mockWalletData.balance)}₫</p>
                        </div>
                    </div>
                    <div className="flex gap-6 mt-4">
                        <div className="flex items-center gap-2 bg-white/10 rounded-lg px-4 py-2">
                            <span>⭐ Điểm thưởng</span>
                            <span className="font-bold">{formatPrice(mockWalletData.points)}</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white/10 rounded-lg px-4 py-2">
                            <span>⏳ Đang giữ</span>
                            <span className="font-bold">{formatPrice(mockWalletData.holdAmount)}₫</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white shadow-sm">
                <div className="container-custom">
                    <div className="flex gap-0">
                        {[
                            { id: 'overview', label: '📊 Tổng quan' },
                            { id: 'deposit', label: '📥 Nạp tiền' },
                            { id: 'withdraw', label: '📤 Rút tiền' },
                            { id: 'transfer', label: '💸 Chuyển tiền' },
                            { id: 'history', label: '📜 Lịch sử' },
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.id
                                    ? 'border-emerald-600 text-emerald-600'
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
                {activeTab === 'overview' && (
                    <div className="space-y-6">
                        {/* Balance Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="bg-white rounded-xl p-6 shadow-sm">
                                <p className="text-sm text-gray-600">Số dư khả dụng</p>
                                <p className="text-2xl font-bold text-emerald-600">{formatPrice(mockWalletData.balance)}₫</p>
                            </div>
                            <div className="bg-white rounded-xl p-6 shadow-sm">
                                <p className="text-sm text-gray-600">Đang giữ</p>
                                <p className="text-2xl font-bold text-orange-600">{formatPrice(mockWalletData.holdAmount)}₫</p>
                            </div>
                            <div className="bg-white rounded-xl p-6 shadow-sm">
                                <p className="text-sm text-gray-600">Tổng thu</p>
                                <p className="text-2xl font-bold text-green-600">+{formatPrice(totalIn)}₫</p>
                            </div>
                            <div className="bg-white rounded-xl p-6 shadow-sm">
                                <p className="text-sm text-gray-600">Tổng chi</p>
                                <p className="text-2xl font-bold text-red-600">-{formatPrice(totalOut)}₫</p>
                            </div>
                        </div>

                        {/* Monthly Budget */}
                        <div className="bg-white rounded-xl p-6 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold text-gray-900">Ngân sách tháng này</h3>
                                <span className="text-sm text-gray-500">{formatPrice(mockWalletData.monthlySpend)}₫ / {formatPrice(mockWalletData.monthlyBudget)}₫</span>
                            </div>
                            <div className="bg-gray-100 rounded-full h-3">
                                <div
                                    className="bg-emerald-600 h-3 rounded-full transition-all"
                                    style={{ width: `${(mockWalletData.monthlySpend / mockWalletData.monthlyBudget) * 100}%` }}
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-2">Còn {formatPrice(mockWalletData.monthlyBudget - mockWalletData.monthlySpend)}₫ có thể chi tiêu</p>
                        </div>

                        {/* Recent Transactions */}
                        <div className="bg-white rounded-xl shadow-sm">
                            <div className="p-6 border-b flex items-center justify-between">
                                <h3 className="font-semibold text-gray-900">Giao dịch gần đây</h3>
                                <button onClick={() => setActiveTab('history')} className="text-sm text-emerald-600 hover:underline">
                                    Xem tất cả →
                                </button>
                            </div>
                            <div className="divide-y">
                                {mockTransactions.slice(0, 5).map(tx => (
                                    <div key={tx.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-lg">
                                                {getTransactionIcon(tx.category)}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900 text-sm">{tx.description}</p>
                                                <p className="text-xs text-gray-500">{tx.date}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className={`font-semibold ${tx.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                {tx.amount > 0 ? '+' : ''}{formatPrice(tx.amount)}₫
                                            </p>
                                            <span className={`text-xs px-2 py-0.5 rounded-full ${tx.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                {tx.status === 'completed' ? 'Hoàn thành' : 'Đang xử lý'}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'deposit' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white rounded-xl p-6 shadow-sm">
                            <h3 className="font-semibold text-gray-900 mb-4">Nạp tiền</h3>
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Số tiền nạp</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={depositAmount}
                                        onChange={(e) => setDepositAmount(e.target.value)}
                                        placeholder="Nhập số tiền..."
                                        className="input-field text-2xl font-bold pr-12"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">₫</span>
                                </div>
                            </div>
                            <div className="grid grid-cols-4 gap-3 mb-6">
                                {[100000, 200000, 500000, 1000000].map(amount => (
                                    <button
                                        key={amount}
                                        onClick={() => setDepositAmount(amount.toString())}
                                        className="py-2 rounded-lg text-sm font-medium border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 transition-colors"
                                    >
                                        {formatPrice(amount)}₫
                                    </button>
                                ))}
                            </div>
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Phương thức nạp</label>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {mockWalletData.depositMethods.map(method => (
                                        <button
                                            key={method.id}
                                            onClick={() => setSelectedMethod(method.id)}
                                            className={`p-4 rounded-xl border-2 text-center transition-all ${selectedMethod === method.id
                                                ? 'border-emerald-600 bg-emerald-50'
                                                : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                        >
                                            <div className="text-2xl mb-1">{method.icon}</div>
                                            <span className="text-sm font-medium">{method.name}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <button onClick={handleDeposit} className="btn-primary w-full bg-emerald-600 hover:bg-emerald-700">
                                📥 Nạp {depositAmount ? formatPrice(Number(depositAmount)) : ''}₫
                            </button>
                        </div>
                        <div className="bg-white rounded-xl p-6 shadow-sm">
                            <h3 className="font-semibold text-gray-900 mb-4">Hướng dẫn nạp tiền</h3>
                            <div className="space-y-4 text-sm text-gray-600">
                                <div className="flex gap-3">
                                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold flex-shrink-0">1</div>
                                    <p>Chọn số tiền bạn muốn nạp vào ví</p>
                                </div>
                                <div className="flex gap-3">
                                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold flex-shrink-0">2</div>
                                    <p>Chọn phương thức thanh toán phù hợp</p>
                                </div>
                                <div className="flex gap-3">
                                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold flex-shrink-0">3</div>
                                    <p>Quét mã QR hoặc chuyển khoản theo hướng dẫn</p>
                                </div>
                                <div className="flex gap-3">
                                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold flex-shrink-0">4</div>
                                    <p>Tiền sẽ được cộng vào ví sau khi giao dịch xác nhận</p>
                                </div>
                            </div>
                            <div className="mt-6 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                                <p className="text-sm font-medium text-yellow-800">⚡ Nạp ngay để nhận ưu đãi</p>
                                <p className="text-xs text-yellow-700 mt-1">Nạp từ 500.000₫ nhận ngay 10.000₫ vào ví</p>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'withdraw' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white rounded-xl p-6 shadow-sm">
                            <h3 className="font-semibold text-gray-900 mb-4">Rút tiền về ngân hàng</h3>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Số dư khả dụng</label>
                                <p className="text-2xl font-bold text-emerald-600">{formatPrice(mockWalletData.balance)}₫</p>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Số tiền rút</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={withdrawAmount}
                                        onChange={(e) => setWithdrawAmount(e.target.value)}
                                        placeholder="Nhập số tiền..."
                                        className="input-field text-xl font-bold pr-12"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">₫</span>
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-2 mb-4">
                                {[500000, 1000000, 2000000].map(amount => (
                                    <button key={amount} onClick={() => setWithdrawAmount(amount.toString())} className="py-2 rounded-lg text-sm border border-gray-200 hover:border-emerald-300 transition-colors">
                                        {formatPrice(amount)}₫
                                    </button>
                                ))}
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Ngân hàng</label>
                                <select value={withdrawBank} onChange={(e) => setWithdrawBank(e.target.value)} className="input-field">
                                    <option value="vietcombank">Vietcombank</option>
                                    <option value="techcombank">Techcombank</option>
                                    <option value="acb">ACB</option>
                                    <option value="bidv">BIDV</option>
                                    <option value="vpbank">VPBank</option>
                                    <option value="mbbank">MB Bank</option>
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Số tài khoản</label>
                                <input type="text" value={withdrawAccountNumber} onChange={(e) => setWithdrawAccountNumber(e.target.value)} placeholder="Nhập số tài khoản" className="input-field" />
                            </div>
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Chủ tài khoản</label>
                                <input type="text" value={withdrawAccountName} onChange={(e) => setWithdrawAccountName(e.target.value)} placeholder="Nhập tên chủ tài khoản" className="input-field" />
                            </div>
                            <button onClick={handleWithdraw} className="btn-primary w-full bg-emerald-600 hover:bg-emerald-700">
                                📤 Rút tiền
                            </button>
                            <p className="text-xs text-gray-500 mt-2 text-center">Phí rút: 5.500₫ / giao dịch</p>
                        </div>
                        <div className="bg-white rounded-xl p-6 shadow-sm">
                            <h3 className="font-semibold text-gray-900 mb-4">Thông tin rút tiền</h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                                    <span className="text-gray-600">Số tiền rút</span>
                                    <span className="font-semibold">{withdrawAmount ? formatPrice(Number(withdrawAmount)) : '0'}₫</span>
                                </div>
                                <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                                    <span className="text-gray-600">Phí giao dịch</span>
                                    <span className="font-semibold">5.500₫</span>
                                </div>
                                <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                                    <span className="text-gray-600">Thời gian xử lý</span>
                                    <span className="font-semibold">1-3 ngày làm việc</span>
                                </div>
                                <div className="flex justify-between p-3 bg-emerald-50 rounded-lg">
                                    <span className="text-gray-700 font-medium">Tổng nhận</span>
                                    <span className="font-bold text-emerald-600">{withdrawAmount ? formatPrice(Number(withdrawAmount) - 5500) : '0'}₫</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'transfer' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white rounded-xl p-6 shadow-sm">
                            <h3 className="font-semibold text-gray-900 mb-4">Chuyển tiền</h3>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại người nhận</label>
                                <input type="tel" value={transferPhone} onChange={(e) => setTransferPhone(e.target.value)} placeholder="Nhập số điện thoại..." className="input-field" />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Số tiền</label>
                                <div className="relative">
                                    <input type="number" value={transferAmount} onChange={(e) => setTransferAmount(e.target.value)} placeholder="Nhập số tiền..." className="input-field text-xl font-bold pr-12" />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">₫</span>
                                </div>
                            </div>
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Lời nhắn</label>
                                <input type="text" value={transferNote} onChange={(e) => setTransferNote(e.target.value)} placeholder="Cảm ơn bạn!" className="input-field" />
                            </div>
                            <button onClick={handleTransfer} className="btn-primary w-full bg-emerald-600 hover:bg-emerald-700">
                                💸 Chuyển tiền
                            </button>
                            <p className="text-xs text-gray-500 mt-2 text-center">Miễn phí chuyển tiền trong hệ thống</p>
                        </div>
                        <div className="bg-white rounded-xl p-6 shadow-sm">
                            <h3 className="font-semibold text-gray-900 mb-4">Giao dịch gần đây</h3>
                            <div className="space-y-3">
                                {mockTransactions.filter(t => t.category === 'transfer').map(tx => (
                                    <div key={tx.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div>
                                            <p className="text-sm font-medium">{tx.description}</p>
                                            <p className="text-xs text-gray-500">{tx.date}</p>
                                        </div>
                                        <span className={`font-semibold ${tx.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            {tx.amount > 0 ? '+' : ''}{formatPrice(tx.amount)}₫
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'history' && (
                    <div className="bg-white rounded-xl shadow-sm">
                        <div className="p-6 border-b">
                            <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-gray-900">Lịch sử giao dịch</h3>
                                <button className="text-sm text-emerald-600 hover:underline">📥 Xuất Excel</button>
                            </div>
                            <div className="flex gap-2 mt-3">
                                {['Tất cả', 'Nạp tiền', 'Thanh toán', 'Rút tiền', 'Chuyển tiền', 'Hoàn tiền'].map(filter => (
                                    <button key={filter} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${filter === 'Tất cả' ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                                        {filter}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="divide-y">
                            {mockTransactions.map(tx => (
                                <div key={tx.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-lg">
                                            {getTransactionIcon(tx.category)}
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900 text-sm">{tx.description}</p>
                                            <p className="text-xs text-gray-500">{tx.date}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className={`font-semibold ${tx.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            {tx.amount > 0 ? '+' : ''}{formatPrice(tx.amount)}₫
                                        </p>
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${tx.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                            {tx.status === 'completed' ? 'Hoàn thành' : 'Đang xử lý'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}