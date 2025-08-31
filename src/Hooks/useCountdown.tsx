import { useEffect, useRef, useState } from 'react';

interface CountDown {
  duration: number;
  expired?: () => void;
}

export default function useCountdown({ duration, expired }: CountDown) {
  const [time, setTime] = useState<number>(duration);
  const [isrunning, setIsRunning] = useState<boolean>(false);
  const TimeRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const start = () => {
    if (TimeRef.current) return;
    setIsRunning(true);
    TimeRef.current = setInterval(() => {
      setTime((prev) => {
        if (prev <= 1) {
          clear();
          expired?.();
          return 0;
        } else {
          return prev - 1;
        }
      });
    }, 1000);
  };

  const pause = () => {
    if (TimeRef.current) {
      clearInterval(TimeRef.current);
      TimeRef.current = null;
    }
    setIsRunning(false);
  };

  const reset = (newTime: number = duration) => {
    pause();
    setTime(newTime);
  };

  const clear = () => {
    if (TimeRef.current) {
      clearInterval(TimeRef.current);
      TimeRef.current = null;
    }
    setIsRunning(false);
  };

  useEffect(() => {
    return () => clear();
  }, []);

  const minutes = Math.floor(time / 60);
  const second = time % 60;
  const handleTime = `${String(minutes).padStart(2, '0')} : ${String(second).padStart(2, '0')}`;

  return { start, pause, reset, handleTime, isrunning };
}
