"use client";

import { useState, useEffect, useRef } from "react";
import Classes from "./page.module.css";
import spawntimes from "@/data/spawntimes.js";
import SpawnTable from "@/component/spawnTable/spawnTable.js";
import {TIME_CONFIG, LAST_WAVE, ROOM_TO_STACK } from "@/data/timerConfig.js";
import { useSounds } from "@/hooks/useSounds.js";
import { useCountdown } from "@/hooks/useCountdown.js";
import DifficultySelector from "@/component/difficultySelector/difficultySelector.js";
import StartButton from "@/component/startbutton/startbutton.js";

export default function page() {
  
  const { time, setTime, running, setRunning, adjustTime } = useCountdown();
  const { sounds, unlockSounds, playSound, playRandomCountdown } = useSounds();
  
  const played = useRef([]);

  const [wave, setWave] = useState(TIME_CONFIG.INITIAL_WAVE);
 

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
        <div className={Classes.layout}>
          <aside className={Classes.sidePanel}>
            {typeof wave === "number" && <SpawnTable room={room} wave={wave} />}
          </aside>
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
        </div>
      </main>
    </>
  );
}
