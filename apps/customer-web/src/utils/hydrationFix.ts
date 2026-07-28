// Format number with dots as thousand separators (consistent between Server & Client)
// Using .toLocaleString() causes hydration errors because Node.js server uses en-US (commas)
// while browsers use vi-VN locale (dots)
export const safeFormatNumber = (num: number): string => {
    return Math.floor(num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

export const safeFormatPrice = (price: number): string => {
    return safeFormatNumber(price) + '₫';
};