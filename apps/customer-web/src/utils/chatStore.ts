export interface ChatMessage {
    role: 'customer' | 'staff';
    text: string;
    time: string;
}

export interface ChatSession {
    id: string;
    customerName: string;
    customerAvatar: string;
    lastMessage: string;
    lastTime: string;
    status: 'waiting' | 'active' | 'closed';
    unread: number;
    messages: ChatMessage[];
}

const CHAT_STORAGE_KEY = 'smartmall_chat_sessions';

// Generate unique ID
const generateId = (): string => `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// Get all sessions from localStorage
export function getSessions(): ChatSession[] {
    if (typeof window === 'undefined') return [];
    try {
        const data = localStorage.getItem(CHAT_STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    } catch {
        return [];
    }
}

// Save sessions to localStorage
function saveSessions(sessions: ChatSession[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(sessions));
    // Dispatch event to notify admin page
    window.dispatchEvent(new CustomEvent('chat-update', { detail: sessions }));
}

// Customer requests staff support
export function requestStaffSupport(customerName: string, customerAvatar: string, initialMessage: string): ChatSession {
    const sessions = getSessions();
    const now = new Date();
    const time = now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

    const newSession: ChatSession = {
        id: generateId(),
        customerName,
        customerAvatar: customerAvatar || `https://picsum.photos/seed/${Date.now()}/100/100`,
        lastMessage: initialMessage,
        lastTime: 'Vừa xong',
        status: 'waiting',
        unread: 1,
        messages: [{ role: 'customer', text: initialMessage, time }],
    };

    sessions.push(newSession);
    saveSessions(sessions);
    return newSession;
}

// Customer sends message (when staff connected)
export function customerSendMessage(sessionId: string, text: string): void {
    const sessions = getSessions();
    const session = sessions.find(s => s.id === sessionId);
    if (!session || session.status !== 'active') return;

    const now = new Date();
    const time = now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

    session.messages.push({ role: 'customer', text, time });
    session.lastMessage = text;
    session.lastTime = 'Vừa xong';
    session.unread = (session.unread || 0) + 1;
    saveSessions(sessions);
}

// Staff accepts a waiting chat
export function staffAcceptChat(sessionId: string, staffName: string): void {
    const sessions = getSessions();
    const session = sessions.find(s => s.id === sessionId);
    if (!session) return;

    session.status = 'active';
    session.unread = 0;
    const now = new Date();
    const time = now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    session.messages.push({ role: 'staff', text: `✅ Nhân viên ${staffName} đã kết nối! Tôi có thể giúp gì cho bạn?`, time });
    session.lastMessage = `✅ Nhân viên ${staffName} đã kết nối!`;
    session.lastTime = 'Vừa xong';
    saveSessions(sessions);
}

// Staff sends message
export function staffSendMessage(sessionId: string, text: string): void {
    const sessions = getSessions();
    const session = sessions.find(s => s.id === sessionId);
    if (!session || session.status !== 'active') return;

    const now = new Date();
    const time = now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

    session.messages.push({ role: 'staff', text, time });
    session.lastMessage = text;
    session.lastTime = 'Vừa xong';
    saveSessions(sessions);
}

// Close a chat session
export function closeChat(sessionId: string): void {
    const sessions = getSessions();
    const session = sessions.find(s => s.id === sessionId);
    if (!session) return;

    session.status = 'closed';
    session.unread = 0;
    const now = new Date();
    const time = now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    session.messages.push({ role: 'staff', text: '🔴 Cuộc trò chuyện đã kết thúc. Cảm ơn bạn đã liên hệ!', time });
    session.lastMessage = '🔴 Cuộc trò chuyện đã kết thúc';
    session.lastTime = 'Vừa xong';
    saveSessions(sessions);
}

// Get waiting count
export function getWaitingCount(): number {
    return getSessions().filter(s => s.status === 'waiting').length;
}

// Listen for real-time updates
export function onChatUpdate(callback: (sessions: ChatSession[]) => void): () => void {
    const handler = (e: Event) => {
        callback((e as CustomEvent).detail);
    };
    if (typeof window !== 'undefined') {
        window.addEventListener('chat-update', handler);
    }
    return () => {
        if (typeof window !== 'undefined') {
            window.removeEventListener('chat-update', handler);
        }
    };
}