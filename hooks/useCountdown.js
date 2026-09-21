import { useState, useEffect } from "react";
import { TIME_CONFIG } from "@/data/timerConfig";

export function useCountdown() {
  const [time, setTime] = useState(TIME_CONFIG.INITIAL_TIME);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    // TODO: running이 true일 때만 setInterval로 time을 1초씩 감소
    //       (원본 page.js의 두 번째 useEffect 내용 옮기기)
    if (!running) return;

    const timer = setInterval(() => {
      setTime((prev) => {
        if (typeof prev !== "number") return prev;
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [running]);

  function adjustTime(value) {
    // TODO: running일 때만 time에 value를 더하는 로직
    //       (원본의 adjustTime 함수 옮기기)
    if (!running) return;
    setTime((prev) => {
      if (typeof prev !== "number") return prev;
      return prev + value;
    });
  }

  return {
    time,
    setTime,
    running,
    setRunning,
    adjustTime,
  };
}