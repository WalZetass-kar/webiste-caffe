"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type ToastProps = {
  id: string;
  title: string;
  message: string;
  type?: "success" | "info" | "warning" | "error";
  duration?: number;
  onClose: (id: string) => void;
};

export function Toast({ id, title, message, type = "info", duration = 5000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Entrance animation
    setTimeout(() => setIsVisible(true), 10);

    // Auto dismiss
    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => {
      onClose(id);
    }, 300);
  };

  const getIcon = () => {
    switch (type) {
      case "success":
        return "✓";
      case "error":
        return "✕";
      case "warning":
        return "!";
      default:
        return "i";
    }
  };

  const getColors = () => {
    switch (type) {
      case "success":
        return "border-green-200 bg-green-50 text-green-900";
      case "error":
        return "border-red-200 bg-red-50 text-red-900";
      case "warning":
        return "border-yellow-200 bg-yellow-50 text-yellow-900";
      default:
        return "border-[#5a4a3a]/20 bg-white text-[#3d3027]";
    }
  };

  return (
    <div
      className={cn(
        "pointer-events-auto w-full max-w-sm overflow-hidden rounded-2xl border shadow-lg transition-all duration-300",
        getColors(),
        isVisible && !isLeaving
          ? "translate-x-0 opacity-100"
          : "translate-x-full opacity-0"
      )}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-current/10">
            <span className="text-sm font-bold">{getIcon()}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm truncate">{title}</p>
            <p className="mt-1 text-sm opacity-90 line-clamp-2 break-words">{message}</p>
          </div>
          <button
            onClick={handleClose}
            className="flex-shrink-0 text-current opacity-50 hover:opacity-100 transition-opacity"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
      {/* Progress bar */}
      <div className="h-1 bg-current opacity-20">
        <div
          className="h-full bg-current opacity-50 transition-all ease-linear"
          style={{
            width: isLeaving ? "0%" : "100%",
            transitionDuration: `${duration}ms`,
          }}
        />
      </div>
    </div>
  );
}

type ToastContainerProps = {
  toasts: Array<{
    id: string;
    title: string;
    message: string;
    type?: "success" | "info" | "warning" | "error";
    duration?: number;
  }>;
  onRemove: (id: string) => void;
};

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  return (
    <div className="pointer-events-none fixed top-4 right-4 z-50 flex flex-col gap-3 max-w-sm w-full">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onClose={onRemove} />
      ))}
    </div>
  );
}

// Hook for managing toasts
export function useToast() {
  const [toasts, setToasts] = useState<
    Array<{
      id: string;
      title: string;
      message: string;
      type?: "success" | "info" | "warning" | "error";
      duration?: number;
    }>
  >([]);

  const addToast = (
    title: string,
    message: string,
    type: "success" | "info" | "warning" | "error" = "info",
    duration = 5000
  ) => {
    const id = Math.random().toString(36).substring(7);
    setToasts((prev) => [...prev, { id, title, message, type, duration }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return {
    toasts,
    addToast,
    removeToast,
    success: (title: string, message: string) => addToast(title, message, "success"),
    error: (title: string, message: string) => addToast(title, message, "error"),
    warning: (title: string, message: string) => addToast(title, message, "warning"),
    info: (title: string, message: string) => addToast(title, message, "info"),
  };
}
