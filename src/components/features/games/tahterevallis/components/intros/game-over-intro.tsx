import styles from "./intros.module.css";

export function GameOverIntro() {
  return (
    <div className={`${styles.IntroContainer}`}>
      <h1 className="text-5xl">Game Over</h1>
    </div>
  );
}
