import Classes from "@/component/difficultySelector/difficultySelector.module.css";

export default function DifficultySelector({ stack, setDifficulty }) {
  return (
    <div className={Classes.difficultySelectorContainer}>
      <button
        className={
          stack === "26-27"
            ? `${Classes.selected} ${Classes.difficultySelector}`
            : Classes.difficultySelector
        }
        onClick={() => setDifficulty("26-27")}
      >
        26~27
      </button>

      <button
        className={
          stack === "28-29"
            ? `${Classes.selected} ${Classes.difficultySelector}`
            : Classes.difficultySelector
        }
        onClick={() => setDifficulty("28-29")}
      >
        28~29
      </button>

      <button
        className={
          stack === "30"
            ? `${Classes.selected} ${Classes.difficultySelector}`
            : Classes.difficultySelector
        }
        onClick={() => setDifficulty("30")}
      >
        30
      </button>
    </div>
  );
}
