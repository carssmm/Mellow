'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export type ToastVariant = 'success' | 'error' | 'warning';

interface Toast {
  id: string;
  message: string;
  variant: ToastVariant;
}

interface ToastContextType {
  showToast: (message: string, variant: ToastVariant) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, variant: ToastVariant) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, variant }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[200] flex flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={cn(
              "px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 text-label-md animate-in slide-in-from-bottom-5 fade-in duration-300",
              toast.variant === 'success' && "bg-[#D1E6D3] text-[#1E3F20] border border-[#A3CBA6]",
              toast.variant === 'error' && "bg-error-container text-on-error-container",
              toast.variant === 'warning' && "bg-amber-100 text-amber-900 border border-amber-200"
            )}
          >
            <span className="material-symbols-outlined text-[20px]">
              {toast.variant === 'success' ? 'check_circle' : 
               toast.variant === 'error' ? 'error' : 'warning'}
            </span>
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
