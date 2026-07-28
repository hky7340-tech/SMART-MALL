import React, { useState } from 'react';
import Link from 'next/link';

interface LoyaltyTier {
  name: string;
  nameVi: string;
  icon: string;
  color: string;
  minPoints: number;
  discount: number;
  multiplier: number;
  benefits: string[];
  bgColor: string;
  textColor: string;
}

const tiers: LoyaltyTier[] = [
  {
    name: 'Silver',
    nameVi: 'Bạc',
    icon: '🥈',
    color: 'from-gray-300 to-gray-400',
    minPoints: 0,
    discount: 0,
    multiplier: 1,
    benefits: ['Tích điểm 1x', 'Voucher chào mừng', 'Ưu đãi sinh nhật'],
    bgColor: 'bg-gray-50',
    textColor: 'text-gray-700',
  },
  {
    name: 'Gold',
    nameVi: 'Vàng',
    icon: '🥇',
    color: 'from-yellow-400 to-yellow-600',
    minPoints: 1000,
    discount: 5,
    multiplier: 1.5,
    benefits: ['Giảm 5%', 'Tích điểm 1.5x', 'Voucher sinh nhật', 'Miễn phí giao hàng', 'Hỗ trợ ưu tiên'],
    bgColor: 'bg-gradient-to-br from-yellow-50 to-yellow-100',
    textColor: 'text-yellow-800',
  },
  {
    name: 'Platinum',
    nameVi: 'Bạch kim',
    icon: '💎',
    color: 'from-cyan-400 to-blue-600',
    minPoints: 5000,
    discount: 10,
    multiplier: 2,
    benefits: ['Giảm 10%', 'Tích điểm 2x', 'Quà sinh nhật', 'Miễn phí giao hàng', 'Ưu tiên hỗ trợ 24/7', 'Sự kiện đặc biệt'],
    bgColor: 'bg-gradient-to-br from-cyan-50 to-blue-100',
    textColor: 'text-blue-800',
  },
  {
    name: 'Diamond',
    nameVi: 'Kim cương',
    icon: '💠',
    color: 'from-blue-400 to-purple-600',
    minPoints: 15000,
    discount: 15,
    multiplier: 3,
    benefits: ['Giảm 15%', 'Tích điểm 3x', 'Quà sinh nhật cao cấp', 'Miễn phí giao hàng', 'VIP hỗ trợ 24/7', 'Sự kiện riêng', 'Quà tặng lễ'],
    bgColor: 'bg-gradient-to-br from-blue-50 to-purple-100',
    textColor: 'text-purple-800',
  },
  {
    name: 'VIP',
    nameVi: 'VIP',
    icon: '👑',
    color: 'from-purple-500 to-pink-600',
    minPoints: 50000,
    discount: 20,
    multiplier: 5,
    benefits: ['Giảm 20%', 'Tích điểm 5x', 'Quà sinh nhật VIP', 'Miễn phí giao hàng', 'VIP hỗ trợ 24/7', 'Sự kiện VIP', 'Quà tặng lễ cao cấp', 'Parking miễn phí'],
    bgColor: 'bg-gradient-to-br from-purple-50 to-pink-100',
    textColor: 'text-pink-800',
  },
];

const recentActivities = [
  { action: 'Mua sắm tại Fashion Hub', points: 150, date: '2024-01-15', type: 'earned' },
  { action: 'Đổi voucher giảm giá 50K', points: -500, date: '2024-01-12', type: 'redeemed' },
  { action: 'Check-in hàng ngày', points: 10, date: '2024-01-11', type: 'earned' },
  { action: 'Đánh giá sản phẩm', points: 50, date: '2024-01-10', type: 'earned' },
  { action: 'Giới thiệu bạn bè', points: 200, date: '2024-01-08', type: 'earned' },
  { action: 'Sinh nhật tháng 1', points: 500, date: '2024-01-05', type: 'bonus' },
];

export default function LoyaltyPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'benefits'>('overview');
  const currentPoints = 2450;
  const currentTier = 'Gold';
  const nextTier = 'Platinum';
  const nextTierPoints = 5000;
  const progress = (currentPoints / nextTierPoints) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 via-purple-600 to-primary-800 text-white py-16">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-20 h-20 bg-white/20 backdrop-blur rounded-3xl flex items-center justify-center text-4xl">
                {tiers.find(t => t.name === currentTier)?.icon}
              </div>
              <div>
                <h1 className="text-3xl font-bold">Chương Trình Thành Viên</h1>
                <p className="text-white/80">Smart Mall Loyalty Program</p>
              </div>
            </div>

            {/* Points Card */}
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <p className="text-white/70 text-sm mb-1">Hạng thành viên</p>
                  <div className="flex items-center gap-2">
                    <span className="text-3xl">{tiers.find(t => t.name === currentTier)?.icon}</span>
                    <span className="text-2xl font-bold">{currentTier}</span>
                  </div>
                </div>
                <div>
                  <p className="text-white/70 text-sm mb-1">Điểm thưởng</p>
                  <p className="text-3xl font-bold">{currentPoints.toLocaleString()}</p>
                  <p className="text-white/60 text-sm">~ {Math.round(currentPoints / 10).toLocaleString()}đ đã chi</p>
                </div>
                <div>
                  <p className="text-white/70 text-sm mb-1">Điểm đến hạng {nextTier}</p>
                  <p className="text-2xl font-bold">{nextTierPoints.toLocaleString()}</p>
                  <div className="mt-2 bg-white/20 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-white rounded-full h-full transition-all duration-1000"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-white/60 text-xs mt-1">Còn {nextTierPoints - currentPoints} điểm nữa</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="py-8 bg-white border-b">
        <div className="container-custom">
          <div className="flex gap-4 max-w-4xl mx-auto">
            {[
              { key: 'overview', label: 'Tổng quan', icon: '📊' },
              { key: 'history', label: 'Lịch sử', icon: '📜' },
              { key: 'benefits', label: 'Quyền lợi', icon: '🎁' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                  activeTab === tab.key
                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="container-custom max-w-4xl mx-auto">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Tier Cards */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Các Hạng Thành Viên</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {tiers.map((tier) => (
                    <div
                      key={tier.name}
                      className={`rounded-2xl p-6 border-2 transition-all ${
                        tier.name === currentTier
                          ? 'border-primary-500 shadow-xl shadow-primary-100 scale-105'
                          : 'border-gray-200 hover:shadow-lg'
                      } ${tier.bgColor}`}
                    >
                      <div className="text-4xl mb-3">{tier.icon}</div>
                      <h3 className={`font-bold text-lg ${tier.textColor}`}>
                        {tier.name}
                        {tier.name === currentTier && (
                          <span className="ml-2 text-xs bg-primary-600 text-white px-2 py-0.5 rounded-full">
                            Hiện tại
                          </span>
                        )}
                      </h3>
                      <p className="text-sm text-gray-500 mb-3">{tier.minPoints.toLocaleString()} điểm</p>
                      <ul className="space-y-1.5">
                        {tier.benefits.map((b, i) => (
                          <li key={i} className="text-xs text-gray-600 flex items-center gap-1.5">
                            <span className="text-green-500">✓</span> {b}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Daily Quests */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Nhiệm Vụ Nhận Điểm</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { name: 'Check-in hàng ngày', points: 10, progress: 1, total: 1, icon: '📅' },
                    { name: 'Mua sắm tại cửa hàng', points: 100, progress: 2, total: 3, icon: '🛍️' },
                    { name: 'Đánh giá sản phẩm', points: 50, progress: 1, total: 2, icon: '⭐' },
                    { name: 'Chia sẻ lên mạng xã hội', points: 30, progress: 0, total: 1, icon: '📱' },
                  ].map((quest) => (
                    <div key={quest.name} className="card p-5">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{quest.icon}</span>
                          <div>
                            <h4 className="font-semibold text-gray-900">{quest.name}</h4>
                            <p className="text-xs text-primary-600 font-medium">+{quest.points} điểm</p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gray-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-primary-600 rounded-full h-full transition-all"
                          style={{ width: `${(quest.progress / quest.total) * 100}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{quest.progress}/{quest.total}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Lịch Sử Điểm Thưởng</h2>
              <div className="card overflow-hidden">
                <div className="divide-y">
                  {recentActivities.map((activity, index) => (
                    <div key={index} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${
                            activity.type === 'earned'
                              ? 'bg-green-100'
                              : activity.type === 'redeemed'
                              ? 'bg-red-100'
                              : 'bg-yellow-100'
                          }`}
                        >
                          {activity.type === 'earned' ? '💰' : activity.type === 'redeemed' ? '🎫' : '🎁'}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{activity.action}</p>
                          <p className="text-xs text-gray-500">{activity.date}</p>
                        </div>
                      </div>
                      <span
                        className={`font-bold text-lg ${
                          activity.points > 0 ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {activity.points > 0 ? '+' : ''}{activity.points.toLocaleString()} điểm
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'benefits' && (
            <div className="space-y-8">
              <h2 className="text-2xl font-bold text-gray-900">Quyền Lợi Thành Viên</h2>
              
              {/* Current Benefits */}
              <div className="card p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  🎯 Quyền lợi hiện tại của bạn
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { icon: '💰', title: 'Giảm 5%', desc: 'Cho tất cả đơn hàng' },
                    { icon: '⭐', title: 'Tích điểm 1.5x', desc: 'Nhân điểm thưởng' },
                    { icon: '🚚', title: 'Free Ship', desc: 'Đơn từ 200K' },
                    { icon: '🎂', title: 'Quà sinh nhật', desc: 'Voucher 100K' },
                    { icon: '💬', title: 'Hỗ trợ ưu tiên', desc: '24/7' },
                    { icon: '🎪', title: 'Sự kiện đặc biệt', desc: 'Mời tham dự' },
                  ].map((benefit) => (
                    <div key={benefit.title} className="p-4 bg-gray-50 rounded-xl">
                      <span className="text-2xl block mb-2">{benefit.icon}</span>
                      <h4 className="font-semibold text-gray-900">{benefit.title}</h4>
                      <p className="text-sm text-gray-500">{benefit.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Next Tier Benefits */}
              <div className="card p-8 border-2 border-primary-200 bg-gradient-to-br from-primary-50 to-white">
                <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                  🔜 Quyền lợi hạng tiếp theo: {nextTier}
                </h3>
                <p className="text-gray-500 mb-6">Chỉ còn {nextTierPoints - currentPoints} điểm nữa</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { icon: '💰', title: 'Giảm 10%', desc: 'Cho tất cả đơn hàng' },
                    { icon: '⭐', title: 'Tích điểm 2x', desc: 'Nhân đôi điểm thưởng' },
                    { icon: '🎁', title: 'Quà tặng đặc biệt', desc: 'Quà sinh nhật + lễ' },
                    { icon: '💎', title: 'Ưu tiên đặc biệt', desc: 'Hỗ trợ VIP 24/7' },
                    { icon: '🎫', title: 'Voucher độc quyền', desc: 'Nhận hàng tháng' },
                    { icon: '🎪', title: 'Sự kiện riêng', desc: 'Chỉ dành cho Platinum' },
                  ].map((benefit) => (
                    <div key={benefit.title} className="p-4 bg-white rounded-xl border border-primary-100">
                      <span className="text-2xl block mb-2">{benefit.icon}</span>
                      <h4 className="font-semibold text-gray-900">{benefit.title}</h4>
                      <p className="text-sm text-gray-500">{benefit.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

