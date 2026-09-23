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
        {room}개방 · {wave}웨이브 (금알 {waveData.gold} · 총 {waveData.total}기)
      </p>

      <table className={Classes.table}>
        <tbody>
          {times.map((t) => (
            <tr key={t}>
              <td className={Classes.timeCell}>{t}s</td>
              <td className={Classes.countCell}>{waveData.spawns[t]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}