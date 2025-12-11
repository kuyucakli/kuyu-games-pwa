import { InputHTMLAttributes, PropsWithChildren } from "react";
import styles from "./form.module.css";

type InputTextProps = PropsWithChildren<
  InputHTMLAttributes<HTMLInputElement> & {
    error?: string[] | string;
  }
>;

export function InputText({
  id,
  type,
  error,
  placeholder,
  ...rest
}: InputTextProps) {
  let errorMessage;

  if (Array.isArray(error)) {
    errorMessage = error.map((e) => <span key={e}>{e}</span>);
  } else {
    errorMessage = error;
  }

  return (
    <label htmlFor={id}>
      <span>{id}</span>
      <input
        id={id}
        name={id}
        type={type}
        placeholder={placeholder}
        {...rest}
      />
      <p className={`${styles.FormError}`}>{errorMessage}</p>
    </label>
  );
}
