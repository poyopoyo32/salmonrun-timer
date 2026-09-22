"use client";

import { BOSS_SPAWN_TABLE } from "@/data/bossSpawnTable";
import Classes from "./spawnTable.module.css";

export default function SpawnTable({ room }) {
  const roomData = BOSS_SPAWN_TABLE[room];
  if (!roomData) return null;

  return (
    <div className={Classes.container}>
      <p className={Classes.vp}>
        {room}개방 · VP {roomData.vp}
      </p>

      {roomData.waves.map((w) => {
        const times = Object.keys(w.spawns)
          .map(Number)
          .sort((a, b) => b - a); // 100 → 28 순서

        return (
          <div key={w.wave} className={Classes.waveBlock}>
            <p className={Classes.waveLabel}>
              {w.wave}웨이브 (금알 {w.gold} · 총 {w.total}기)
            </p>
            <table className={Classes.table}>
              <thead>
                <tr>
                  {times.map((t) => (
                    <th key={t}>{t}s</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  {times.map((t) => (
                    <td key={t}>{w.spawns[t]}</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
}