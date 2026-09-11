import Classes from "@/component/difficultySelector/difficultySelector.module.css";

const ROOM_STYLE = {
  26: { base: Classes.roomGreen },
  27: { base: Classes.roomGreen, corner: Classes.cornerBR, cornerColor: "#ef9f27" },
  28: { base: Classes.roomYellow, corner: Classes.cornerBR, cornerColor: "#e24b4a" },
  29: { base: Classes.roomRed, corner: Classes.cornerTL, cornerColor: "#ef9f27" },
  30: { base: Classes.roomRed },
};

export default function DifficultySelector({ room, setRoom }) {
  return (
    <div className={Classes.difficultySelectorContainer}>
      {[26, 27, 28, 29, 30].map((r) => {
        const isSelected = room === r;
        const style = ROOM_STYLE[r];
        return (
          <button
            key={r}
            className={`${Classes.roomBtn} ${isSelected ? style.base : ""}`}
            onClick={() => setRoom(r)}
          >
            {r}
            {isSelected && style.corner && (
              <span
                className={style.corner}
                style={{ background: style.cornerColor }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}