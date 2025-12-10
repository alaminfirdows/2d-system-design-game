import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function opaqueId(prefix: string = '', length: number = 16): string {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let id = '';
  if (prefix) {
    id += prefix + '_';
  }
  for (let i = 0; i < (length - prefix.length); i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}
