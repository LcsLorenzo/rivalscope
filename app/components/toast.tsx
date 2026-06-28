import { useState, useEffect, createContext, useContext, useCallback, type ReactNode } from "react";

type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
}

interface ToastContextValue {
  toast: (opts: Omit<Toast, "id">) => void;
  success: (title: string, description?: string) => void;
  error: (title: string, description?: string) => void;
  info: (title: string, description?: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback((opts: Omit<Toast, "id">) => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev.slice(-4), { ...opts, id }]);
    setTimeout(() => dismiss(id), 5000);
  }, [dismiss]);

  const success = useCallback((title: string, description?: string) =>
    toast({ type: "success", title, description }), [toast]);
  const error   = useCallback((title: string, description?: string) =>
    toast({ type: "error", title, description }), [toast]);
  const info    = useCallback((title: string, description?: string) =>
    toast({ type: "info", title, description }), [toast]);

  return (
    <ToastContext.Provider value={{ toast, success, error, info }}>
      {children}
      {/* Toast container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 w-80 pointer-events-none">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onDismiss={() => dismiss(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

const TOAST_STYLES: Record<ToastType, { bg: string; icon: string; bar: string }> = {
  success: { bg: "bg-white dark:bg-gray-800 border-green-200  dark:border-green-700",  icon: "✅", bar: "bg-green-500"  },
  error:   { bg: "bg-white dark:bg-gray-800 border-red-200    dark:border-red-700",    icon: "❌", bar: "bg-red-500"    },
  info:    { bg: "bg-white dark:bg-gray-800 border-indigo-200 dark:border-indigo-700", icon: "ℹ️", bar: "bg-indigo-500" },
  warning: { bg: "bg-white dark:bg-gray-800 border-amber-200  dark:border-amber-700",  icon: "⚠️", bar: "bg-amber-500"  },
};

function ToastItem({ toast: t, onDismiss }: { toast: Toast; onDismiss: () => void }) {
  const style = TOAST_STYLES[t.type];
  return (
    <div
      className={`pointer-events-auto border rounded-2xl shadow-lg overflow-hidden animate-slide-up ${style.bg}`}
    >
      <div className={`h-1 ${style.bar}`} />
      <div className="p-4 flex items-start gap-3">
        <span className="text-lg flex-shrink-0">{style.icon}</span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 dark:text-white">{t.title}</p>
          {t.description && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{t.description}</p>
          )}
        </div>
        <button
          onClick={onDismiss}
          className="text-gray-400 hover:text-gray-600 text-lg leading-none flex-shrink-0"
        >
          ×
        </button>
      </div>
    </div>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}
