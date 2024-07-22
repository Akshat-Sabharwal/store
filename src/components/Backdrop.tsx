import { FC, ReactNode } from "react";

type BackdropProps = {
  children: ReactNode;
};

export const Backdrop: FC<BackdropProps> = ({ children }) => {
  return (
    <div className="flex justify-between items-start w-screen h-screen p-2 lg:p-8 gap-20 bg-accent-400 overflow-y-hidden">
      {children}
    </div>
  );
};
