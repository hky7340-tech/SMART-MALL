import React, { useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import { requestStaffSupport, customerSendMessage, getSessions, onChatUpdate, ChatSession } from '@/utils/chatStore';

interface LayoutProps {
  children: React.ReactNode;
}

// Vietnam Time Clock Component
function VietnamClock() {
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');
  const [ampm, setAmPm] = useState('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTime(new Intl.DateTimeFormat('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).format(now));
      setDate(new Intl.DateTimeFormat('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh', weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).format(now));
      setAmPm(now.getHours() >= 12 ? 'CH' : 'SA');
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed top-20 left-4 z-[100] hidden lg:block">
      <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl shadow-2xl border border-slate-700/50 p-4 min-w-[180px] overflow-hidden">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary-500/10 rounded-full blur-2xl animate-pulse" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl animate-pulse delay-1000" />
        <div className="relative flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-red-500 to-yellow-400 flex items-center justify-center text-xs font-bold shadow-lg">🇻🇳</div>
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-[0.2em]">Việt Nam</p>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-ping" />
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
            <span className="text-[10px] text-green-400 font-medium">Live</span>
          </div>
        </div>
        <div className="relative flex items-baseline gap-1 mb-2">
          <span className="text-3xl font-bold text-white font-mono tracking-[0.05em] tabular-nums">{time}</span>
          <span className="text-[10px] font-semibold text-primary-400 bg-primary-500/20 px-1.5 py-0.5 rounded-md">{ampm}</span>
        </div>
        <div className="relative flex items-center gap-2 text-xs text-gray-400">
          <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="capitalize">{date}</span>
        </div>
        <div className="relative mt-3 h-px bg-gradient-to-r from-transparent via-primary-500/30 to-transparent" />
      </div>
    </div>
  );
}

// AI Chat + Staff Chat Widget
function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [chatMode, setChatMode] = useState<'ai' | 'staff'>('ai');
  const [waitingForStaff, setWaitingForStaff] = useState(false);
  const [staffConnected, setStaffConnected] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<{ role: 'user' | 'bot' | 'staff'; text: string; time?: string }[]>([
    { role: 'bot', text: 'Xin chào! Tôi là trợ lý AI của Smart Mall. Tôi có thể giúp gì cho bạn?' },
  ]);
  const [input, setInput] = useState('');

  // Listen for staff responses in real-time
  useEffect(() => {
    const unsubscribe = onChatUpdate((sessions) => {
      if (!sessionId) return;
      const session = sessions.find(s => s.id === sessionId);
      if (!session) return;

      if (session.status === 'active' && waitingForStaff) {
        setWaitingForStaff(false);
        setStaffConnected(true);
        setChatMode('staff');
        // Show the staff acceptance message
        const staffMsg = session.messages.find(m => m.role === 'staff');
        if (staffMsg) {
          setMessages(prev => [...prev, { role: 'staff', text: staffMsg.text, time: staffMsg.time }]);
        }
      }

      // Update messages with any new staff replies
      const staffReplies = session.messages.filter(m => m.role === 'staff');
      const currentStaffCount = messages.filter(m => m.role === 'staff').length;
      if (staffReplies.length > currentStaffCount) {
        const newReplies = staffReplies.slice(currentStaffCount);
        newReplies.forEach(r => {
          setMessages(prev => [...prev, { role: 'staff', text: r.text, time: r.time }]);
        });
      }

      if (session.status === 'closed' && staffConnected) {
        setStaffConnected(false);
        setChatMode('ai');
        setSessionId(null);
      }
    });
    return unsubscribe;
  }, [sessionId, waitingForStaff, staffConnected, messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const newMsg = { role: 'user' as const, text: input, time: new Date().toLocaleTimeString('vi-VN') };
    setMessages(prev => [...prev, newMsg]);
    setInput('');

    if (chatMode === 'ai') {
      setTimeout(() => {
        const responses = [
          'Cảm ơn bạn đã hỏi! Tôi sẽ hỗ trợ bạn ngay.',
          'Thông tin này rất hữu ích. Để tôi kiểm tra cho bạn nhé!',
          'Tôi đã tìm thấy thông tin bạn cần. Vui lòng xem chi tiết bên dưới.',
          'Rất vui được giúp bạn! Còn gì tôi có thể hỗ trợ thêm không?',
        ];
        setMessages(prev => [...prev, { role: 'bot', text: responses[Math.floor(Math.random() * responses.length)], time: new Date().toLocaleTimeString('vi-VN') }]);
      }, 1000);
    } else if (staffConnected && sessionId) {
      customerSendMessage(sessionId, input);
      // Staff response will come via real-time update
    }
  };

  const handleConnectStaff = () => {
    setWaitingForStaff(true);
    setMessages(prev => [...prev, {
      role: 'bot',
      text: '⏳ Đang gửi yêu cầu kết nối tới nhân viên hỗ trợ... Vui lòng chờ trong giây lát.',
      time: new Date().toLocaleTimeString('vi-VN'),
    }]);

    // Create the chat session via shared store
    const session = requestStaffSupport(
      'Khách hàng',
      '',
      input || 'Xin chào! Tôi cần hỗ trợ.'
    );
    setSessionId(session.id);
  };

  const handleDisconnectStaff = () => {
    if (sessionId) {
      const { closeChat } = require('@/utils/chatStore');
      closeChat(sessionId);
    }
    setStaffConnected(false);
    setChatMode('ai');
    setSessionId(null);
    setMessages(prev => [...prev, {
      role: 'staff',
      text: '🔴 Cuộc trò chuyện đã kết thúc. Cảm ơn bạn đã liên hệ!',
      time: new Date().toLocaleTimeString('vi-VN'),
    }]);
  };

  const suggestions = [
    'Tìm cửa hàng thời trang',
    'Sản phẩm đang giảm giá',
    'Hướng dẫn đến quầy thông tin',
    'Sự kiện đang diễn ra',
  ];

  return (
    <>
      <button onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-r from-primary-500 to-primary-700 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center">
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
        )}
        {!isOpen && <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse" />}
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden animate-slide-up">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  {chatMode === 'staff' && staffConnected ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold">{chatMode === 'staff' && staffConnected ? 'Hỗ trợ nhân viên' : 'AI Assistant'}</h3>
                  <p className="text-xs text-white/70">
                    {waitingForStaff ? '⏳ Đang kết nối...' : staffConnected ? '🟢 Nhân viên trực tuyến' : 'Trực tuyến • Phản hồi nhanh'}
                  </p>
                </div>
              </div>
              {!staffConnected && !waitingForStaff && chatMode === 'ai' && (
                <button onClick={handleConnectStaff} className="text-[10px] bg-white/20 hover:bg-white/30 px-2 py-1 rounded-lg transition-colors flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
                  NV hỗ trợ
                </button>
              )}
              {staffConnected && (
                <button onClick={handleDisconnectStaff} className="text-[10px] bg-red-500/30 hover:bg-red-500/50 px-2 py-1 rounded-lg transition-colors">Kết thúc</button>
              )}
            </div>
            {waitingForStaff && (
              <div className="mt-2 flex items-center gap-2 text-xs text-yellow-200 bg-yellow-500/20 p-2 rounded-lg">
                <span className="animate-pulse">⏳</span>
                Đã gửi yêu cầu đến nhân viên. Chờ xác nhận...
              </div>
            )}
          </div>

          {/* Messages */}
          <div className="h-80 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-primary-600 text-white rounded-br-md' : msg.role === 'staff' ? 'bg-green-50 text-gray-800 shadow-sm rounded-bl-md border border-green-200' : 'bg-white text-gray-800 shadow-sm rounded-bl-md border border-gray-100'}`}>
                  {(msg.role === 'bot' || msg.role === 'staff') && (
                    <div className="flex items-center gap-1 mb-1">
                      <span className={`w-4 h-4 rounded-full flex items-center justify-center ${msg.role === 'staff' ? 'bg-green-100' : 'bg-primary-100'}`}>
                        <svg className={`w-2.5 h-2.5 ${msg.role === 'staff' ? 'text-green-600' : 'text-primary-600'}`} fill="currentColor" viewBox="0 0 24 24">
                          {msg.role === 'staff' ? <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /> : <path d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />}
                        </svg>
                      </span>
                      <span className={`text-[10px] font-medium ${msg.role === 'staff' ? 'text-green-600' : 'text-primary-600'}`}>{msg.role === 'staff' ? 'Nhân viên' : 'AI'}</span>
                    </div>
                  )}
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                  {msg.time && <p className="text-[10px] opacity-60 mt-1 text-right">{msg.time}</p>}
                </div>
              </div>
            ))}
          </div>

          {/* Suggestions */}
          {chatMode === 'ai' && !waitingForStaff && !staffConnected && (
            <div className="px-4 py-2 border-t border-gray-100">
              <div className="flex gap-2 overflow-x-auto pb-2">
                {suggestions.map((s, i) => (
                  <button key={i} onClick={() => setInput(s)} className="text-xs whitespace-nowrap px-3 py-1.5 bg-gray-100 text-gray-600 rounded-full hover:bg-primary-50 hover:text-primary-600 transition-colors flex-shrink-0">{s}</button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-gray-100">
            <div className="flex gap-2">
              <input type="text" value={input} onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder={staffConnected ? 'Nhập tin nhắn gửi nhân viên...' : waitingForStaff ? 'Đang chờ kết nối...' : 'Nhập tin nhắn...'}
                disabled={waitingForStaff}
                className="flex-1 px-4 py-2.5 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50 disabled:opacity-50" />
              <button onClick={handleSend} disabled={waitingForStaff || !input.trim()}
                className="w-10 h-10 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors flex items-center justify-center disabled:opacity-50">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <VietnamClock />
      <AIChatWidget />
    </div>
  );
}