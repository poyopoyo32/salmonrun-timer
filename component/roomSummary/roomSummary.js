"use client";

import { BOSS_SPAWN_TABLE } from "@/data/bossSpawnTable";
import Classes from "./roomSummary.module.css";

export default function RoomSummary({ room }) {
  const roomData = BOSS_SPAWN_TABLE[room];
  if (!roomData) return null;

  return (
    <div className={Classes.container}>
      <p className={Classes.title}>
        {room}개방
        <br />
        VP {roomData.vp}
      </p>

      <table className={Classes.table}>
        <tbody>
          {roomData.waves.map((w) => (
            <tr key={w.wave}>
              <td className={Classes.waveCell}>{w.wave}웨</td>
              <td className={Classes.totalCell}>{w.total}기</td>
              <td className={Classes.goldCell}>{w.gold}개</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}