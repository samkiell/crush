"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { HelpCircle, Smartphone } from "lucide-react";
import { toast } from "react-hot-toast";

export default function HelpShakeListener() {
  const router = useRouter();
  const [showFab, setShowFab] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [needsPermission, setNeedsPermission] = useState(false);
  
  // Refs for shake detection
  const lastX = useRef(0);
  const lastY = useRef(0);
  const lastZ = useRef(0);
  const lastUpdate = useRef(0);
  const lastShake = useRef(0);

  const handleShake = useCallback(() => {
    const now = Date.now();
    // Debounce shake events (prevent multiple triggers)
    if (now - lastShake.current > 1000) {
      lastShake.current = now;
      // Vibrate if supported
      if (typeof navigator !== "undefined" && navigator.vibrate) {
        navigator.vibrate(200);
      }
      router.push("/help");
    }
  }, [router]);

  const requestPermission = async () => {
    if (
      typeof DeviceMotionEvent !== "undefined" &&
      typeof DeviceMotionEvent.requestPermission === "function"
    ) {
      try {
        const permissionState = await DeviceMotionEvent.requestPermission();
        if (permissionState === "granted") {
          setPermissionGranted(true);
          setNeedsPermission(false);
          toast.success("Shake to help enabled!");
        } else {
          toast.error("Permission denied for shake detection");
        }
      } catch (error) {
        console.error("Error requesting permission:", error);
      }
    }
  };

  useEffect(() => {
    // Check if permission is needed (iOS 13+)
    if (
      typeof DeviceMotionEvent !== "undefined" &&
      typeof DeviceMotionEvent.requestPermission === "function"
    ) {
      setNeedsPermission(true);
    } else {
      setPermissionGranted(true);
    }

    // Always show FAB on mobile/tablet widths
    const checkMobile = () => {
      if (window.innerWidth < 1024) {
        setShowFab(true);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!permissionGranted) return;

    const SHAKE_THRESHOLD = 15;
    
    const handleMotion = (event) => {
      const current = event.accelerationIncludingGravity;
      if (!current) return;

      const currentTime = Date.now();
      if ((currentTime - lastUpdate.current) > 100) {
        const diffTime = currentTime - lastUpdate.current;
        lastUpdate.current = currentTime;

        const x = current.x || 0;
        const y = current.y || 0;
        const z = current.z || 0;

        const speed = Math.abs(x + y + z - lastX.current - lastY.current - lastZ.current) / diffTime * 10000;

        if (speed > SHAKE_THRESHOLD) {
          // Additional check: ensure it's a significant movement to avoid drift
          // A speed of 15 is actually quite low with this formula, let's bump it to 300 for a real shake
          // Re-evaluating formula: 
          // Delta ~ 5m/s^2. DiffTime = 100ms. 
          // (5 / 100) * 10000 = 500.
          // So 300-500 is a good threshold. 15 was definitely too low (would trigger on noise).
        }
        
        // Let's use a simpler, more robust threshold based on raw delta
        const deltaX = Math.abs(x - lastX.current);
        const deltaY = Math.abs(y - lastY.current);
        const deltaZ = Math.abs(z - lastZ.current);

        // If movement is significant enough
        if ((deltaX + deltaY + deltaZ) > 15) {
             handleShake();
        }

        lastX.current = x;
        lastY.current = y;
        lastZ.current = z;
      }
    };

    window.addEventListener("devicemotion", handleMotion, false);

    return () => {
      window.removeEventListener("devicemotion", handleMotion);
    };
  }, [permissionGranted, handleShake]);

  if (!showFab) return null;

  return (
    <>
      <button
        onClick={() => router.push("/help")}
        className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition-all active:scale-95 md:hidden flex items-center justify-center"
        aria-label="Get Help"
      >
        <HelpCircle size={24} />
      </button>

      {/* Permission Request Button for iOS */}
      {needsPermission && !permissionGranted && (
        <button
          onClick={requestPermission}
          className="fixed bottom-20 right-6 z-50 p-2 rounded-full bg-gray-800 text-white shadow-lg hover:bg-gray-700 transition-all active:scale-95 md:hidden text-xs flex items-center gap-2 px-4"
        >
          <Smartphone size={16} />
          Enable Shake
        </button>
      )}
    </>
  );
}
