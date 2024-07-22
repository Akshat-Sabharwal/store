import { FC } from "react";
import { FiArrowRight } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export const Home: FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col justify-start items-center size-full">
      <div className="size-full flex flex-col justify-center items-center rounded-lg bg-white shadow-md">
        <div className="flex flex-col justify-center items-center -mt-[3rem] sm:-mt-[6rem]">
          <p className="text-accent-800 text-[5rem] sm:text-[10rem] -mb-4 sm:-mb-8 opacity-80">
            store
          </p>
          <button
            className="flex gap-4 items-center justify-start rounded-lg bg-accent-400 text-accent-800 px-3 py-2 sm:px-4 sm:py-3 text-lg sm:text-2xl active:bg-accent-600"
            onClick={() => navigate("/authenticate")}
          >
            <p className="cursor-pointer">get storing</p>
            <FiArrowRight className="cursor-pointer" />
          </button>
        </div>
      </div>
    </div>
  );
};
