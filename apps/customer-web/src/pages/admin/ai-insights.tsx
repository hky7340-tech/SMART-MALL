import React from 'react';
import toast from 'react-hot-toast';
import { formatFullPrice } from '@/utils/format';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const predictions = [
    { month: 'T7', predicted: 13200000000, actual: 0 },
    { month: 'T8', predicted: 14000000000, actual: 0 },
    { month: 'T9', predicted: 12800000000, actual: 0 },
    { month: 'T10', predicted: 14500000000, actual: 0 },
    { month: 'T11', predicted: 15200000000, actual: 0 },
    { month: 'T12', predicted: 16800000000, actual: 0 },
];

export default function AiInsightsPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div><h1 className="text-2xl font-bold text-gray-900">🤖 AI Insights</h1><p className="text-sm text-gray-500 mt-1">Phân tích thông minh, dự đoán</p></div>
                <button onClick={() => toast.success('Tạo báo cáo AI')} className="btn-primary">📊 Tạo báo cáo</button>
            </div>

            <div className="bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 rounded-xl p-6 text-white">
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-white/15 rounded-xl flex items-center justify-center text-2xl">🤖</div>
                    <div className="flex-1">
                        <h3 className="font-semibold mb-2">Tổng quan AI</h3>
                        <p className="text-white/80 text-sm leading-relaxed">
                            Dựa trên dữ liệu 6 tháng đầu năm, AI dự đoán doanh thu quý III sẽ đạt <strong className="text-white">40 tỷ đồng</strong>,
                            tăng <strong className="text-white">15.3%</strong> so với quý II. Ngành hàng <strong className="text-white">Điện tử</strong> được dự báo
                            sẽ tiếp tục dẫn đầu với mức tăng trưởng <strong className="text-white">22%</strong>.
                        </p>
                        <div className="flex flex-wrap gap-2 mt-3">
                            <span className="text-xs bg-white/15 px-2.5 py-1 rounded-full">📈 Dự báo doanh thu</span>
                            <span className="text-xs bg-white/15 px-2.5 py-1 rounded-full">🏆 Điện tử dẫn đầu</span>
                            <span className="text-xs bg-white/15 px-2.5 py-1 rounded-full">💡 Đề xuất: Tăng quảng cáo Thời trang</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card">
                <div className="card-header"><h3 className="font-semibold text-gray-900">Dự báo doanh thu 6 tháng cuối năm</h3></div>
                <div className="card-body">
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={predictions}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                                <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `${(v / 1000000000).toFixed(1)}B`} />
                                <Tooltip formatter={(value: any) => formatFullPrice(Number(value))} />
                                <Bar dataKey="predicted" name="Dự báo" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                    { icon: '📈', title: 'Dự báo doanh thu', desc: 'Doanh thu tháng 7 dự kiến đạt 13.2 tỷ', color: 'bg-purple-50 text-purple-600' },
                    { icon: '👥', title: 'Dự báo khách hàng', desc: 'Lượng KH mới tháng 7 dự kiến tăng 12%', color: 'bg-blue-50 text-blue-600' },
                    { icon: '📦', title: 'Hàng tồn kho', desc: '5 sản phẩm sắp hết hàng cần nhập thêm', color: 'bg-orange-50 text-orange-600' },
                ].map(item => (
                    <div key={item.title} className="card p-5">
                        <div className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center text-lg mb-3`}>{item.icon}</div>
                        <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                        <p className="text-sm text-gray-500">{item.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}