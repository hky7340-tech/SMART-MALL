import React, { useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';

const tabs = [
  { id: 'profile', label: 'Hồ sơ', icon: '👤' },
  { id: 'orders', label: 'Đơn hàng', icon: '📦' },
  { id: 'wishlist', label: 'Yêu thích', icon: '❤️' },
  { id: 'rewards', label: 'Điểm thưởng', icon: '⭐' },
  { id: 'vouchers', label: 'Voucher', icon: '🎫' },
  { id: 'addresses', label: 'Địa chỉ', icon: '📍' },
  { id: 'notifications', label: 'Thông báo', icon: '🔔' },
  { id: 'security', label: 'Bảo mật', icon: '🔒' },
];

const orders = [
  { id: 'ORD001', date: '2024-03-15', status: 'delivered', total: 897000, items: 3, store: 'Fashion Hub' },
  { id: 'ORD002', date: '2024-03-14', status: 'shipping', total: 15999000, items: 1, store: 'TechZone' },
  { id: 'ORD003', date: '2024-03-12', status: 'pending', total: 147000, items: 3, store: 'Trà Sữa Đài Loan' },
  { id: 'ORD004', date: '2024-03-10', status: 'cancelled', total: 599000, items: 2, store: 'Beauty Shop' },
  { id: 'ORD005', date: '2024-03-08', status: 'confirmed', total: 2999000, items: 1, store: 'TechZone' },
];

const statusLabels: Record<string, { label: string; color: string }> = {
  pending: { label: 'Chờ xác nhận', color: 'text-yellow-600 bg-yellow-50' },
  confirmed: { label: 'Đã xác nhận', color: 'text-blue-600 bg-blue-50' },
  shipping: { label: 'Đang giao', color: 'text-purple-600 bg-purple-50' },
  delivered: { label: 'Đã giao', color: 'text-green-600 bg-green-50' },
  cancelled: { label: 'Đã hủy', color: 'text-red-600 bg-red-50' },
};

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState({
    fullName: 'Nguyễn Văn A',
    email: 'nguyenvana@email.com',
    phone: '0912 345 678',
    birthDate: '1995-06-15',
    gender: 'male',
  });
  const [editProfile, setEditProfile] = useState(profile);

  const userStats = {
    totalOrders: 23,
    totalSpent: 45600000,
    points: 12500,
    tier: 'Gold',
    wishlistCount: 8,
    voucherCount: 3,
  };

  const formatPrice = (price: number) => price.toLocaleString('vi-VN') + '₫';
  const handleSaveProfile = () => { setProfile(editProfile); setEditing(false); toast.success('Cập nhật hồ sơ thành công'); };

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Hồ sơ của tôi</h2>
              <button onClick={() => editing ? handleSaveProfile() : setEditing(true)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${editing ? 'btn-primary' : 'btn-secondary'}`}>
                {editing ? 'Lưu thay đổi' : 'Chỉnh sửa'}
              </button>
            </div>
            <div className="space-y-4 max-w-lg">
              {[
                { label: 'Họ và tên', key: 'fullName', type: 'text' },
                { label: 'Email', key: 'email', type: 'email', disabled: true, bg: true },
                { label: 'Số điện thoại', key: 'phone', type: 'tel' },
                { label: 'Ngày sinh', key: 'birthDate', type: 'date' },
              ].map(field => (
                <div key={field.key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                  <input type={field.type}
                    value={editing ? (editProfile as any)[field.key] : (profile as any)[field.key]}
                    onChange={(e) => setEditProfile({ ...editProfile, [field.key]: e.target.value })}
                    disabled={field.disabled || !editing}
                    className={`input-field ${field.bg ? 'bg-gray-50' : ''}`} />
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Giới tính</label>
                <div className="flex gap-4">
                  {['male', 'female', 'other'].map(g => (
                    <label key={g} className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="gender"
                        checked={(editing ? editProfile.gender : profile.gender) === g}
                        onChange={() => setEditProfile({ ...editProfile, gender: g })}
                        disabled={!editing} className="text-primary-600 focus:ring-primary-500" />
                      <span className="text-sm text-gray-700">{g === 'male' ? 'Nam' : g === 'female' ? 'Nữ' : 'Khác'}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'orders':
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">Đơn hàng của tôi</h2>
            {orders.map(order => (
              <div key={order.id} className="card p-4 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="font-semibold text-gray-900">{order.id}</span>
                    <span className="text-sm text-gray-500 ml-3">{new Date(order.date).toLocaleDateString('vi-VN')}</span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusLabels[order.status].color}`}>
                    {statusLabels[order.status].label}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">{order.store} - {order.items} sản phẩm</span>
                  <span className="font-bold text-gray-900">{formatPrice(order.total)}</span>
                </div>
              </div>
            ))}
          </div>
        );

      case 'wishlist':
        return (
          <div className="card p-6 text-center">
            <div className="text-6xl mb-4">❤️</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Danh sách yêu thích</h3>
            <p className="text-gray-600">Bạn có {userStats.wishlistCount} sản phẩm yêu thích</p>
          </div>
        );

      case 'rewards':
        return (
          <div className="space-y-6">
            <div className="card p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Điểm thưởng & Thành viên</h2>
              <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl p-6 text-white mb-6">
                <p className="text-white/80 text-sm">Thành viên</p>
                <p className="text-2xl font-bold mb-2">⭐ {userStats.tier}</p>
                <p className="text-4xl font-bold mb-1">{userStats.points.toLocaleString()}</p>
                <p className="text-white/80 text-sm">Điểm thưởng</p>
              </div>
              <h3 className="font-semibold text-gray-900 mb-3">Lịch sử điểm</h3>
              <div className="space-y-3">
                {[
                  { action: 'Mua hàng tại TechZone', points: '+250', date: '15/03/2024' },
                  { action: 'Check-in hàng ngày', points: '+10', date: '15/03/2024' },
                  { action: 'Đánh giá sản phẩm', points: '+50', date: '14/03/2024' },
                  { action: 'Sinh nhật tháng 3', points: '+500', date: '10/03/2024' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{item.action}</p>
                      <p className="text-xs text-gray-500">{item.date}</p>
                    </div>
                    <span className="text-sm font-bold text-green-600">{item.points}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'vouchers':
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">Voucher của tôi</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { code: 'SALE50', desc: 'Giảm 50.000₫ đơn từ 200.000₫', expiry: '31/12/2024', used: false },
                { code: 'FREESHIP', desc: 'Miễn phí vận chuyển', expiry: '31/12/2024', used: false },
                { code: 'WELCOME10', desc: 'Giảm 10% đơn đầu tiên', expiry: '30/06/2024', used: false },
                { code: 'BIRTHDAY', desc: 'Quà sinh nhật 100.000₫', expiry: '15/06/2024', used: false },
              ].map((v, i) => (
                <div key={i} className={`card p-4 border-2 ${v.used ? 'border-gray-200 opacity-50' : 'border-primary-200'}`}>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <span className="font-bold text-primary-600">{v.code}</span>
                      <p className="text-sm text-gray-600 mt-1">{v.desc}</p>
                    </div>
                    <span className="text-xs text-gray-400">HSD: {v.expiry}</span>
                  </div>
                  {!v.used && <button className="btn-primary text-sm px-4 py-1.5 mt-2" onClick={() => toast.success('Đã áp dụng voucher!')}>Sử dụng ngay</button>}
                  {v.used && <span className="text-xs text-gray-400 mt-2 block">Đã sử dụng</span>}
                </div>
              ))}
            </div>
          </div>
        );

      case 'addresses':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Địa chỉ của tôi</h2>
              <button className="btn-primary text-sm" onClick={() => toast.success('Thêm địa chỉ mới')}>+ Thêm địa chỉ</button>
            </div>
            {[
              { name: 'Nguyễn Văn A', phone: '0912 345 678', address: '123 Nguyễn Huệ, P. Bến Nghé, Q.1, TP.HCM', default: true },
              { name: 'Nguyễn Văn A', phone: '0912 345 678', address: '456 Lê Lợi, P. Bến Thành, Q.1, TP.HCM', default: false },
            ].map((addr, i) => (
              <div key={i} className="card p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-900">{addr.name}</span>
                      <span className="text-sm text-gray-500">| {addr.phone}</span>
                      {addr.default && <span className="badge-primary text-xs">Mặc định</span>}
                    </div>
                    <p className="text-sm text-gray-600">{addr.address}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="text-sm text-primary-600 hover:underline" onClick={() => toast.success('Chỉnh sửa địa chỉ')}>Sửa</button>
                    <button className="text-sm text-red-500 hover:underline" onClick={() => toast.success('Đã xóa địa chỉ')}>Xóa</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">Thông báo</h2>
            {[
              { title: 'Đơn hàng đã giao thành công', desc: 'Đơn hàng ORD001 đã được giao thành công', time: '2 giờ trước', read: false },
              { title: 'Khuyến mãi cuối tuần', desc: 'Giảm đến 50% cho tất cả sản phẩm thời trang', time: '1 ngày trước', read: false },
              { title: 'Điểm thưởng sắp hết hạn', desc: '500 điểm thưởng của bạn sẽ hết hạn vào 7 ngày tới', time: '3 ngày trước', read: true },
              { title: 'Chúc mừng sinh nhật', desc: 'Nhận ngay voucher 100.000₫ nhân dịp sinh nhật', time: '1 tuần trước', read: true },
            ].map((notif, i) => (
              <div key={i} className={`card p-4 ${!notif.read ? 'border-l-4 border-l-primary-500 bg-primary-50/30' : ''}`}>
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className={`font-medium ${notif.read ? 'text-gray-600' : 'text-gray-900'}`}>{notif.title}</h4>
                    <p className="text-sm text-gray-500 mt-1">{notif.desc}</p>
                  </div>
                  <span className="text-xs text-gray-400 flex-shrink-0">{notif.time}</span>
                </div>
              </div>
            ))}
          </div>
        );

      case 'security':
        return (
          <div className="card p-6 space-y-6">
            <h2 className="text-xl font-bold text-gray-900">Bảo mật</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <h4 className="font-medium text-gray-900">Đổi mật khẩu</h4>
                  <p className="text-sm text-gray-500">Cập nhật mật khẩu thường xuyên để bảo vệ tài khoản</p>
                </div>
                <button className="btn-secondary text-sm" onClick={() => toast.success('Chuyển đến trang đổi mật khẩu')}>Đổi ngay</button>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <h4 className="font-medium text-gray-900">Xác thực 2 lớp (2FA)</h4>
                  <p className="text-sm text-gray-500">Tăng cường bảo mật cho tài khoản của bạn</p>
                </div>
                <button className="btn-secondary text-sm" onClick={() => toast.success('Kích hoạt 2FA')}>Bật</button>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <h4 className="font-medium text-gray-900">Xác thực Email</h4>
                  <p className="text-sm text-gray-500">Email của bạn đã được xác thực</p>
                </div>
                <span className="badge-success text-sm">Đã xác thực</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <h4 className="font-medium text-gray-900">Xác thực Số điện thoại</h4>
                  <p className="text-sm text-gray-500">Số điện thoại của bạn đã được xác thực</p>
                </div>
                <span className="badge-success text-sm">Đã xác thực</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl">
                <div>
                  <h4 className="font-medium text-red-600">Xóa tài khoản</h4>
                  <p className="text-sm text-red-500">Hành động này không thể hoàn tác</p>
                </div>
                <button className="px-4 py-2 bg-red-500 text-white rounded-xl text-sm font-medium hover:bg-red-600"
                  onClick={() => toast.error('Vui lòng liên hệ hỗ trợ để xóa tài khoản')}>Xóa</button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="card p-5 sticky top-24">
              <div className="text-center mb-6">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center mb-3">
                  <span className="text-3xl text-white font-bold">{profile.fullName.charAt(0)}</span>
                </div>
                <h3 className="font-semibold text-gray-900">{profile.fullName}</h3>
                <p className="text-sm text-gray-500">{profile.email}</p>
                <div className="mt-2 inline-flex items-center gap-1 bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full text-xs font-medium">
                  ⭐ {userStats.tier} Member
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-gray-50 rounded-xl p-3 text-center">
                  <p className="text-lg font-bold text-primary-600">{userStats.totalOrders}</p>
                  <p className="text-xs text-gray-500">Đơn hàng</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 text-center">
                  <p className="text-lg font-bold text-primary-600">{userStats.points.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">Điểm</p>
                </div>
              </div>
              <div className="space-y-1">
                {tabs.map(tab => (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      activeTab === tab.id ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50'
                    }`}>
                    <span>{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
              <div className="mt-6 pt-4 border-t border-gray-100">
                <button onClick={() => toast.success('Đã đăng xuất!')}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">
                  <span>🚪</span>
                  <span>Đăng xuất</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}
