import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';

const formatPrice = (amount: number) => {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

const mockCheckinHistory = [
    { id: 'ci_1', store: 'Fashion Hub', date: '2024-12-22 14:30', points: 50, type: 'store' },
    { id: 'ci_2', store: 'Sự kiện: Live Music Night', date: '2024-12-21 19:00', points: 100, type: 'event' },
    { id: 'ci_3', store: 'Trà Sữa Đài Loan', date: '2024-12-20 10:15', points: 50, type: 'store' },
    { id: 'ci_4', store: 'Parking B1', date: '2024-12-19 09:00', points: 20, type: 'parking' },
    { id: 'ci_5', store: 'TechZone', date: '2024-12-18 16:45', points: 50, type: 'store' },
];

const mockLoyaltyCheckins = [
    { day: 1, checked: true, bonus: 10 },
    { day: 2, checked: true, bonus: 10 },
    { day: 3, checked: true, bonus: 10 },
    { day: 4, checked: true, bonus: 20 },
    { day: 5, checked: true, bonus: 20 },
    { day: 6, checked: false, bonus: 20 },
    { day: 7, checked: false, bonus: 50 },
];

export default function CheckinPage() {
    const [activeTab, setActiveTab] = useState<'scan' | 'my-qr' | 'history' | 'loyalty'>('scan');
    const [scanning, setScanning] = useState(false);
    const [scannedCode, setScannedCode] = useState('');
    const [scanResult, setScanResult] = useState<{ type: string; name: string; points: number } | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [showScanner, setShowScanner] = useState(false);

    const handleScan = () => {
        setShowScanner(true);
        setScanning(true);
        // Simulate scan after 2 seconds
        setTimeout(() => {
            setScanning(false);
            setScannedCode('QR-2024-12-23-001');
            setScanResult({ type: 'store', name: 'Fashion Hub', points: 50 });
            toast.success('Check-in thành công! Nhận 50 điểm thưởng');
        }, 2000);
    };

    const handleManualInput = () => {
        if (!scannedCode.trim()) {
            toast.error('Vui lòng nhập mã QR');
            return;
        }
        setScanResult({ type: 'store', name: 'Cửa hàng', points: 50 });
        toast.success('Check-in thành công!');
    };

    const resetScan = () => {
        setScannedCode('');
        setScanResult(null);
        setShowScanner(false);
    };

    const currentStreak = mockLoyaltyCheckins.filter(c => c.checked).length;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                <div className="container-custom py-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold">📷 QR Check-in</h1>
                            <p className="text-white/80 mt-1">Check-in nhận điểm thưởng mỗi ngày</p>
                        </div>
                        <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2 text-center">
                            <p className="text-xs text-white/70">Điểm đã nhận</p>
                            <p className="text-xl font-bold">{formatPrice(mockCheckinHistory.length * 50)}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white shadow-sm">
                <div className="container-custom">
                    <div className="flex gap-0">
                        {[
                            { id: 'scan', label: '📸 Quét QR' },
                            { id: 'my-qr', label: '🔳 QR của tôi' },
                            { id: 'loyalty', label: '📅 Điểm danh' },
                            { id: 'history', label: '📜 Lịch sử' },
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.id
                                    ? 'border-blue-600 text-blue-600'
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
                {activeTab === 'scan' && (
                    <div className="max-w-lg mx-auto">
                        <div className="bg-white rounded-xl p-6 shadow-sm text-center">
                            {!showScanner ? (
                                <div>
                                    <div className="w-32 h-32 mx-auto bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center mb-6">
                                        <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Quét mã QR</h3>
                                    <p className="text-gray-600 mb-6">Đưa mã QR vào khung hình để check-in</p>
                                    <button onClick={handleScan} className="btn-primary bg-blue-600 hover:bg-blue-700 px-8 py-3 text-lg">
                                        📸 Mở máy ảnh
                                    </button>
                                </div>
                            ) : scanning ? (
                                <div>
                                    <div className="w-48 h-48 mx-auto border-2 border-dashed border-blue-400 rounded-2xl flex items-center justify-center mb-6 bg-blue-50 animate-pulse">
                                        <div className="text-center">
                                            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                                            <p className="text-blue-600 font-medium">Đang quét...</p>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-500">Giữ yên điện thoại để quét mã QR</p>
                                </div>
                            ) : scanResult ? (
                                <div>
                                    <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
                                        <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-semibold text-green-600 mb-2">Check-in thành công!</h3>
                                    <p className="text-gray-600 mb-2">Tại: <strong>{scanResult.name}</strong></p>
                                    <p className="text-lg font-bold text-blue-600 mb-6">+{scanResult.points} điểm thưởng</p>
                                    <button onClick={resetScan} className="btn-primary bg-blue-600 hover:bg-blue-700">
                                        🔄 Quét tiếp
                                    </button>
                                </div>
                            ) : null}

                            {/* Manual Input */}
                            <div className="mt-8 pt-6 border-t">
                                <p className="text-sm text-gray-500 mb-3">Hoặc nhập mã QR thủ công</p>
                                <div className="flex gap-3">
                                    <input
                                        type="text"
                                        value={scannedCode}
                                        onChange={(e) => setScannedCode(e.target.value)}
                                        placeholder="Nhập mã QR..."
                                        className="input-field flex-1"
                                    />
                                    <button onClick={handleManualInput} className="btn-outline whitespace-nowrap">
                                        Xác nhận
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Check-in Types */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                            {[
                                { icon: '🏪', label: 'Cửa hàng', points: '50 điểm', color: 'from-blue-500 to-blue-600' },
                                { icon: '🎪', label: 'Sự kiện', points: '100 điểm', color: 'from-purple-500 to-purple-600' },
                                { icon: '🅿️', label: 'Bãi xe', points: '20 điểm', color: 'from-green-500 to-green-600' },
                                { icon: '🎯', label: 'Điểm danh', points: '10-50 điểm', color: 'from-orange-500 to-orange-600' },
                            ].map(item => (
                                <div key={item.label} className="bg-white rounded-xl p-4 shadow-sm text-center">
                                    <div className={`w-12 h-12 mx-auto bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center text-2xl mb-2`}>
                                        {item.icon}
                                    </div>
                                    <p className="text-sm font-medium text-gray-900">{item.label}</p>
                                    <p className="text-xs text-blue-600 font-semibold">{item.points}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'my-qr' && (
                    <div className="max-w-md mx-auto">
                        <div className="bg-white rounded-xl p-8 shadow-sm text-center">
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">QR Cá nhân</h3>
                            <p className="text-gray-600 mb-6">Đưa mã QR này cho nhân viên quét để tích điểm</p>

                            {/* QR Code Display */}
                            <div className="w-56 h-56 mx-auto bg-white border-2 border-gray-200 rounded-2xl p-4 mb-6 flex items-center justify-center">
                                <div className="w-full h-full bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="w-32 h-32 mx-auto relative">
                                            {/* Simulated QR Code */}
                                            <div className="grid grid-cols-5 gap-1">
                                                {Array.from({ length: 25 }).map((_, i) => (
                                                    <div key={i} className={`w-5 h-5 rounded-sm ${Math.random() > 0.5 ? 'bg-gray-900' : 'bg-white'}`} />
                                                ))}
                                            </div>
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                                                    <span className="text-blue-600 font-bold text-xs">SM</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <p className="text-sm text-gray-500 mb-4">Mã thành viên: <strong className="text-gray-900">SM-2024-001234</strong></p>

                            <div className="flex gap-3 justify-center">
                                <button onClick={() => { navigator.clipboard?.writeText('SM-2024-001234'); toast.success('Đã copy mã thành viên'); }} className="btn-outline text-sm">
                                    📋 Copy mã
                                </button>
                                <button onClick={() => toast.success('Đã tải xuống QR')} className="btn-outline text-sm">
                                    📥 Tải QR
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'loyalty' && (
                    <div className="max-w-lg mx-auto">
                        {/* Streak Info */}
                        <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h3 className="font-semibold text-gray-900">🔥 Điểm danh hàng ngày</h3>
                                    <p className="text-sm text-gray-500">Check-in liên tiếp để nhận thưởng</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-3xl font-bold text-orange-500">{currentStreak}</p>
                                    <p className="text-xs text-gray-500">ngày liên tiếp</p>
                                </div>
                            </div>

                            {/* Calendar */}
                            <div className="grid grid-cols-7 gap-2">
                                {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map(day => (
                                    <div key={day} className="text-center text-xs text-gray-500 font-medium py-1">{day}</div>
                                ))}
                                {mockLoyaltyCheckins.map((item, index) => (
                                    <div key={index} className="text-center">
                                        <div className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center text-sm font-medium ${item.checked
                                                ? 'bg-blue-600 text-white'
                                                : index === currentStreak
                                                    ? 'bg-blue-100 text-blue-600 border-2 border-blue-300'
                                                    : 'bg-gray-100 text-gray-400'
                                            }`}>
                                            {item.checked ? '✓' : item.day}
                                        </div>
                                        <p className="text-xs text-gray-400 mt-1">+{item.bonus}</p>
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={() => {
                                    if (currentStreak < 7) {
                                        toast.success('Điểm danh thành công! Nhận 10 điểm thưởng');
                                    }
                                }}
                                disabled={currentStreak >= 7}
                                className="btn-primary w-full mt-6 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {currentStreak >= 7 ? '✅ Đã điểm danh hôm nay' : '📅 Điểm danh ngay'}
                            </button>
                        </div>

                        {/* Milestone Rewards */}
                        <div className="bg-white rounded-xl p-6 shadow-sm">
                            <h3 className="font-semibold text-gray-900 mb-4">🎁 Phần thưởng mốc</h3>
                            <div className="space-y-3">
                                {[
                                    { days: 3, reward: '10.000₫ voucher', achieved: true },
                                    { days: 7, reward: '50.000₫ voucher', achieved: true },
                                    { days: 14, reward: '100.000₫ voucher', achieved: false },
                                    { days: 30, reward: '300.000₫ voucher', achieved: false },
                                    { days: 60, reward: '500.000₫ voucher', achieved: false },
                                ].map(milestone => (
                                    <div key={milestone.days} className={`flex items-center justify-between p-3 rounded-lg ${milestone.achieved ? 'bg-green-50' : 'bg-gray-50'
                                        }`}>
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${milestone.achieved ? 'bg-green-200 text-green-700' : 'bg-gray-200 text-gray-500'
                                                }`}>
                                                {milestone.achieved ? '✓' : milestone.days}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium">{milestone.days} ngày liên tiếp</p>
                                                <p className="text-xs text-gray-500">{milestone.reward}</p>
                                            </div>
                                        </div>
                                        {milestone.achieved && (
                                            <span className="text-xs text-green-600 font-medium">Đã nhận</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'history' && (
                    <div className="max-w-lg mx-auto">
                        <div className="bg-white rounded-xl shadow-sm">
                            <div className="p-6 border-b">
                                <h3 className="font-semibold text-gray-900">Lịch sử Check-in</h3>
                            </div>
                            <div className="divide-y">
                                {mockCheckinHistory.map(item => (
                                    <div key={item.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${item.type === 'store' ? 'bg-blue-100' :
                                                    item.type === 'event' ? 'bg-purple-100' : 'bg-green-100'
                                                }`}>
                                                {item.type === 'store' ? '🏪' : item.type === 'event' ? '🎪' : '🅿️'}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900 text-sm">{item.store}</p>
                                                <p className="text-xs text-gray-500">{item.date}</p>
                                            </div>
                                        </div>
                                        <span className="text-sm font-semibold text-blue-600">+{item.points}</span>
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