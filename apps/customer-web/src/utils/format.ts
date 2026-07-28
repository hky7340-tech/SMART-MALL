export const formatNumber = (num: number): string => {
  // Use manual formatting to avoid hydration mismatch (toLocaleString differs Server vs Client)
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

export const formatPrice = (amount: number): string => {
  if (amount >= 1000000000) return (amount / 1000000000).toFixed(1) + 'B';
  if (amount >= 1000000) return (amount / 1000000).toFixed(1) + 'M';
  return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

export const formatFullPrice = (amount: number): string => {
  return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '₫';
};

export const formatDate = (date: string | Date): string => {
  const d = new Date(date);
  return d.toLocaleDateString('vi-VN', { year: 'numeric', month: '2-digit', day: '2-digit' });
};

export const formatDateTime = (date: string | Date): string => {
  const d = new Date(date);
  return d.toLocaleDateString('vi-VN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
};

export const formatPercent = (value: number): string => {
  return (value >= 0 ? '+' : '') + value.toFixed(1) + '%';
};

export const classNames = (...classes: (string | boolean | undefined | null)[]): string => {
  return classes.filter(Boolean).join(' ');
};

export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
};

export const truncate = (str: string, length: number): string => {
  if (!str) return '';
  if (str.length <= length) return str;
  return str.substring(0, length) + '...';
};

export const getInitials = (name: string): string => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

export const formatCount = (count: number): string => {
  return count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

export const formatRating = (rating: number): string => {
  return rating.toFixed(1);
};
