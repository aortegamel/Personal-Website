import { type ClassValue, clsx } from 'clsx';
import { format, parseISO } from 'date-fns';

/**
 * Combines multiple class names and merges Tailwind CSS classes
 * @param inputs Class names to combine
 * @returns Combined class names
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/**
 * Formats a date string into a human-readable format
 * @param dateString ISO date string
 * @param formatStr Optional date format (defaults to 'MMMM d, yyyy')
 * @returns Formatted date string
 */
export function formatDate(dateString: string, formatStr: string = 'MMMM d, yyyy'): string {
  try {
    return format(parseISO(dateString), formatStr);
  } catch (error) {
    console.warn(`Invalid date format: ${dateString}`);
    return dateString;
  }
}
