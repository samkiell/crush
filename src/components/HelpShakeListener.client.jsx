"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { HelpCircle } from "lucide-react";

export default function HelpShakeListener() {
  const router = useRouter();
  const [showFab, setShowFab] = useState(false);

  const handleShake = useCallback(() => {
    router.push("/help");
  }, [router]);

  useEffect(() => {
    let lastX = 0;
    let lastY = 0;
    let lastZ = 0;
    let lastUpdate = 0;
    const SHAKE_THRESHOLD = 15;

    const handleMotion = (event) => {
      const current = event.accelerationIncludingGravity;
      if (!current) return;

      const currentTime = Date.now();
      if (currentTime - lastUpdate > 100) {
        const diffTime = currentTime - lastUpdate;
        lastUpdate = currentTime;

        const x = current.x || 0;
        const y = current.y || 0;
        const z = current.z || 0;

        const speed = Math.abs(x + y + z - lastX - lastY - lastZ) / diffTime * 10000;

        if (speed > SHAKE_THRESHOLD) {
          handleShake();
        }

        lastX = x;
        lastY = y;
        lastZ = z;
      }
    };

    // Check if device supports motion events
    if (typeof window !== "undefined" && "DeviceMotionEvent" in window) {
      window.addEventListener("devicemotion", handleMotion, false);
    } else {
      // Fallback if motion not supported
      setShowFab(true);
    }

    // Always show FAB on mobile widths as a visual cue/fallback
    const checkMobile = () => {
      if (window.innerWidth < 768) {
        setShowFab(true);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("devicemotion", handleMotion);
        window.removeEventListener('resize', checkMobile);
      }
    };
  }, [handleShake]);

  if (!showFab) return null;

  return (
    <button
      onClick={() => router.push("/help")}
      className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition-all active:scale-95 md:hidden"
      aria-label="Get Help"
    >
      <HelpCircle size={24} />
    </button>
  );
}
