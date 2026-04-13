"use client";

import { useEffect, useRef } from "react";
import type { OrderRecord } from "@/lib/models";

type UseOrderNotificationsProps = {
  orders: OrderRecord[];
  onNewOrder?: (order: OrderRecord) => void;
};

export function useOrderNotifications({ orders, onNewOrder }: UseOrderNotificationsProps) {
  const previousOrdersRef = useRef<OrderRecord[]>([]);
  const isInitialMount = useRef(true);

  useEffect(() => {
    // Skip on initial mount
    if (isInitialMount.current) {
      previousOrdersRef.current = orders;
      isInitialMount.current = false;
      return;
    }

    // Detect new orders
    const previousOrderIds = new Set(previousOrdersRef.current.map((o) => o.id));
    const newOrders = orders.filter((order) => !previousOrderIds.has(order.id));

    if (newOrders.length > 0) {
      newOrders.forEach((order) => {
        // Show browser notification
        showBrowserNotification(order);

        // Play sound
        playNotificationSound();

        // Call callback
        onNewOrder?.(order);
      });
    }

    previousOrdersRef.current = orders;
  }, [orders, onNewOrder]);

  return {
    requestPermission: requestNotificationPermission,
  };
}

function showBrowserNotification(order: OrderRecord) {
  if ("Notification" in window && Notification.permission === "granted") {
    const notification = new Notification("Pesanan Baru Masuk", {
      body: `${order.tableNumber} - ${order.customerName}\n${order.items.length} item(s)`,
      icon: "/icon-192x192.png",
      badge: "/icon-192x192.png",
      tag: order.id,
      requireInteraction: false,
      silent: false,
    });

    // Auto close after 5 seconds
    setTimeout(() => {
      notification.close();
    }, 5000);

    // Click handler
    notification.onclick = () => {
      window.focus();
      notification.close();
    };
  }
}

function playNotificationSound() {
  try {
    // Create a simple beep sound using Web Audio API
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 800;
    oscillator.type = "sine";

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  } catch (error) {
    // Fallback: try to play audio file if exists
    try {
      const audio = new Audio("/notification.mp3");
      audio.volume = 0.5;
      audio.play().catch(() => {
        // Ignore if fails
      });
    } catch {
      // Ignore sound errors
    }
  }
}

export function requestNotificationPermission() {
  if ("Notification" in window && Notification.permission === "default") {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        // Show test notification
        new Notification("Notifikasi Diaktifkan", {
          body: "Anda akan menerima notifikasi untuk pesanan baru",
          icon: "/icon-192x192.png",
        });
      }
    });
  }
}
