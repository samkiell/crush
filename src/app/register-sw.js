"use client";

import { useEffect } from "react";
import { toast } from "react-hot-toast";

export default function RegisterSW() {
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      const isDev = process.env.NODE_ENV === "development";

      const register = async () => {
        try {
          const registration = await navigator.serviceWorker.register("/sw.js");

          // In development, force update check immediately
          if (isDev) {
            await registration.update();
            console.log("Dev Mode: Forced SW update check");
          }

          // Check if there's a waiting worker (update ready but waiting)
          if (registration.waiting) {
            console.log("SW waiting... forcing update");
            registration.waiting.postMessage({ type: "SKIP_WAITING" });
          }

          registration.addEventListener("updatefound", () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener("statechange", () => {
                if (
                  newWorker.state === "installed" &&
                  navigator.serviceWorker.controller
                ) {
                  // New content is available
                  if (isDev) {
                    // In Dev: Auto-update immediately
                    console.log("Dev Mode: Auto-updating SW");
                    newWorker.postMessage({ type: "SKIP_WAITING" });
                  } else {
                    // In Prod: Show toast
                    toast(
                      (t) => (
                        <div className="flex flex-col gap-2">
                          <span>New version available!</span>
                          <button
                            className="btn btn-xs btn-primary"
                            onClick={() => {
                              newWorker.postMessage({ type: "SKIP_WAITING" });
                              toast.dismiss(t.id);
                            }}
                          >
                            Update Now
                          </button>
                        </div>
                      ),
                      { duration: 10000, icon: "🚀" }
                    );
                  }
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

      // Handle controller change (reload to activate new SW immediately)
      let refreshing = false;
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        if (!refreshing) {
          refreshing = true;
          window.location.reload();
        }
      });
    }
  }, []);

  return null;
}
