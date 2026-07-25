import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { StockStatus } from "../types";

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
  }).format(amount);
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getStockStatus(currentStock: number, threshold: number): StockStatus {
  if (currentStock === 0) return 'out_of_stock';
  if (currentStock <= threshold) return 'low_stock';
  return 'in_stock';
}

export function getGreeting(timeZone: string = 'Asia/Manila'): string {
  try {
    const hourStr = new Intl.DateTimeFormat('en-US', {
      timeZone,
      hour: 'numeric',
      hour12: false,
    }).format(new Date());

    const hour = parseInt(hourStr, 10);
    
    if (hour >= 5 && hour < 12) return "Good morning";
    if (hour >= 12 && hour < 18) return "Good afternoon";
    if (hour >= 18 && hour < 22) return "Good evening";
    return "Good night";
  } catch {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "Good morning";
    if (hour >= 12 && hour < 18) return "Good afternoon";
    if (hour >= 18 && hour < 22) return "Good evening";
    return "Good night";
  }
}

