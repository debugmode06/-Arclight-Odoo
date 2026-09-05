import { type ClassValue } from 'clsx';
/**
 * Merges Tailwind class names with clsx — prevents class conflicts.
 * Use this everywhere instead of template literals for conditional classes.
 *
 * @example cn('px-4 py-2', isActive && 'bg-primary-500', className)
 */
export declare function cn(...inputs: ClassValue[]): string;
/**
 * Format a number as currency
 */
export declare function formatCurrency(amount: number, currency?: string, locale?: string): string;
/**
 * Format a date to a human-readable string
 */
export declare function formatDate(date: Date | string, format?: 'short' | 'long' | 'relative'): string;
/**
 * Truncate a string to a maximum length
 */
export declare function truncate(str: string, maxLength: number): string;
/**
 * Generate initials from a name
 */
export declare function getInitials(name: string): string;
/**
 * Debounce a function
 */
export declare function debounce<T extends (...args: unknown[]) => void>(fn: T, delay: number): (...args: Parameters<T>) => void;
//# sourceMappingURL=utils.d.ts.map