import styles from "./intros.module.css";

export function LevelCompletedIntro() {
  return (
    <div className={`${styles.IntroContainer} ${styles.LevelCompleted}`}>
      <h1 className="text-5xl">Win</h1>
    </div>
  );
}
