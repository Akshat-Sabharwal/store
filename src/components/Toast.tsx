import { FC, useState } from "react";
import { IoCloseOutline } from "react-icons/io5";

type ToastProps = {
  message: string;
  duration: number;
};

export const Toast: FC<ToastProps> = (props) => {
  return (
    <div className="hidden relative flex justify-start items-center gap-4 p-4 pb-3 min-w-[10rem] w-fit max-w-[25rem] rounded-xl shadow-lg bg-white">
      <p className="text-zinc-600">{props.message}</p>
      <button className="absolute top-3 right-3">
        <IoCloseOutline />
      </button>
    </div>
  );
};

export const useToast = (config: ToastProps) => {
  const toastElement = <Toast {...config} />;
  const toastContainer = document.createElement("div");
};
