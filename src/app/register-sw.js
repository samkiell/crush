"use client";

import { useEffect } from "react";
import { toast } from "react-hot-toast";

export default function RegisterSW() {
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      const wb = window.workbox;

      // If window.workbox is not defined, we might need to import it or rely on next-pwa's injection.
      // However, since we are doing a custom implementation, we should use the standard registration or workbox-window.

      // We'll use a dynamic import to avoid SSR issues with workbox-window if needed,
      // but standard navigator.serviceWorker.register is often enough.
      // Let's use the standard approach but add listeners.

      const register = async () => {
        try {
          const registration = await navigator.serviceWorker.register("/sw.js");

          registration.addEventListener("updatefound", () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener("statechange", () => {
                if (
                  newWorker.state === "installed" &&
                  navigator.serviceWorker.controller
                ) {
                  // New content available
                  toast(
                    (t) => (
                      <div className="flex flex-col gap-2">
                        <span>New version available!</span>
                        <button
                          className="btn btn-xs btn-primary"
                          onClick={() => {
                            newWorker.postMessage({ type: "SKIP_WAITING" });
                            toast.dismiss(t.id);
                            window.location.reload();
                          }}
                        >
                          Update Now
                        </button>
                      </div>
                    ),
                    { duration: 10000, icon: "🚀" }
                  );
                }
              });
            }
          });

          console.log(
            "Service Worker registered with scope:",
            registration.scope
          );
        } catch (error) {
          console.error("Service Worker registration failed:", error);
        }
      };

      register();

      // Handle controller change (reload to activate new SW immediately if needed)
      let refreshing = false;
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        if (!refreshing) {
          window.location.reload();
          refreshing = true;
        }
      });
    }
  }, []);

  return null;
}
