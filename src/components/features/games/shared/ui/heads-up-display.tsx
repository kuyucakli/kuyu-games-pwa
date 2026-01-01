import { HTMLAttributes, PropsWithChildren } from "react";
import styles from "../shared-ui.module.css";

const HUDLayer = ({ className, children }: HTMLAttributes<HTMLDivElement>) => {
  return <div className={`${styles.HUDLayer} ${className}`}>{children}</div>;
};
const HUDBox = ({
  label,
  content,
  className,
}: {
  label: string;
  content: string;
  className?: string;
}) => {
  return (
    <div className={`${styles.HUDBox}  ${className} `}>
      <span className={styles.HUDBoxLabel}>{label}</span>
      <span className={styles.HUDBoxContent}>{content}</span>
    </div>
  );
};

export { HUDLayer, HUDBox };
