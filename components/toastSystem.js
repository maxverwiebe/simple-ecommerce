import React, { useEffect, useState, useCallback } from "react";

function Toast({ id, message, onRemove, duration = 3000 }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(id);
    }, duration);
    return () => clearTimeout(timer);
  }, [id, duration, onRemove]);

  return (
    <div className="bg-green-500 text-white px-4 py-2 rounded shadow flex items-center">
      <span className="flex-grow">{message}</span>
      <button
        onClick={() => onRemove(id)}
        aria-label="Schließen"
        className="ml-2 text-white font-bold"
      >
        ×
      </button>
    </div>
  );
}

export function ToastContainer({ toasts, removeToast }) {
  return (
    <div className="fixed bottom-4 right-4 flex flex-col space-y-2 z-50">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          id={toast.id}
          message={toast.message}
          onRemove={removeToast}
        />
      ))}
    </div>
  );
}

export function useToasts() {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, duration) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, duration }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return { toasts, addToast, removeToast };
}
