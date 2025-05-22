import { useEffect, useRef, useState } from 'react';

interface UseCountdownOptions {
  duration: number;
  onFinish?: () => void;
}

export const useCountdown = ({ duration, onFinish }: UseCountdownOptions) => {
  const [seconds, setSeconds] = useState(duration);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const formattedSeconds = () => {
    if (seconds < 0) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const start = () => {
    if (isRunning) {
      clearInterval(intervalRef.current!);
    }
    setSeconds(duration);
    setIsRunning(true);
  };

  const pause = () => {
    setIsRunning(false);
  };

  const reset = () => {
    setSeconds(duration);
    setIsRunning(false);
  };

  useEffect(() => {
    if (!isRunning) return;

    intervalRef.current = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          setIsRunning(false);
          onFinish?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current!);
  }, [isRunning, onFinish]);

  return {
    seconds,
    formattedSeconds,
    isRunning,
    start,
    pause,
    reset,
  };
};
