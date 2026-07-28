import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

const suggestedQuestions = [
  'Tìm cửa hàng bán áo thun nam',
  'Có những chương trình khuyến mãi nào?',
  'Hướng dẫn đến Smart Mall',
  'Giờ mở cửa của trung tâm',
  'Làm thế nào để tích điểm thành viên?',
  'Có event gì cuối tuần này?',
];

const aiResponses: Record<string, string> = {
  'Tìm cửa hàng bán áo thun nam': 'Tôi tìm thấy **3 cửa hàng** bán áo thun nam tại Smart Mall:\n\n1. **Fashion Hub** - Tầng 1 (L1-01) - Chuyên thời trang nam cao cấp\n2. **Street Wear** - Tầng 2 (L2-10) - Phong cách trẻ trung\n3. **Uniqlo** - Tầng 3 (L3-05) - Thương hiệu Nhật Bản\n\nBạn muốn xem thông tin chi tiết cửa hàng nào? 🏪',
  'Có những chương trình khuyến mãi nào?': 'Hiện tại Smart Mall đang có các chương trình khuyến mãi hấp dẫn:\n\n🔥 **Flash Sale 12h** - Giảm đến 70% (còn 5h)\n🎉 **Mua 1 Tặng 1** - Tất cả các cửa hàng thời trang\n🚛 **Free Ship** - Đơn hàng từ 500K\n\nBạn muốn biết thêm chi tiết về chương trình nào không?',
  'Hướng dẫn đến Smart Mall': '📍 **Địa chỉ:** 123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh\n\n🚗 **Bằng xe hơi:** Bãi xe tầng hầm B1-B2 (500 chỗ)\n🚌 **Bằng xe buýt:** Các tuyến 01, 03, 08, 12 đều dừng tại trạm trước mall\n🚇 **Bằng Metro:** Ga Bến Thành - Lối ra số 3 (đi bộ 3 phút)\n\nBạn muốn tôi chỉ đường chi tiết hơn không? 🗺️',
  'Giờ mở cửa của trung tâm': '🕐 **Smart Mall hoạt động:**\n\n• **Cửa hàng:** 9:00 - 22:00 (T2-CN)\n• **Khu ẩm thực:** 8:00 - 23:00\n• **Rạp phim:** 8:00 - 0:00\n• **Bãi xe:** 7:00 - 1:00\n\nLưu ý: Giờ hoạt động có thể thay đổi vào các ngày lễ, Tết.',
  'Làm thế nào để tích điểm thành viên?': '🎯 **Chương trình tích điểm thành viên:**\n\n• **Silver:** 0đ - Giảm 0%, nhân 1x điểm\n• **Gold:** 1,000đ - Giảm 5%, nhân 1.5x điểm\n• **Platinum:** 5,000đ - Giảm 10%, nhân 2x điểm\n• **Diamond:** 15,000đ - Giảm 15%, nhân 3x điểm\n• **VIP:** 50,000đ - Giảm 20%, nhân 5x điểm\n\n💡 Cứ mua 10K = 10 điểm. Bạn có thể đổi điểm lấy voucher và quà tặng!',
  'Có event gì cuối tuần này?': '🎪 **Sự kiện cuối tuần này tại Smart Mall:**\n\n1. 🎵 **Live Music Night** - Thứ 7, 19:00 - Sân khấu trung tâm\n2. 🎨 **Workshop Ẩm thực** - CN, 10:00 - Tầng 6\n3. 🎪 **Kids Festival** - T7-CN, 9:00-17:00 - Khu vui chơi\n4. 🛍️ **Flash Sale** - Tất cả các ngày - Giảm đến 70%\n\nBạn muốn đăng ký tham gia sự kiện nào không?',
};

export default function AIChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Xin chào! 👋 Tôi là **AI Assistant** của Smart Mall. Tôi có thể giúp gì cho bạn? Dưới đây là một số câu hỏi thường gặp:',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (content: string) => {
    if (!content.trim()) return;

    const userMessage: ChatMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: content.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const response = aiResponses[content.trim()] || getDefaultResponse(content);
      const aiMessage: ChatMessage = {
        id: `ai_${Date.now()}`,
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const getDefaultResponse = (query: string): string => {
    if (query.includes('cảm ơn')) {
      return 'Cảm ơn bạn đã sử dụng dịch vụ! 😊 Nếu cần hỗ trợ thêm, đừng ngần ngại hỏi tôi nhé!';
    }
    if (query.includes('tạm biệt')) {
      return 'Tạm biệt bạn! Chúc bạn một ngày vui vẻ! 🌟 Hẹn gặp lại tại Smart Mall!';
    }
    return `Cảm ơn bạn đã quan tâm! 🤖 Tôi đang tiếp nhận câu hỏi của bạn về "${query}".\n\nĐể tôi kết nối bạn với bộ phận hỗ trợ phù hợp nhất. Hoặc bạn có thể thử các câu hỏi gợi ý bên dưới nhé!`;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-20">
        <div className="container-custom py-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center text-2xl shadow-lg">
              🤖
            </div>
            <div>
              <h1 className="font-bold text-lg text-gray-900">AI Assistant</h1>
              <p className="text-sm text-gray-500">Smart Mall Virtual Assistant</p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm text-green-600 font-medium">Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto py-6">
        <div className="container-custom max-w-4xl">
          <div className="space-y-6">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xl flex-shrink-0 ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-br from-primary-500 to-primary-700'
                      : 'bg-gradient-to-br from-gray-100 to-gray-200'
                  }`}
                >
                  {msg.role === 'user' ? '👤' : '🤖'}
                </div>
                <div
                  className={`max-w-[80%] ${
                    msg.role === 'user' ? 'order-1' : ''
                  }`}
                >
                  <div
                    className={`rounded-2xl px-5 py-3 ${
                      msg.role === 'user'
                        ? 'bg-primary-600 text-white rounded-tr-md'
                        : 'bg-white border border-gray-200 shadow-sm rounded-tl-md'
                    }`}
                  >
                    <p className="whitespace-pre-line text-sm leading-relaxed">
                      {msg.content}
                    </p>
                  </div>
                  <p
                    className={`text-xs text-gray-400 mt-1 ${
                      msg.role === 'user' ? 'text-right' : ''
                    }`}
                  >
                    {msg.timestamp.toLocaleTimeString('vi-VN', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl bg-gradient-to-br from-gray-100 to-gray-200">
                  🤖
                </div>
                <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-md px-5 py-4">
                  <div className="flex gap-1.5">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Questions */}
          {messages.length <= 2 && (
            <div className="mt-8">
              <p className="text-sm text-gray-500 mb-3 text-center">Câu hỏi thường gặp</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-3xl mx-auto">
                {suggestedQuestions.map((q) => (
                  <button
                    key={q}
                    onClick={() => handleSend(q)}
                    className="text-left p-4 bg-white border border-gray-200 rounded-xl hover:border-primary-300 hover:shadow-md transition-all duration-200 text-sm text-gray-700 hover:text-primary-600"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white border-t sticky bottom-0">
        <div className="container-custom max-w-4xl py-4">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend(input)}
              placeholder="Nhập câu hỏi của bạn..."
              className="input-field flex-1 rounded-2xl"
            />
            <button
              onClick={() => handleSend(input)}
              disabled={!input.trim() || isTyping}
              className="w-12 h-12 bg-primary-600 text-white rounded-2xl flex items-center justify-center hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

