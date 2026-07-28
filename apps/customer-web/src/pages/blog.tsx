import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  author: string;
  authorAvatar: string;
  publishedAt: string;
  readTime: number;
  tags: string[];
}

const mockPosts: BlogPost[] = [
  {
    id: 'post_1',
    title: 'Top 10 Xu Hướng Thời Trang 2024',
    excerpt: 'Khám phá những xu hướng thời trang mới nhất đang làm mưa làm gió trong năm 2024...',
    content: '',
    image: 'https://picsum.photos/seed/blog1/800/400',
    category: 'Thời trang',
    author: 'Nguyễn Minh Anh',
    authorAvatar: 'https://ui-avatars.com/api/?name=Nguyen+Minh+Anh&background=0D8ABC&color=fff',
    publishedAt: '2024-01-15',
    readTime: 5,
    tags: ['thời trang', 'xu hướng', '2024'],
  },
  {
    id: 'post_2',
    title: 'Bí Quyết Chọn Đồ Công Sở Phù Hợp',
    excerpt: 'Những tips chọn đồ công sở giúp bạn tự tin và chuyên nghiệp hơn trong môi trường làm việc...',
    content: '',
    image: 'https://picsum.photos/seed/blog2/800/400',
    category: 'Phong cách',
    author: 'Trần Thị Bích',
    authorAvatar: 'https://ui-avatars.com/api/?name=Tran+Thi+Bich&background=E91E63&color=fff',
    publishedAt: '2024-01-12',
    readTime: 4,
    tags: ['thời trang', 'công sở', 'phong cách'],
  },
  {
    id: 'post_3',
    title: 'Khám Phá Ẩm Thực Đường Phố Việt Nam',
    excerpt: 'Hành trình ẩm thực qua các món ăn đường phố nổi tiếng tại các trung tâm thương mại...',
    content: '',
    image: 'https://picsum.photos/seed/blog3/800/400',
    category: 'Ẩm thực',
    author: 'Lê Văn Hùng',
    authorAvatar: 'https://ui-avatars.com/api/?name=Le+Van+Hung&background=4CAF50&color=fff',
    publishedAt: '2024-01-10',
    readTime: 6,
    tags: ['ẩm thực', 'đường phố', 'việt nam'],
  },
  {
    id: 'post_4',
    title: 'Công Nghệ AI Trong Trung Tâm Thương Mại',
    excerpt: 'Cách trí tuệ nhân tạo đang thay đổi trải nghiệm mua sắm tại các trung tâm thương mại...',
    content: '',
    image: 'https://picsum.photos/seed/blog4/800/400',
    category: 'Công nghệ',
    author: 'Phạm Hoàng Nam',
    authorAvatar: 'https://ui-avatars.com/api/?name=Pham+Hoang+Nam&background=FF9800&color=fff',
    publishedAt: '2024-01-08',
    readTime: 7,
    tags: ['công nghệ', 'AI', 'smart mall'],
  },
  {
    id: 'post_5',
    title: 'Mẹo Mua Sắm Thông Minh Mùa Sale',
    excerpt: 'Những chiến lược mua sắm thông minh để săn được deal hời trong mùa giảm giá...',
    content: '',
    image: 'https://picsum.photos/seed/blog5/800/400',
    category: 'Mẹo hay',
    author: 'Hoàng Thị Mai',
    authorAvatar: 'https://ui-avatars.com/api/?name=Hoang+Thi+Mai&background=9C27B0&color=fff',
    publishedAt: '2024-01-05',
    readTime: 3,
    tags: ['mua sắm', 'sale', 'mẹo hay'],
  },
  {
    id: 'post_6',
    title: 'Sự Kiện Giải Trí Cuối Tuần Tại Smart Mall',
    excerpt: 'Tổng hợp các sự kiện giải trí hấp dẫn dành cho gia đình vào cuối tuần...',
    content: '',
    image: 'https://picsum.photos/seed/blog6/800/400',
    category: 'Sự kiện',
    author: 'Vũ Thị Lan',
    authorAvatar: 'https://ui-avatars.com/api/?name=Vu+Thi+Lan&background=00BCD4&color=fff',
    publishedAt: '2024-01-03',
    readTime: 4,
    tags: ['sự kiện', 'giải trí', 'cuối tuần'],
  },
];

const categories = ['Tất cả', 'Thời trang', 'Phong cách', 'Ẩm thực', 'Công nghệ', 'Mẹo hay', 'Sự kiện'];

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPosts = mockPosts.filter((post) => {
    const matchesCategory = selectedCategory === 'Tất cả' || post.category === selectedCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">📝 Tin Tức & Blog</h1>
            <p className="text-primary-100 text-lg mb-8">
              Cập nhật những tin tức mới nhất, mẹo hay và câu chuyện thú vị từ Smart Mall
            </p>
            <div className="relative max-w-2xl mx-auto">
              <input
                type="text"
                placeholder="Tìm kiếm bài viết..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field pl-12 py-4 text-gray-900 text-lg"
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl">🔍</span>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Filter */}
      <section className="py-8 bg-white border-b sticky top-0 z-20">
        <div className="container-custom">
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2.5 rounded-full whitespace-nowrap font-medium transition-all duration-200 ${
                  selectedCategory === cat
                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-12">
        <div className="container-custom">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-20">
              <span className="text-6xl mb-4 block">📭</span>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Không tìm thấy bài viết</h3>
              <p className="text-gray-500">Thử tìm kiếm với từ khóa khác</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <Link key={post.id} href={`/blog/${post.id}`} className="group">
                  <article className="card overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    <div className="relative h-52 overflow-hidden">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-3 left-3 badge-primary text-xs">
                        {post.category}
                      </span>
                      <span className="absolute top-3 right-3 bg-white/90 backdrop-blur rounded-lg px-2 py-1 text-xs font-medium text-gray-700">
                        {post.readTime} phút đọc
                      </span>
                    </div>
                    <div className="p-5">
                      <div className="flex items-center gap-3 mb-3">
                        <img
                          src={post.authorAvatar}
                          alt={post.author}
                          className="w-8 h-8 rounded-full"
                        />
                        <span className="text-sm text-gray-500">{post.author}</span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-sm text-gray-400">{post.publishedAt}</span>
                      </div>
                      <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 text-sm line-clamp-2 mb-3">{post.excerpt}</p>
                      <div className="flex flex-wrap gap-2">
                        {post.tags.slice(0, 2).map((tag) => (
                          <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                            #{tag}
                          </span>
                        ))}
                        {post.tags.length > 2 && (
                          <span className="text-xs text-gray-400">+{post.tags.length - 2}</span>
                        )}
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-primary-800">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold text-white mb-2">📬 Đăng Ký Nhận Tin</h2>
          <p className="text-primary-100 mb-8">Nhận những bài viết hay nhất mỗi tuần</p>
          <div className="max-w-md mx-auto flex gap-3">
            <input
              type="email"
              placeholder="Nhập email của bạn..."
              className="input-field flex-1"
            />
            <button className="btn-primary bg-white text-primary-600 hover:bg-gray-100 whitespace-nowrap">
              Đăng ký
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

