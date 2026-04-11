"use client";

import { useEffect } from "react";

export function PwaProvider() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) {
      return;
    }

    const isLocalhost = ["localhost", "127.0.0.1"].includes(window.location.hostname);

    if (process.env.NODE_ENV !== "production" || isLocalhost) {
      const cleanup = async () => {
        const registrations = await navigator.serviceWorker.getRegistrations();
        await Promise.all(registrations.map((registration) => registration.unregister()));

        if ("caches" in window) {
          const cacheKeys = await window.caches.keys();
          await Promise.all(cacheKeys.map((key) => window.caches.delete(key)));
        }
      };

      void cleanup();
      return;
    }

    const register = async () => {
      try {
        await navigator.serviceWorker.register("/sw.js", { updateViaCache: "none" });
      } catch {
        // Keep the app resilient when service worker registration is unavailable.
      }
    };

    void register();
  }, []);

  return null;
}
