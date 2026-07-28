import React, { useState } from 'react';
import Link from 'next/link';

const rewards = [
  { id: 'r1', name: 'Voucher 50K', points: 500, image: '🎫', color: 'from-green-400 to-emerald-500' },
  { id: 'r2', name: 'Voucher 100K', points: 1000, image: '🎟️', color: 'from-blue-400 to-cyan-500' },
  { id: 'r3', name: 'Gift Card 200K', points: 2000, image: '💳', color: 'from-purple-400 to-pink-500' },
  { id: 'r4', name: 'Trà sữa miễn phí', points: 300, image: '🧋', color: 'from-yellow-400 to-orange-500' },
  { id: 'r5', name: 'Vé xem phim', points: 1500, image: '🎬', color: 'from-red-400 to-rose-500' },
  { id: 'r6', name: 'Set quà tặng', points: 3000, image: '🎁', color: 'from-indigo-400 to-violet-500' },
];

const leaderboard = [
  { rank: 1, name: 'Nguyễn Văn A', points: 15200, avatar: 'https://ui-avatars.com/api/?name=Nguyen+Van+A&background=0D8ABC&color=fff' },
  { rank: 2, name: 'Trần Thị B', points: 12800, avatar: 'https://ui-avatars.com/api/?name=Tran+Thi+B&background=E91E63&color=fff' },
  { rank: 3, name: 'Lê Văn C', points: 10900, avatar: 'https://ui-avatars.com/api/?name=Le+Van+C&background=4CAF50&color=fff' },
  { rank: 4, name: 'Phạm Thị D', points: 9800, avatar: 'https://ui-avatars.com/api/?name=Pham+Thi+D&background=FF9800&color=fff' },
  { rank: 5, name: 'Hoàng Văn E', points: 8700, avatar: 'https://ui-avatars.com/api/?name=Hoang+Van+E&background=9C27B0&color=fff' },
];

export default function GamificationPage() {
  const [activeTab, setActiveTab] = useState<'lucky-wheel' | 'mini-game' | 'rewards' | 'leaderboard'>('lucky-wheel');
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinResult, setSpinResult] = useState<string | null>(null);

  const handleSpin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setSpinResult(null);
    
    const prizes = ['100 điểm', '50 điểm', '200 điểm', '30 điểm', '500 điểm', 'Chúc bạn may mắn lần sau!'];
    setTimeout(() => {
      const randomPrize = prizes[Math.floor(Math.random() * prizes.length)];
      setSpinResult(randomPrize);
      setIsSpinning(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-purple-700 via-pink-600 to-orange-500 text-white py-16">
        <div className="container-custom text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">🎮 Vui Chơi Nhận Thưởng</h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Tham gia các trò chơi, hoàn thành nhiệm vụ và nhận điểm thưởng mỗi ngày!
          </p>
        </div>
      </section>

      {/* Tabs */}
      <section className="py-6 bg-white border-b sticky top-0 z-20">
        <div className="container-custom">
          <div className="flex gap-3 overflow-x-auto">
            {[
              { key: 'lucky-wheel', label: '🎡 Vòng Quay', icon: '🎡' },
              { key: 'mini-game', label: '🎮 Mini Game', icon: '🎮' },
              { key: 'rewards', label: '🎁 Đổi Thưởng', icon: '🎁' },
              { key: 'leaderboard', label: '🏆 Bảng Xếp Hạng', icon: '🏆' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`px-6 py-3 rounded-xl font-medium whitespace-nowrap transition-all ${
                  activeTab === tab.key
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container-custom max-w-5xl mx-auto">
          {/* Lucky Wheel */}
          {activeTab === 'lucky-wheel' && (
            <div className="text-center">
              <div className="card max-w-lg mx-auto p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">🎡 Vòng Quay May Mắn</h2>
                <p className="text-gray-500 mb-8">Mỗi ngày bạn có 1 lượt quay miễn phí!</p>
                
                <div className="relative w-72 h-72 mx-auto mb-8">
                  <div className={`w-full h-full rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 p-3 ${isSpinning ? 'animate-spin' : ''}`}>
                    <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                      <div className="text-center">
                        <span className="text-6xl block mb-2">🎡</span>
                        <span className="text-lg font-bold text-gray-700">Quay Ngay!</span>
                      </div>
                    </div>
                  </div>
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 text-3xl">📍</div>
                </div>

                <button
                  onClick={handleSpin}
                  disabled={isSpinning}
                  className="btn-primary bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-lg px-12 py-4 disabled:opacity-50"
                >
                  {isSpinning ? '🔄 Đang quay...' : '🎡 QUAY NGAY'}
                </button>

                {spinResult && (
                  <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-200 animate-fade-in">
                    <p className="text-lg font-bold text-purple-700">
                      🎉 Bạn nhận được: {spinResult}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Mini Games */}
          {activeTab === 'mini-game' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { name: 'Săn Voucher', icon: '🏃', desc: 'Săn voucher giảm giá siêu tốc', points: 500, color: 'from-green-400 to-emerald-500' },
                { name: 'Câu Cá', icon: '🎣', desc: 'Câu cá nhận quà hấp dẫn', points: 300, color: 'from-blue-400 to-cyan-500' },
                { name: 'Xếp Hình', icon: '🧩', desc: 'Thử thách trí nhớ của bạn', points: 400, color: 'from-purple-400 to-pink-500' },
                { name: 'Lật Bài', icon: '🃏', desc: 'Lật bài trúng thưởng', points: 200, color: 'from-yellow-400 to-orange-500' },
                { name: 'Đập Chuột', icon: '🔨', desc: 'Đập chuột nhận điểm', points: 350, color: 'from-red-400 to-rose-500' },
                { name: 'Xúc Xắc', icon: '🎲', desc: 'Đổ xúc xắc may mắn', points: 250, color: 'from-indigo-400 to-violet-500' },
              ].map((game) => (
                <div key={game.name} className="card p-6 hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${game.color} flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform`}>
                    {game.icon}
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg mb-2">{game.name}</h3>
                  <p className="text-gray-500 text-sm mb-4">{game.desc}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-primary-600">+{game.points} điểm</span>
                    <button className="text-sm bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                      Chơi ngay →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Rewards */}
          {activeTab === 'rewards' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">🎁 Đổi Điểm Lấy Quà</h2>
              <p className="text-gray-500 mb-8">Bạn có 2.450 điểm</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rewards.map((reward) => (
                  <div key={reward.id} className="card p-6 hover:shadow-xl transition-all">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${reward.color} flex items-center justify-center text-3xl mb-4`}>
                      {reward.image}
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2">{reward.name}</h3>
                    <p className="text-2xl font-bold text-primary-600 mb-4">{reward.points} điểm</p>
                    <button className="btn-primary w-full bg-gradient-to-r from-purple-600 to-pink-600 text-sm">
                      Đổi ngay
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Leaderboard */}
          {activeTab === 'leaderboard' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">🏆 Bảng Xếp Hạng</h2>
              <p className="text-gray-500 mb-8">Top thành viên tích cực nhất tháng</p>
              <div className="card overflow-hidden">
                {leaderboard.map((member, index) => (
                  <div
                    key={member.rank}
                    className={`flex items-center gap-4 p-5 ${
                      index < leaderboard.length - 1 ? 'border-b' : ''
                    } hover:bg-gray-50 transition-colors ${
                      member.rank === 1 ? 'bg-yellow-50' : ''
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg ${
                      member.rank === 1 ? 'bg-yellow-400 text-yellow-900' :
                      member.rank === 2 ? 'bg-gray-300 text-gray-700' :
                      member.rank === 3 ? 'bg-orange-300 text-orange-900' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      #{member.rank}
                    </div>
                    <img src={member.avatar} alt={member.name} className="w-12 h-12 rounded-full" />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{member.name}</p>
                      <p className="text-sm text-gray-500">{member.points.toLocaleString()} điểm</p>
                    </div>
                    {member.rank === 1 && <span className="text-3xl">👑</span>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

