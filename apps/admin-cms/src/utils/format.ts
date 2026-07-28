export const formatNumber = (num: number): string => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

export const formatPrice = (amount: number): string => {
    if (amount >= 1000000000) return (amount / 1000000000).toFixed(1) + ' tỷ';
    if (amount >= 1000000) return (amount / 1000000).toFixed(1) + ' tr';
    return formatNumber(amount);
};

export const formatFullPrice = (amount: number): string => {
    return formatNumber(amount) + '₫';
};