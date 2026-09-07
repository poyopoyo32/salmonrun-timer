import Classes from "@/component/startbutton/startbutton.module.css";

export default function StartButton({ running, resetGame, startGame }) {
  return (
    <div className={Classes.startButtonContainer}>
      <button
        className={`${Classes.Button} ${
          running ? Classes.resetButton : Classes.startButton
        }`}
        onClick={running ? resetGame : startGame}
      >
        {running ? "RESET" : "START"}
      </button>
    </div>
  );
}
