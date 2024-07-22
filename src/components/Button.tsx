import { ComponentProps, FC, ReactNode } from "react";
import { FaSpinner } from "react-icons/fa";

type ButtonProps = ComponentProps<"button"> & {
  children: ReactNode;
  bgColor?: string;
  color?: string;
};

export const Button: FC<ButtonProps> = ({
  children,
  bgColor = "bg-accent-400",
  color = "text-accent-800",
  ...props
}) => {
  return (
    <button
      className={`${bgColor} ${color} rounded-md px-3 py-2 text-sm sm:text-xl`}
      {...props}
    >
      {props.disabled ? <FaSpinner className="animate-spin" /> : children}
    </button>
  );
};
