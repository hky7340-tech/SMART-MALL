// API Service - Centralized HTTP client for all API calls
// Routes through Next.js rewrites: /api/* → http://localhost:3000/api/* (API Gateway)

const API_BASE = '/api';

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE}${endpoint}`;
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string> || {}),
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
        ...options,
        headers,
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || `API Error: ${response.status}`);
    }

    return data;
}

// Store APIs
export const storeApi = {
    list: (params?: { category?: string; floor?: number; search?: string; isFeatured?: string; page?: number; limit?: number }) => {
        const query = new URLSearchParams();
        if (params?.category) query.set('category', params.category);
        if (params?.floor) query.set('floor', params.floor.toString());
        if (params?.search) query.set('search', params.search);
        if (params?.isFeatured) query.set('isFeatured', params.isFeatured);
        if (params?.page) query.set('page', params.page.toString());
        if (params?.limit) query.set('limit', params.limit.toString());
        return request<{ success: boolean; data: any[]; pagination: any }>(`/stores?${query.toString()}`);
    },
    getById: (id: string) => request<{ success: boolean; data: any }>(`/stores/${id}`),
    getFeatured: () => request<{ success: boolean; data: any[] }>('/stores/featured'),
    getCategories: () => request<{ success: boolean; data: any[] }>('/stores/categories'),
    create: (data: any) => request<{ success: boolean; message: string; data: any }>('/stores', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) => request<{ success: boolean; message: string; data: any }>(`/stores/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
};

// Product APIs
export const productApi = {
    list: (params?: { category?: string; search?: string; minPrice?: number; maxPrice?: number; page?: number; limit?: number }) => {
        const query = new URLSearchParams();
        if (params?.category) query.set('category', params.category);
        if (params?.search) query.set('search', params.search);
        if (params?.minPrice) query.set('minPrice', params.minPrice.toString());
        if (params?.maxPrice) query.set('maxPrice', params.maxPrice.toString());
        if (params?.page) query.set('page', params.page.toString());
        if (params?.limit) query.set('limit', params.limit.toString());
        return request<{ success: boolean; data: any[]; pagination: any }>(`/products?${query.toString()}`);
    },
    getById: (id: string) => request<{ success: boolean; data: any }>(`/products/${id}`),
    getByStore: (storeId: string) => request<{ success: boolean; data: any[] }>(`/products?storeId=${storeId}`),
    create: (data: any) => request<{ success: boolean; message: string; data: any }>('/products', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) => request<{ success: boolean; message: string; data: any }>(`/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    getCategories: () => request<{ success: boolean; data: any[] }>('/products/categories'),
};

// Order APIs
export const orderApi = {
    list: (params?: { status?: string; search?: string; page?: number; limit?: number }) => {
        const query = new URLSearchParams();
        if (params?.status) query.set('status', params.status);
        if (params?.search) query.set('search', params.search);
        if (params?.page) query.set('page', params.page.toString());
        if (params?.limit) query.set('limit', params.limit.toString());
        return request<{ success: boolean; data: any[]; pagination: any }>(`/orders?${query.toString()}`);
    },
    getById: (id: string) => request<{ success: boolean; data: any }>(`/orders/${id}`),
    trackByCode: (code: string) => request<{ success: boolean; data: any }>(`/orders/track/${code}`),
    create: (data: any) => request<{ success: boolean; message: string; data: any }>('/orders', { method: 'POST', body: JSON.stringify(data) }),
    updateStatus: (id: string, status: string) => request<{ success: boolean; message: string; data: any }>(`/orders/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),
};

// User APIs
export const userApi = {
    list: (params?: { role?: string; status?: string; search?: string; page?: number; limit?: number }) => {
        const query = new URLSearchParams();
        if (params?.role) query.set('role', params.role);
        if (params?.status) query.set('status', params.status);
        if (params?.search) query.set('search', params.search);
        if (params?.page) query.set('page', params.page.toString());
        if (params?.limit) query.set('limit', params.limit.toString());
        return request<{ success: boolean; data: any[]; pagination: any }>(`/users?${query.toString()}`);
    },
    getById: (id: number) => request<{ success: boolean; data: any }>(`/users/${id}`),
    create: (data: any) => request<{ success: boolean; message: string; data: any }>('/users', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: number, data: any) => request<{ success: boolean; message: string; data: any }>(`/users/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    toggleLock: (id: number) => request<{ success: boolean; message: string; data: any }>(`/users/${id}/toggle-lock`, { method: 'PUT' }),
    delete: (id: number) => request<{ success: boolean; message: string }>(`/users/${id}`, { method: 'DELETE' }),
    bulkLock: (ids: number[]) => request<{ success: boolean; message: string }>('/users/bulk/lock', { method: 'PUT', body: JSON.stringify({ ids }) }),
    bulkDelete: (ids: number[]) => request<{ success: boolean; message: string }>('/users/bulk/delete', { method: 'POST', body: JSON.stringify({ ids }) }),
    login: (email: string, password: string) => request<{ success: boolean; token: string; user: any }>('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
};

// Voucher APIs
export const voucherApi = {
    list: () => request<{ success: boolean; data: any[] }>('/vouchers'),
    create: (data: any) => request<{ success: boolean; message: string; data: any }>('/vouchers', { method: 'POST', body: JSON.stringify(data) }),
    toggle: (id: number) => request<{ success: boolean; message: string }>(`/vouchers/${id}/toggle`, { method: 'PUT' }),
};

// Payment APIs
export const paymentApi = {
    createPayment: (data: any) => request<{ success: boolean; data: any }>('/payments', { method: 'POST', body: JSON.stringify(data) }),
    getTransactions: (userId?: number) => {
        const query = userId ? `?userId=${userId}` : '';
        return request<{ success: boolean; data: any[] }>(`/payments/transactions${query}`);
    },
};

// Loyalty APIs
export const loyaltyApi = {
    getPoints: (userId: number) => request<{ success: boolean; data: any }>(`/loyalty/points/${userId}`),
    getTiers: () => request<{ success: boolean; data: any[] }>('/loyalty/tiers'),
    getHistory: (userId: number) => request<{ success: boolean; data: any[] }>(`/loyalty/history/${userId}`),
};

// Notification APIs
export const notificationApi = {
    list: () => request<{ success: boolean; data: any[] }>('/notifications'),
    send: (data: any) => request<{ success: boolean; message: string }>('/notifications/send', { method: 'POST', body: JSON.stringify(data) }),
};

// Dashboard / Analytics
export const dashboardApi = {
    getKpi: () => request<{ success: boolean; data: any }>('/analytics/kpi'),
    getRevenueChart: () => request<{ success: boolean; data: any[] }>('/analytics/revenue'),
    getTopProducts: () => request<{ success: boolean; data: any[] }>('/analytics/top-products'),
    getRecentOrders: () => request<{ success: boolean; data: any[] }>('/analytics/recent-orders'),
    getStoreRanking: () => request<{ success: boolean; data: any[] }>('/analytics/store-ranking'),
};