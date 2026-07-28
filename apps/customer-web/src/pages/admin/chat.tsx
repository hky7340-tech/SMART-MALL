import React, { useState, useEffect } from 'react';
import { getSessions, staffAcceptChat, staffSendMessage, closeChat, onChatUpdate, getWaitingCount } from '@/utils/chatStore';
import type { ChatSession } from '@/utils/chatStore';

export default function AdminChatPage() {
    const [sessions, setSessions] = useState<ChatSession[]>([]);
    const [selectedChat, setSelectedChat] = useState<string | null>(null);
    const [staffInput, setStaffInput] = useState('');

    // Load sessions and listen for real-time updates
    useEffect(() => {
        setSessions(getSessions());
        const unsubscribe = onChatUpdate((updatedSessions) => {
            setSessions(updatedSessions);
        });
        // Poll every 2 seconds as fallback
        const interval = setInterval(() => {
            setSessions(getSessions());
        }, 2000);
        return () => {
            unsubscribe();
            clearInterval(interval);
        };
    }, []);

    const selectedChatData = sessions.find(s => s.id === selectedChat);

    // Auto-refresh selected chat data
    useEffect(() => {
        if (!selectedChat) return;
        const interval = setInterval(() => {
            const updated = getSessions().find(s => s.id === selectedChat);
            if (updated) {
                setSessions(prev => prev.map(s => s.id === selectedChat ? updated : s));
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [selectedChat]);

    const handleAcceptChat = (chatId: string) => {
        staffAcceptChat(chatId, 'Vũ Thanh');
        setSelectedChat(chatId);
    };

    const handleCloseChat = (chatId: string) => {
        closeChat(chatId);
        setSelectedChat(null);
    };

    const handleStaffSend = () => {
        if (!staffInput.trim() || !selectedChat) return;
        staffSendMessage(selectedChat, staffInput);
        setStaffInput('');
    };

    const waitingCount = sessions.filter(s => s.status === 'waiting').length;
    const activeCount = sessions.filter(s => s.status === 'active').length;

    return (
        <div className="h-[calc(100vh-8rem)] flex bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Sidebar - Chat List */}
            <div className="w-80 border-r border-gray-100 flex flex-col">
                <div className="p-4 border-b border-gray-100">
                    <h2 className="font-bold text-gray-900">Quản lý Chat</h2>
                    <div className="flex gap-2 mt-2">
                        <span className="badge-warning text-xs">{waitingCount} chờ</span>
                        <span className="badge-success text-xs">{activeCount} đang hỗ trợ</span>
                        <span className="badge-neutral text-xs">{sessions.length} tổng</span>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {sessions.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-center px-4">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-3xl mb-4">💬</div>
                            <h3 className="font-semibold text-gray-900 mb-1">Chưa có cuộc trò chuyện</h3>
                            <p className="text-sm text-gray-500">Khi khách hàng yêu cầu hỗ trợ, họ sẽ xuất hiện ở đây</p>
                        </div>
                    ) : (
                        sessions.map(session => (
                            <div
                                key={session.id}
                                onClick={() => { if (session.status !== 'closed') setSelectedChat(session.id); }}
                                className={`p-4 border-b border-gray-50 cursor-pointer transition-colors hover:bg-gray-50 ${selectedChat === session.id ? 'bg-primary-50/50' : ''} ${session.status === 'closed' ? 'opacity-60' : ''}`}
                            >
                                <div className="flex items-start gap-3">
                                    <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                                        <img src={session.customerAvatar} alt="" className="w-full h-full object-cover" />
                                        {session.status === 'active' && <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />}
                                        {session.status === 'waiting' && <span className="absolute bottom-0 right-0 w-3 h-3 bg-yellow-500 rounded-full border-2 border-white animate-pulse" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-sm font-semibold text-gray-900 truncate">{session.customerName}</h4>
                                            <span className="text-[10px] text-gray-400 flex-shrink-0">{session.lastTime}</span>
                                        </div>
                                        <p className="text-xs text-gray-500 truncate mt-0.5">{session.lastMessage}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            {session.status === 'waiting' && <span className="text-[10px] text-yellow-600 bg-yellow-50 px-1.5 py-0.5 rounded-full">Đang chờ</span>}
                                            {session.status === 'active' && <span className="text-[10px] text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full">Đang hỗ trợ</span>}
                                            {session.unread > 0 && (
                                                <span className="w-5 h-5 bg-primary-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">{session.unread}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Main Chat Area */}
            {selectedChatData ? (
                <div className="flex-1 flex flex-col">
                    <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                                <img src={selectedChatData.customerAvatar} alt="" className="w-full h-full object-cover" />
                                {selectedChatData.status === 'active' && <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />}
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 text-sm">{selectedChatData.customerName}</h3>
                                <p className="text-xs text-gray-500">
                                    {selectedChatData.status === 'waiting' ? '⏳ Chờ xác nhận' : selectedChatData.status === 'active' ? '🟢 Đang hỗ trợ' : '🔴 Đã kết thúc'}
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            {selectedChatData.status === 'waiting' && (
                                <button onClick={() => handleAcceptChat(selectedChatData.id)} className="btn-primary btn-sm">✅ Nhận hỗ trợ</button>
                            )}
                            {selectedChatData.status === 'active' && (
                                <button onClick={() => handleCloseChat(selectedChatData.id)} className="btn-secondary btn-sm text-red-600 hover:text-red-700 border-red-200 hover:border-red-300">🔴 Kết thúc</button>
                            )}
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/50">
                        {selectedChatData.messages.length === 0 ? (
                            <div className="flex items-center justify-center h-full text-gray-400 text-sm">Chưa có tin nhắn</div>
                        ) : (
                            selectedChatData.messages.map((msg, i) => (
                                <div key={i} className={`flex ${msg.role === 'staff' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[75%] p-3 rounded-2xl text-sm ${msg.role === 'staff' ? 'bg-primary-600 text-white rounded-br-md' : 'bg-white text-gray-800 shadow-sm rounded-bl-md border border-gray-100'}`}>
                                        {msg.role === 'customer' && <div className="flex items-center gap-1 mb-1"><span className="text-[10px] font-medium text-gray-500">Khách hàng</span></div>}
                                        <p>{msg.text}</p>
                                        <p className={`text-[10px] mt-1 ${msg.role === 'staff' ? 'text-white/60' : 'text-gray-400'}`}>{msg.time}</p>
                                    </div>
                                </div>
                            ))
                        )}
                        {selectedChatData.status === 'waiting' && (
                            <div className="text-center py-4">
                                <div className="inline-flex items-center gap-2 text-sm text-yellow-600 bg-yellow-50 px-4 py-2 rounded-full">
                                    <span className="animate-pulse">⏳</span>
                                    Đang chờ nhân viên xác nhận...
                                </div>
                            </div>
                        )}
                    </div>

                    {selectedChatData.status !== 'closed' && (
                        <div className="p-4 border-t border-gray-100">
                            <div className="flex gap-2">
                                <input type="text" value={staffInput} onChange={(e) => setStaffInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleStaffSend()}
                                    placeholder={selectedChatData.status === 'waiting' ? 'Vui lòng nhận hỗ trợ trước...' : 'Nhập tin nhắn...'}
                                    disabled={selectedChatData.status === 'waiting'}
                                    className="flex-1 px-4 py-2.5 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50 disabled:opacity-50" />
                                <button onClick={handleStaffSend} disabled={selectedChatData.status === 'waiting' || !staffInput.trim()}
                                    className="w-10 h-10 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors flex items-center justify-center disabled:opacity-50">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div className="flex-1 flex items-center justify-center bg-gray-50/30">
                    <div className="text-center">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-4xl mx-auto mb-4">💬</div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">Chọn một cuộc trò chuyện</h3>
                        <p className="text-sm text-gray-500">Click vào chat bên trái để xem và trả lời tin nhắn</p>
                    </div>
                </div>
            )}
        </div>
    );
}