import React from "react";
import styles from "@/styles/components/Button.module.scss";

type Variant = "primary" | "secondary" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  iconLeft,
  iconRight,
  isLoading,
  children,
  disabled,
  className,
  ...props
}) => {
  const classes = [
    styles.button,
    styles[variant],
    styles[size],
    isLoading || disabled ? styles.disabled : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button className={classes} disabled={disabled || isLoading} {...props}>
      {iconLeft && <span className={styles.icon}>{iconLeft}</span>}
      {isLoading ? "Loading..." : children}
      {iconRight && <span className={styles.icon}>{iconRight}</span>}
    </button>
  );
};
