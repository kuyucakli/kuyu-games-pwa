import { InputHTMLAttributes, PropsWithChildren } from "react";
import styles from "./form.module.css";

type InputTextProps = PropsWithChildren<
  InputHTMLAttributes<HTMLInputElement> & {
    error?: string[];
  }
>;

export function InputText({
  id,
  className,
  children,
  type,
  error,
  placeholder,
}: InputTextProps) {
  return (
    <label htmlFor={id}>
      <span>{id}</span>
      <input id={id} name={id} type={type} placeholder={placeholder} />
      <p className={`${styles.FormError}`}>
        {error && error.map((e) => <span key={e}>{e}</span>)}
      </p>
    </label>
  );
}
