import React from 'react';
import toast from 'react-hot-toast';

const movies = [
    { id: 1, title: 'Kẻ Độc Hành', genre: 'Hành động', duration: '120 phút', showtimes: 6, ticketsSold: 2340, rating: 8.5, status: 'showing' },
    { id: 2, title: 'Vùng Đất Câm Lặng', genre: 'Kinh dị', duration: '105 phút', showtimes: 4, ticketsSold: 1890, rating: 7.8, status: 'showing' },
    { id: 3, title: 'Hoạt Hình Mùa Hè', genre: 'Hoạt hình', duration: '95 phút', showtimes: 5, ticketsSold: 3200, rating: 9.0, status: 'showing' },
    { id: 4, title: 'Tình Yêu Định Mệnh', genre: 'Tình cảm', duration: '110 phút', showtimes: 0, ticketsSold: 0, rating: 0, status: 'coming' },
];

export default function CinemaPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div><h1 className="text-2xl font-bold text-gray-900">🎬 Rạp phim</h1><p className="text-sm text-gray-500 mt-1">Quản lý phim, suất chiếu, vé</p></div>
                <button onClick={() => toast.success('Thêm phim mới')} className="btn-primary">+ Thêm phim</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {movies.map(m => (
                    <div key={m.id} className="card overflow-hidden">
                        <div className="aspect-[2/3] bg-gradient-to-br from-purple-100 to-blue-200 flex items-center justify-center text-5xl">🎬</div>
                        <div className="p-4">
                            <h3 className="font-semibold text-gray-900">{m.title}</h3>
                            <p className="text-xs text-gray-500">{m.genre} • {m.duration}</p>
                            <div className="flex items-center justify-between mt-2 text-sm">
                                <span className={`badge ${m.status === 'showing' ? 'badge-success' : 'badge-info'}`}>{m.status === 'showing' ? 'Đang chiếu' : 'Sắp chiếu'}</span>
                                <span className="font-semibold">{m.ticketsSold > 0 ? `🎫 ${m.ticketsSold}` : ''}</span>
                            </div>
                            <div className="flex gap-2 mt-3">
                                <button onClick={() => toast.success('Quản lý suất chiếu')} className="flex-1 btn-outline btn-sm">Suất chiếu</button>
                                <button onClick={() => toast.success('Chỉnh sửa')} className="flex-1 btn-ghost btn-sm">Sửa</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}