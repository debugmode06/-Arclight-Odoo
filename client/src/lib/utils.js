import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
/**
 * Merges Tailwind class names with clsx — prevents class conflicts.
 * Use this everywhere instead of template literals for conditional classes.
 *
 * @example cn('px-4 py-2', isActive && 'bg-primary-500', className)
 */
export function cn(...inputs) {
    return twMerge(clsx(inputs));
}
/**
 * Format a number as currency
 */
export function formatCurrency(amount, currency = 'USD', locale = 'en-US') {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);
}
/**
 * Format a date to a human-readable string
 */
export function formatDate(date, format = 'short') {
    const d = new Date(date);
    if (format === 'relative') {
        const now = new Date();
        const diff = now.getTime() - d.getTime();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        if (days === 0)
            return 'Today';
        if (days === 1)
            return 'Yesterday';
        if (days < 7)
            return `${days} days ago`;
    }
    return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: format === 'long' ? 'long' : 'short',
        day: 'numeric',
    });
}
/**
 * Truncate a string to a maximum length
 */
export function truncate(str, maxLength) {
    if (str.length <= maxLength)
        return str;
    return `${str.slice(0, maxLength)}...`;
}
/**
 * Generate initials from a name
 */
export function getInitials(name) {
    return name
        .split(' ')
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() ?? '')
        .join('');
}
/**
 * Debounce a function
 */
export function debounce(fn, delay) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), delay);
    };
}
//# sourceMappingURL=utils.js.map