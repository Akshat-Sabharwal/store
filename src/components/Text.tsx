import { FC, ReactNode } from "react";

type TTextProps = {
  children: ReactNode;
};

export const Text: FC<TTextProps> = ({ children }) => {
  return <p className="text-accent-800 text-sm sm:text-xl">{children}</p>;
};
