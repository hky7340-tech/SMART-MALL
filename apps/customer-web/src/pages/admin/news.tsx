import React, { useState } from 'react';
import toast from 'react-hot-toast';

interface NewsItem { id: number; title: string; excerpt: string; category: string; author: string; date: string; status: 'published' | 'draft'; views: number; }
const mockNews: NewsItem[] = [
    { id: 1, title: 'Khai trương khu ẩm thực tầng 2', excerpt: 'Khu ẩm thực mới với hơn 20 quầy...', category: 'Tin tức', author: 'Admin', date: '2024-07-25', status: 'published', views: 1250 },
    { id: 2, title: 'Chương trình khuyến mãi tháng 8', excerpt: 'Giảm giá lên đến 50% cho...', category: 'Khuyến mãi', author: 'Admin', date: '2024-07-24', status: 'published', views: 890 },
    { id: 3, title: 'Hướng dẫn mua sắm online', excerpt: 'Các bước mua sắm trực tuyến...', category: 'Hướng dẫn', author: 'Admin', date: '2024-07-23', status: 'draft', views: 0 },
];

export default function NewsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const filtered = mockNews.filter(n => n.title.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div><h1 className="text-2xl font-bold text-gray-900">📰 Tin tức</h1><p className="text-sm text-gray-500 mt-1">Quản lý tin tức, blog, SEO</p></div>
                <button onClick={() => toast.success('Tạo bài viết mới')} className="btn-primary">+ Bài viết mới</button>
            </div>
            <div className="card"><div className="card-body">
                <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Tìm kiếm bài viết..." className="input-field" />
            </div></div>
            <div className="space-y-3">
                {filtered.map(item => (
                    <div key={item.id} className="card p-5">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="badge badge-info">{item.category}</span>
                                    <span className={`badge ${item.status === 'published' ? 'badge-success' : 'badge-neutral'}`}>{item.status === 'published' ? 'Đã xuất bản' : 'Bản nháp'}</span>
                                </div>
                                <h3 className="font-semibold text-gray-900">{item.title}</h3>
                                <p className="text-sm text-gray-500 mt-1">{item.excerpt}</p>
                                <p className="text-xs text-gray-400 mt-2">{item.author} • {item.date} • {item.views} lượt xem</p>
                            </div>
                            <div className="flex gap-1 ml-4">
                                <button onClick={() => toast.success('Chỉnh sửa bài viết')} className="btn-ghost btn-xs">✏️</button>
                                <button onClick={() => toast.success(item.status === 'published' ? 'Đã gỡ xuống' : 'Đã xuất bản')} className="btn-ghost btn-xs">{item.status === 'published' ? '📤' : '📥'}</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}