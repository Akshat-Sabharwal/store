import { FC, ReactNode } from "react";

type BackdropProps = {
  children: ReactNode;
};

export const Backdrop: FC<BackdropProps> = ({ children }) => {
  return (
    <div className="flex justify-between items-start w-screen min-h-screen max-h-screen p-2 sm:p-4 md:p-8 gap-20 bg-accent-400 overflow-y-hidden">
      {children}
    </div>
  );
};
