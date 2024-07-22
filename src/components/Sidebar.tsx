import { FC } from "react";
import { logo, sidebar } from "@/constants";
import { useNavigate } from "react-router-dom";

export const Sidebar: FC = () => {
  const navigate = useNavigate();

  const activateTab = (item: any) => {
    sidebar.forEach((item) => {
      if (item.isActive) {
        item.isActive = false;
      }
    });

    item.isActive = true;

    navigate(item.link);
  };

  return (
    <div className="hidden sm:flex flex-col justify-start items-start gap-10">
      <p className="text-accent-800 font-medium text-4xl select-none">{logo}</p>
      <ul className="flex flex-col justify-start items-start text-left gap-7">
        {sidebar.map((item) => (
          <li
            key={item.name}
            className={`${
              item.isActive ? "text-accent-800" : "text-accent-600"
            } hover:text-accent-800 text-2xl cursor-pointer select-none`}
            onClick={() => {
              activateTab(item);
            }}
          >
            {item.name}
          </li>
        ))}
      </ul>
    </div>
  );
};
