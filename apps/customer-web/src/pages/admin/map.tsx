import React from 'react';
import toast from 'react-hot-toast';

const floors = [
    { floor: 1, name: 'Thời trang & Ẩm thực', stores: 12, landmarks: ['Fashion Hub', 'Tiệm Bánh Sweet Home'], color: 'bg-blue-100 border-blue-300' },
    { floor: 2, name: 'Sách & Đồ chơi', stores: 8, landmarks: ['Nhà Sách Minh Khai', 'Thế Giới Đồ Chơi', 'Trà Sữa Đài Loan'], color: 'bg-green-100 border-green-300' },
    { floor: 3, name: 'Điện tử & Công nghệ', stores: 6, landmarks: ['TechZone'], color: 'bg-purple-100 border-purple-300' },
    { floor: 4, name: 'Nhà hàng & Spa', stores: 10, landmarks: ['Hải Sản Biển Đông', 'Spa & Beauty'], color: 'bg-orange-100 border-orange-300' },
    { floor: 5, name: 'Giải trí & Rạp phim', stores: 5, landmarks: ['Galaxy Cinema', 'Game Center'], color: 'bg-pink-100 border-pink-300' },
];

export default function MapPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div><h1 className="text-2xl font-bold text-gray-900">🗺️ Bản đồ</h1><p className="text-sm text-gray-500 mt-1">Bản đồ trung tâm thương mại</p></div>
                <button onClick={() => toast.success('Chỉnh sửa bản đồ')} className="btn-primary">✏️ Chỉnh sửa</button>
            </div>
            <div className="space-y-4">
                {floors.map(f => (
                    <div key={f.floor} className={`card p-5 border-2 ${f.color}`}>
                        <div className="flex items-center justify-between mb-3">
                            <div>
                                <h3 className="font-semibold text-gray-900">Tầng {f.floor} - {f.name}</h3>
                                <p className="text-sm text-gray-500">{f.stores} cửa hàng</p>
                            </div>
                            <span className="text-lg font-bold text-gray-400">T{f.floor}</span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            {f.landmarks.map(l => (
                                <div key={l} className="bg-white rounded-lg p-2 text-sm text-center border border-gray-200 hover:shadow-sm cursor-pointer" onClick={() => toast.success(`Đi đến ${l}`)}>
                                    🏪 {l}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}