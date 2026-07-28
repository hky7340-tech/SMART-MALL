import React from 'react';
import toast from 'react-hot-toast';

const mediaItems = [
    { id: 1, name: 'hero-banner.jpg', type: 'image', size: '2.4 MB', dimensions: '1920x600', uploaded: '2 ngày trước', url: '#' },
    { id: 2, name: 'product-1.jpg', type: 'image', size: '856 KB', dimensions: '800x800', uploaded: '5 ngày trước', url: '#' },
    { id: 3, name: 'promo-video.mp4', type: 'video', size: '45 MB', dimensions: '1920x1080', uploaded: '1 tuần trước', url: '#' },
    { id: 4, name: 'logo-sm.png', type: 'image', size: '124 KB', dimensions: '512x512', uploaded: '2 tuần trước', url: '#' },
    { id: 5, name: 'banner-summer.jpg', type: 'image', size: '3.1 MB', dimensions: '1920x600', uploaded: '3 ngày trước', url: '#' },
    { id: 6, name: 'event-poster.pdf', type: 'document', size: '2.8 MB', dimensions: 'A4', uploaded: '1 ngày trước', url: '#' },
];

export default function MediaPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div><h1 className="text-2xl font-bold text-gray-900">📸 Media</h1><p className="text-sm text-gray-500 mt-1">Quản lý hình ảnh, video, tài liệu</p></div>
                <button onClick={() => toast.success('Upload file')} className="btn-primary">📤 Upload</button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="stat-card"><p className="text-sm text-gray-500">Tổng file</p><p className="text-2xl font-bold">{mediaItems.length}</p></div>
                <div className="stat-card stat-card-blue"><p className="text-sm text-gray-500">Hình ảnh</p><p className="text-2xl font-bold text-blue-600">{mediaItems.filter(m => m.type === 'image').length}</p></div>
                <div className="stat-card stat-card-purple"><p className="text-sm text-gray-500">Video</p><p className="text-2xl font-bold text-purple-600">{mediaItems.filter(m => m.type === 'video').length}</p></div>
                <div className="stat-card stat-card-green"><p className="text-sm text-gray-500">Dung lượng</p><p className="text-2xl font-bold text-green-600">54.3 MB</p></div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {mediaItems.map(m => (
                    <div key={m.id} className="card overflow-hidden group cursor-pointer" onClick={() => toast.success('Xem chi tiết file')}>
                        <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-4xl">
                            {m.type === 'image' ? '🖼️' : m.type === 'video' ? '🎬' : '📄'}
                        </div>
                        <div className="p-3">
                            <p className="text-sm font-medium text-gray-900 truncate">{m.name}</p>
                            <p className="text-xs text-gray-500">{m.size} • {m.dimensions}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}