"use client";

import { useState, useEffect, useRef } from "react";
import Classes from "./page.module.css";
import spawntimes from "@/data/spawntimes.js";
import {TIME_CONFIG, LAST_WAVE, ROOM_TO_STACK } from "@/data/timerConfig.js";
import DifficultySelector from "@/component/difficultySelector/difficultySelector.js";
import StartButton from "@/component/startbutton/startbutton.js";

export default function page() {
  

  const sounds = useRef({});
  const played = useRef([]);

  const [time, setTime] = useState(TIME_CONFIG.INITIAL_TIME);
  const [wave, setWave] = useState(TIME_CONFIG.INITIAL_WAVE);
  const [running, setRunning] = useState(false);

  const [room, setRoom] = useState(26);
  const stack = ROOM_TO_STACK[room]; 

  const [bossAlliance, setBossAlliance] = useState(false);

  const [isExtraWave, setIsExtraWave] = useState(false);

  function resetGame() {
    played.current = [];
    setTime(TIME_CONFIG.INITIAL_TIME);
    setWave(TIME_CONFIG.INITIAL_WAVE);
    setRunning(false);
    setIsExtraWave(false);
    setBossAlliance(false);
  }

  async function unlockSounds() {
      const flatList = Object.values(sounds.current).flatMap((v) =>
      Array.isArray(v) ? v : [v]
    );
    for (const audio of flatList) {
      audio.volume = 0;
      try {
        await audio.play();
        audio.pause();
        audio.currentTime = 0;
      } catch (e) {
        console.error(e);
      }
      audio.volume = 0.7;
    }
  }

  function playRandomCountdown() {
  const pool = sounds.current.countdown;
  const idx = Math.floor(Math.random() * pool.length);
  playSound(pool[idx]);
  }
    

  async function startGame() {
    await unlockSounds();

    played.current = [];
    setTime(TIME_CONFIG.GAME_START);
    setWave(1);
    setRunning(true);
  }

  function startWave(waveNumber) {
    played.current = [];
    setWave(waveNumber);
    setTime(TIME_CONFIG.PRE_START); // 107초
    setRunning(true);
  }

  function startExtraWave() {
    played.current = [];
    setWave("EXTRA");
    setTime(TIME_CONFIG.EXTRA_START);
    setIsExtraWave(true);
    setRunning(true);
  }

  async function startExtraWaveDirect() {
    await unlockSounds();
    played.current = [];
    setWave("EXTRA");
    setTime(TIME_CONFIG.EXTRA_START);
    setIsExtraWave(true);
    setBossAlliance(true);
    setRunning(true);
  }

  function nextWave() {
    played.current = [];

    if (isExtraWave) { // EXTRA wave 종료 처리 추가
    setRunning(false);
    setTimeout(() => {
      resetGame();
    }, 1000);
    return;
  }

    if (wave === 1) {
      setWave(2);
      setTime(TIME_CONFIG.WAVE_START);
      return;
    }
    if (wave === 2) {
      setWave(LAST_WAVE);
      setTime(TIME_CONFIG.WAVE_START);
      return;
    }
    
    if (wave === LAST_WAVE) {
      if (bossAlliance) {
        startExtraWave();
      } else {
        setRunning(false);
        setTimeout(() => {
          resetGame();
        }, 1000);
      }
    }
  }
  function playSound(audio) {
    audio.currentTime = 0; // 처음부터 재생
    audio.play();
  }

  function getSound(target) {
    if (target === 100) {
      return sounds.current.start;
    }
    if (target === 28) {
      return sounds.current.start;
    }
    if (
      (stack === "26-27" && target === 38) ||
      (stack === "28-29" && target === 37) ||
      (stack === "30" && target === 36)
    ) {
      return sounds.current.prepare;
    }
    if (isExtraWave && target === 42) {
      return sounds.current.prepare;
    }
    return sounds.current.spawn;
  }

  function adjustTime(value) {
    if (!running) return;
    setTime((prev) => {
      if (typeof prev !== "number") return prev;
      return prev + value;
    });
  }

  useEffect(() => {
    sounds.current = {
      start: new Audio("/sound/start.wav"),
      spawn: new Audio("/sound/spawn.wav"),
      prepare: new Audio("/sound/prepare.wav"),
      mid: new Audio("/sound/mid.wav"),
      last: new Audio("/sound/last.wav"),
      warning: new Audio("/sound/warning.wav"),
      end: new Audio("/sound/end.wav"),
      countdown: Array.from({ length: 10 }, (_, i) => new Audio(`/sound/countdown/${i}.wav`)),
    };
    const flatList = Object.values(sounds.current).flatMap((v) =>
    Array.isArray(v) ? v : [v]
  );
  flatList.forEach((audio) => {
    audio.preload = "auto";
    audio.volume = 1;
  });
    Object.values(sounds.current).forEach((audio) => {
      audio.preload = "auto";
      audio.volume = 1;
    });
  }, []);

  useEffect(() => {
    if (!running) return;

    const timer = setInterval(() => {
      setTime((prev) => {
        if (typeof prev !== "number") return prev;
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [running]);

  useEffect(() => {
    if (typeof time !== "number") return;

    const targets = isExtraWave
    ? spawntimes.extra
    : spawntimes[stack];

    targets.forEach((target) => {
      

      if (
        target !== 100 &&
        (time === target + 3 || time === target + 2 || time === target + 1)
      ) {
        playSound(sounds.current.warning);
      }

      

      if (time === target && !played.current.includes(target)) {
        playSound(getSound(target));
        played.current.push(target);
      }
    });
    if (time >= 101 && time <= 110) {
      playRandomCountdown();
    }

    if (time <= 10 && time >= 1) {
      playRandomCountdown();
    }
    
    // if (time === 64) {
    //   playSound(sounds.current.mid);
    // }
    const endTime =
      wave === LAST_WAVE && !isExtraWave
        ? TIME_CONFIG.FINAL_WAVE_END
        : isExtraWave
          ? TIME_CONFIG.EXTRA_WAVE_END
          : TIME_CONFIG.WAVE_END;
    if (time === endTime) {
      nextWave();
    }
  }, [time, wave, stack, isExtraWave]);

  return (
    <>
      <main className={Classes.centerfull}>
        <div className={Classes.container}>
          <div className={Classes.header}>거물연어 타이머</div>
          <h2>1웨이브 시작</h2>
          <DifficultySelector room={room} setRoom={setRoom} />

          <StartButton
            running={running}
            resetGame={resetGame}
            startGame={startGame}
          />

          <p className={Classes.setTimer}>
            WAVE : {wave} | 시간 : {time}
          </p>
          <button
            className={Classes.stackButton}
            style={{
              backgroundColor: bossAlliance ? "#d9534f" : undefined,
              color: bossAlliance ? "#fff" : undefined,
            }}
            onClick={() => setBossAlliance((prev) => !prev)}
          >
            두목연합 출현! {bossAlliance ? "ON" : "OFF"}
          </button>
          <div className={Classes.stackButtonContainer}>
            <button
              className={Classes.stackButton}
              onClick={() => adjustTime(1)}
            >
              +1
            </button>
            <button
              className={Classes.stackButton}
              onClick={() => adjustTime(-1)}
            >
              -1
            </button>
          </div>
          <div className={Classes.stackButtonContainer}>
            <button
              className={Classes.stackButton}
              onClick={() => startWave(1)}
            >
              W1 7초
            </button>
            <button
              className={Classes.stackButton}
              onClick={() => startWave(2)}
            >
              W2 7초
            </button>
            <button
              className={Classes.stackButton}
              onClick={() => startWave(3)}
            >
              W3 7초
            </button>
          </div>
          <div className={Classes.stackButtonContainer}>
            <button
              className={Classes.stackButtonWide}
              style={{ backgroundColor: "#d9534f", color: "#fff" }}
              onClick={startExtraWaveDirect}
            >
              두목연합 바로 시작 <br /> (104초부터)
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
