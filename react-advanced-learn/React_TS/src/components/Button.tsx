import type { FC } from "react";

//使用类型别名定义Button的props
type ButtonProps = {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  variant: "primary" | "secondary" | "tertiary";
};

export const Button: FC<ButtonProps> = ({
  label,
  onClick,
  disabled,
  variant,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`button-${variant}`}
    >
      {label}
    </button>
  );
};
