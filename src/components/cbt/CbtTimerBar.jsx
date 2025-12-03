'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, AlertTriangle } from 'lucide-react';

export default function CbtTimerBar({ timeLeft, totalDuration }) {
  const [isLowTime, setIsLowTime] = useState(false);
  
  // Convert ms to MM:SS
  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const percentage = Math.min(100, Math.max(0, (timeLeft / totalDuration) * 100));

  useEffect(() => {
    // 5 minutes = 300000 ms
    if (timeLeft < 300000 && !isLowTime) {
      setIsLowTime(true);
    }
  }, [timeLeft, isLowTime]);

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] bg-base-100 shadow-md border-b border-base-200">
      <div className="h-1 w-full bg-base-200">
        <motion.div 
          className={`h-full ${isLowTime ? 'bg-error' : 'bg-primary'}`}
          initial={{ width: '100%' }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "linear" }}
        />
      </div>
      
      <div className="container mx-auto px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2 font-mono text-lg font-bold">
          <Clock className={`w-5 h-5 ${isLowTime ? 'text-error animate-pulse' : 'text-primary'}`} />
          <span className={isLowTime ? 'text-error' : 'text-base-content'}>
            {formatTime(timeLeft)}
          </span>
        </div>
        
        {isLowTime && (
          <div className="flex items-center gap-2 text-error text-xs md:text-sm font-bold animate-pulse">
            <AlertTriangle className="w-4 h-4" />
            <span>Less than 5 mins!</span>
          </div>
        )}
      </div>
    </div>
  );
}
