import React, { useState, useEffect } from 'react';
import { CheckCircle2, Sparkles, X } from 'lucide-react';

/**
 * Event emitter for triggering toast notifications anywhere in the app
 */
export const showToast = (message, type = 'success') => {
  if (typeof window !== 'undefined') {
    const event = new CustomEvent('app-toast', {
      detail: { message, type, id: Date.now() }
    });
    window.dispatchEvent(event);
  }
};

export const ToastContainer = () => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const handleToast = (e) => {
      const newToast = e.detail;
      setToasts((prev) => [...prev, newToast]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
      }, 3500);
    };

    window.addEventListener('app-toast', handleToast);
    return () => window.removeEventListener('app-toast', handleToast);
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[99999] flex flex-col gap-2.5 pointer-events-none select-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl bg-[#0a0a0c]/95 border border-white/15 text-white shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-bottom-5 duration-300 max-w-sm"
        >
          <div className="w-6 h-6 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <span className="text-xs font-mono text-gray-200">{toast.message}</span>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
