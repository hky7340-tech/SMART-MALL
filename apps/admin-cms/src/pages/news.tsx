import React from 'react';

export default function NewsPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div><h1 className="text-2xl font-bold">📰 Tin tức</h1><p className="text-sm text-gray-500 mt-1">Quản lý tin tức, bài viết</p></div>
            </div>
            <div className="card"><div className="card-body text-center py-16"><div className="text-6xl mb-4">📰</div><h3 className="text-lg font-medium mb-2">Tính năng đang phát triển</h3></div></div>
        </div>
    );
}