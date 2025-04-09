import * as React from "react";

const TOAST_LIMIT = 5;
const TOAST_REMOVE_DELAY = 1000000;

type ToastActionElement = React.ReactElement;

type ToastType = "default" | "destructive" | "success";

export type Toast = {
  id: string;
  title?: string;
  description?: string;
  action?: ToastActionElement;
  type?: ToastType;
  duration?: number;
  variant?: "default" | "destructive";
};

type ToasterToast = Toast & {
  dismiss: () => void;
};

interface ToastContextValue {
  toasts: ToasterToast[];
  addToast: (toast: Toast) => void;
  dismissToast: (toastId: string) => void;
}

const ToastContext = React.createContext<ToastContextValue>({
  toasts: [],
  addToast: () => {},
  dismissToast: () => {},
});

export function useToast() {
  const { addToast, dismissToast, toasts } = React.useContext(ToastContext);

  return {
    toast: (props: Toast) => {
      addToast({ ...props, id: crypto.randomUUID() });
    },
    dismiss: (toastId?: string) => {
      if (toastId) {
        dismissToast(toastId);
      }
    },
    toasts,
  };
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToasterToast[]>([]);

  const addToast = React.useCallback((toast: Toast) => {
    setToasts((prevToasts) => {
      const newToast: ToasterToast = {
        ...toast,
        id: toast.id || crypto.randomUUID(),
        dismiss: () => dismissToast(toast.id || ""),
      };

      return [...prevToasts, newToast].slice(-TOAST_LIMIT);
    });
  }, []);

  const dismissToast = React.useCallback((toastId: string) => {
    setToasts((prevToasts) =>
      prevToasts.filter((toast) => toast.id !== toastId)
    );
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, dismissToast }}>
      {children}
    </ToastContext.Provider>
  );
}
