"use client";

import { useState, useEffect, useRef } from "react";
import Classes from "./page.module.css";
import spawntimes from "@/data/spawntimes.js";
import DifficultySelector from "@/component/difficultySelector/difficultySelector.js";
import StartButton from "@/component/startbutton/startbutton.js";

export default function page() {
  const INITIAL_TIME = "-";
  const INITIAL_WAVE = "-";

  const GAME_START_TIME = 117;
  const WAVE_START_TIME = 112;
  const PRE_START_TIME = 107;
  const EXTRA_START_TIME = 105;
  const LAST_WAVE = 3;

  const WAVE_END_TIME = -8;

  const FINAL_WAVE_END_TIME = -16;

  const EXTRA_WAVE_END_TIME = -8;

  const sounds = useRef({});
  const played = useRef([]);

  const [time, setTime] = useState(INITIAL_TIME);
  const [wave, setWave] = useState(INITIAL_WAVE);
  const [running, setRunning] = useState(false);

  const [stack, setDifficulty] = useState("26-27");

  const [bossAlliance, setBossAlliance] = useState(false);

  const [isExtraWave, setIsExtraWave] = useState(false);

  function resetGame() {
    played.current = [];
    setTime(INITIAL_TIME);
    setWave(INITIAL_WAVE);
    setRunning(false);
    setIsExtraWave(false);
    setBossAlliance(false);
  }

  async function unlockSounds() {
    for (const audio of Object.values(sounds.current)) {
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

  async function startGame() {
    await unlockSounds();

    played.current = [];
    setTime(GAME_START_TIME);
    setWave(1);
    setRunning(true);
  }

  function startWave(waveNumber) {
    played.current = [];
    setWave(waveNumber);
    setTime(PRE_START_TIME); // 107초
    setRunning(true);
  }

  function startExtraWave() {
    played.current = [];
    setWave("EXTRA");
    setTime(EXTRA_START_TIME);
    setIsExtraWave(true);
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
      setTime(WAVE_START_TIME);
      return;
    }
    if (wave === 2) {
      setWave(LAST_WAVE);
      setTime(WAVE_START_TIME);
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
    };

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

    // if (time === 64) {
    //   playSound(sounds.current.mid);
    // }
    const endTime =
      wave === LAST_WAVE && !isExtraWave
        ? FINAL_WAVE_END_TIME
        : isExtraWave
          ? EXTRA_WAVE_END_TIME
          : WAVE_END_TIME;
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
          <DifficultySelector stack={stack} setDifficulty={setDifficulty} />

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
        </div>
      </main>
    </>
  );
}
