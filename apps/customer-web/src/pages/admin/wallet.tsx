import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { formatNumber, formatFullPrice } from '@/utils/format';

interface WalletTxn {
    id: number;
    user: string;
    type: 'deposit' | 'withdraw' | 'payment' | 'refund' | 'transfer';
    amount: number;
    balance: number;
    desc: string;
    time: string;
    status: 'completed' | 'pending' | 'failed';
}
const mockTxns: WalletTxn[] = [
    { id: 1, user: 'Nguyễn Văn A', type: 'deposit', amount: 2000000, balance: 5000000, desc: 'Nạp qua VNPay', time: '5 phút trước', status: 'completed' },
    { id: 2, user: 'Trần Thị B', type: 'payment', amount: -299000, balance: 1200000, desc: 'Thanh toán đơn DH001', time: '15 phút trước', status: 'completed' },
    { id: 3, user: 'Lê Văn C', type: 'deposit', amount: 500000, balance: 3500000, desc: 'Nạp qua MoMo', time: '30 phút trước', status: 'completed' },
    { id: 4, user: 'Phạm Thị D', type: 'withdraw', amount: -1000000, balance: 2000000, desc: 'Rút về tài khoản NH', time: '1 giờ trước', status: 'pending' },
    { id: 5, user: 'Hoàng Văn E', type: 'refund', amount: 250000, balance: 890000, desc: 'Hoàn tiền đơn DH005', time: '2 giờ trước', status: 'completed' },
];

const typeLabels: Record<string, string> = { deposit: 'Nạp tiền', withdraw: 'Rút tiền', payment: 'Thanh toán', refund: 'Hoàn tiền', transfer: 'Chuyển tiền' };
const typeColors: Record<string, string> = { deposit: 'badge-success', withdraw: 'badge-danger', payment: 'badge-info', refund: 'badge-warning', transfer: 'badge-purple' };

export default function WalletPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div><h1 className="text-2xl font-bold text-gray-900">💰 Ví điện tử</h1><p className="text-sm text-gray-500 mt-1">Quản lý ví điện tử, giao dịch</p></div>
                <button onClick={() => toast.success('Xuất báo cáo ví')} className="btn-secondary">📥 Xuất báo cáo</button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="stat-card stat-card-blue"><p className="text-sm text-gray-500">Tổng số dư ví</p><p className="text-2xl font-bold text-blue-600">{formatFullPrice(125000000)}</p></div>
                <div className="stat-card stat-card-green"><p className="text-sm text-gray-500">Nạp hôm nay</p><p className="text-2xl font-bold text-green-600">{formatFullPrice(2500000)}</p></div>
                <div className="stat-card stat-card-red"><p className="text-sm text-gray-500">Rút hôm nay</p><p className="text-2xl font-bold text-red-600">{formatFullPrice(1000000)}</p></div>
                <div className="stat-card stat-card-purple"><p className="text-sm text-gray-500">Ví đang hoạt động</p><p className="text-2xl font-bold text-purple-600">2,450</p></div>
            </div>
            <div className="card overflow-hidden">
                <div className="table-container">
                    <table>
                        <thead><tr><th>Người dùng</th><th>Loại</th><th className="text-right">Số tiền</th><th className="text-right">Số dư</th><th>Mô tả</th><th>Trạng thái</th><th>Thời gian</th></tr></thead>
                        <tbody>
                            {mockTxns.map(t => (
                                <tr key={t.id}>
                                    <td className="text-sm font-medium">{t.user}</td>
                                    <td><span className={`badge ${typeColors[t.type]}`}>{typeLabels[t.type]}</span></td>
                                    <td className={`text-right font-semibold ${t.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>{t.amount > 0 ? '+' : ''}{formatFullPrice(Math.abs(t.amount))}</td>
                                    <td className="text-right font-medium">{formatFullPrice(t.balance)}</td>
                                    <td className="text-sm text-gray-600">{t.desc}</td>
                                    <td><span className={`badge ${t.status === 'completed' ? 'badge-success' : t.status === 'pending' ? 'badge-warning' : 'badge-danger'}`}>{t.status}</span></td>
                                    <td className="text-xs text-gray-500">{t.time}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}