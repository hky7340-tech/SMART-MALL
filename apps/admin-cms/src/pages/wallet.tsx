import React from 'react';

export default function WalletPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div><h1 className="text-2xl font-bold">💰 Ví điện tử</h1><p className="text-sm text-gray-500 mt-1">Quản lý ví điện tử, giao dịch</p></div>
            </div>
            <div className="card">
                <div className="card-body text-center py-16">
                    <div className="text-6xl mb-4">💰</div>
                    <h3 className="text-lg font-medium mb-2">Tính năng đang phát triển</h3>
                    <p className="text-sm text-gray-500">Sẽ sớm được cập nhật</p>
                </div>
            </div>
        </div>
    );
}