import Classes from "@/component/difficultySelector/difficultySelector.module.css";

const ROOMS = [26, 27, 28, 29, 30];

export default function DifficultySelector({ room, setRoom }) {
  return (
    <div className={Classes.difficultySelectorContainer}>
      <button
        className={
          room === 26
            ? `${Classes.selected} ${Classes.difficultySelector}`
            : Classes.difficultySelector
        }
        onClick={() => setRoom(26)}
      >
        26
      </button>

      <button
        className={
          room === 27
            ? `${Classes.selected} ${Classes.difficultySelector}`
            : Classes.difficultySelector
        }
        onClick={() => setRoom(27)}
      >
        27
      </button>

      <button
        className={
          room === 28
            ? `${Classes.selected} ${Classes.difficultySelector}`
            : Classes.difficultySelector
        }
        onClick={() => setRoom(28)}
      >
        28
      </button>

      <button
        className={
          room === 29
            ? `${Classes.selected} ${Classes.difficultySelector}`
            : Classes.difficultySelector
        }
        onClick={() => setRoom(29)}
      >
        29
      </button>

      <button
        className={
          room === 30
            ? `${Classes.selected} ${Classes.difficultySelector}`
            : Classes.difficultySelector
        }
        onClick={() => setRoom(30)}
      >
        30
      </button>
    </div>
  );
}
