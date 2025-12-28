import Image from "next/image";
import styles from "./select-game-intro.module.css";

export function SelectGameIntro() {
  return (
    <div className={`${styles.SelectGameIntro}`}>
      <div className={`${styles.MovingBallContainer}`}>
        <Image
          src="/assets/tahterevallis/images/intro-ball.png"
          alt="intro ball"
          width={566}
          height={566}
          className={`${styles.MovingBall}`}
          loading="eager"
        />
        <Image
          src="/assets/tahterevallis/images/intro-ball-trail.png"
          alt="intro ball trail"
          width="669"
          height="520"
          className={`${styles.MovingBallTrail}`}
          loading="eager"
        />
      </div>
    </div>
  );
}
