import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, isValid, parseISO } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatINR(amount?: number | string) {
  const value = typeof amount === 'string' ? parseFloat(amount) : (amount ?? 0);
  try {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value as number);
  } catch (e) {
    return `₹${value}`;
  }
}

/**
 * Format a date with the given format string
 * Handles Date objects, Firestore Timestamps, strings, and numbers
 * Returns 'Recently' as fallback for invalid dates
 */
export function formatDate(date: any, formatStr: string = 'PPP'): string {
  try {
    let dateObj: Date;

    // Handle Firestore Timestamp
    if (date && typeof date === 'object' && 'toDate' in date) {
      dateObj = date.toDate();
    }
    // Handle Date object
    else if (date instanceof Date) {
      dateObj = date;
    }
    // Handle string or number
    else {
      dateObj = new Date(date);
    }

    // Check if date is valid
    if (isNaN(dateObj.getTime())) {
      return 'Recently';
    }

    return format(dateObj, formatStr);
  } catch (error) {
    return 'Recently';
  }
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

/**
 * Capitalize first letter of each word
 */
export function capitalize(text: string): string {
  return text.replace(/\b\w/g, (char) => char.toUpperCase());
}

/**
 * Generate initials from name
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Sleep utility for async operations
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
