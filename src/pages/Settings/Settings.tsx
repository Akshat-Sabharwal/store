import { Sidebar } from "@/components/Sidebar";
import { TabLabel, TabGroup, TabProvider } from "@/components/Tabs";
import { tabs } from "@/constants";
import { useFiles, useFirebase } from "@/hooks";
import { TFile } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { FC, useEffect } from "react";
import { StorageTab } from "./Tabs/StorageTab";
import { AccountTab } from "./Tabs/AccountTab";
import { useNavigate } from "react-router-dom";
import { Menu, MenuItem, useMenu } from "@/components/Menu";
import { MdMenu } from "react-icons/md";

const getCategorySize = (categoryName: string, categoryStorage: any) => {
  switch (categoryName) {
    case "png":
    case "jpg":
      categoryName = "images";
      break;

    case "pdf":
    case "txt":
    case "pptx":
    case "csv":
      categoryName = "documents";
      break;

    case "mp4":
    case "mp3":
      categoryName = "media";
      break;

    default:
      categoryName = "others";
      break;
  }

  const category = categoryStorage.find(
    (item: any) => item.type === categoryName
  );

  if (category) {
    return category;
  }
};

const processData = (files: TFile[]) => {
  return async () => {
    let totalStorage = 0;
    let categoryStorage = [
      { type: "images", size: 0, color: "hsl(180, 60%, 95%)" },
      { type: "documents", size: 0, color: "hsl(180, 40%, 82.5%)" },
      { type: "media", size: 0, color: "hsl(180, 35%, 65%)" },
      { type: "others", size: 0, color: "hsl(180, 30%, 45%)" },
    ];

    files.forEach((file: any) => {
      const sizeInKb = Math.round(file.size / 1024);
      let fileType = file.name.split(".").at(-1);

      totalStorage += sizeInKb;

      let category = getCategorySize(fileType, categoryStorage);
      category.size += sizeInKb;
    });

    return { totalStorage, categoryStorage };
  };
};

export const Settings: FC = () => {
  const { files, reload } = useFiles();
  const { auth } = useFirebase();
  const navigate = useNavigate();
  const { menuRef, buttonRef, toggleMenu } = useMenu();

  const { data } = useQuery({
    queryKey: ["files_data"],
    queryFn: processData(files),
  });

  useEffect(() => {
    if (auth.currentUser) {
      reload();
    } else {
      navigate("/authenticate");
    }
  }, []);

  return (
    <TabProvider>
      <Menu ref={menuRef}>
        <MenuItem onClick={() => navigate("/dashboard/")}>recents</MenuItem>
        <MenuItem onClick={() => navigate("/dashboard/history")}>
          history
        </MenuItem>
        <MenuItem onClick={() => navigate("/settings/")}>settings</MenuItem>
      </Menu>

      <Sidebar />

      <div className="flex justify-center items-start size-full">
        <div className="w-full flex flex-col justify-start items-start size-full overflow-y-scroll p-4 sm:p-10 gap-5 sm:gap-10 shadow-sm rounded-lg bg-white">
          <div className="w-full flex justify-between items-start">
            <p className="text-3xl sm:text-4xl text-accent-600 select-none">
              settings
            </p>
            <button
              className="p-1 text-2xl text-accent-800 sm:hidden"
              ref={buttonRef}
              onClick={toggleMenu}
            >
              <MdMenu />
            </button>
          </div>
          <TabGroup>
            {tabs.map((tab) => (
              <TabLabel key={tabs.indexOf(tab)} index={tabs.indexOf(tab)}>
                {tab}
              </TabLabel>
            ))}
          </TabGroup>

          {data?.categoryStorage ? (
            <div className="-mt-3 w-full">
              <StorageTab data={data} />
              <AccountTab />
            </div>
          ) : (
            <div className="size-full bg-zinc-200 rounded-lg animate-pulse" />
          )}
        </div>
      </div>
    </TabProvider>
  );
};
