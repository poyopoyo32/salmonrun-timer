"use client";

import { BOSS_SPAWN_TABLE } from "@/data/bossSpawnTable";
import Classes from "./spawnTable.module.css";

export default function SpawnTable({ room, wave }) {
  const roomData = BOSS_SPAWN_TABLE[room];
  if (!roomData) return null;

  const waveData = roomData.waves.find((w) => w.wave === wave);
  if (!waveData) return null;

  const times = Object.keys(waveData.spawns)
    .map(Number)
    .sort((a, b) => b - a); 



  return (
    <div className={Classes.container}>
      <p className={Classes.vp}>
        {room}개방 · {wave}웨이브 
        < br />
        ({waveData.total}기 · {waveData.gold}개)
      </p>

      <table className={Classes.table}>
        <tbody>
          {times.map((t) => (
            <tr key={t}>
              <td className={Classes.timeCell}>{t}s</td>
              <td className={Classes.countCell}>{waveData.spawns[t]}</td>
              <td className={Classes.eggCell}>{toGoldEggCount(waveData.spawns[t])}개</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function toGoldEggCount(spawnValue) {
  if (typeof spawnValue === "number") {
    return spawnValue * 3;
  }
  // "3-4" 같은 범위 문자열 처리
  const [min, max] = spawnValue.split("-").map(Number);
  return `${min * 3}-${max * 3}`;
}