import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function to merge class names using clsx and tailwind-merge
 * Helps to properly combine Tailwind CSS classes and handle conditional class application
 *
 * @param inputs - Array of class values (strings, objects, arrays) to be merged
 * @returns Merged class string with duplicate/fighting classes resolved
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
