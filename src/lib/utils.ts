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

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}
