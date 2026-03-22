import { useState, useEffect } from 'react';

let toastQueue = [];
let toastListener = null;

export const showToast = (message, type = 'success') => {
  if (toastListener) {
    toastListener({ message, type, id: Date.now() });
  }
};

export default function Toast() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    toastListener = (toast) => {
      setToasts(prev => [...prev, toast]);
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== toast.id));
      }, 3000);
    };
    return () => { toastListener = null; };
  }, []);

  const icons = {
    success: '✅',
    error:   '❌',
    info:    'ℹ️',
    warning: '⚠️',
  };

  const colors = {
    success: 'bg-green-700',
    error:   'bg-red-600',
    info:    'bg-blue-700',
    warning: 'bg-orange-500',
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map(toast => (
        <div key={toast.id}
          className={`${colors[toast.type]} text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-3 min-w-64 animate-pulse`}
        >
          <span>{icons[toast.type]}</span>
          <p className="text-sm font-bold">{toast.message}</p>
        </div>
      ))}
    </div>
  );
}