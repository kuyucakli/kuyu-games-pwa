import styles from "./intros.module.css";

export function LevelCompletedIntro() {
  return (
    <div className={`${styles.IntroContainer}`}>
      <h1 className="text-5xl">Win</h1>
    </div>
  );
}
