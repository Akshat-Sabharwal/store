import { THistoryFile } from "@/context/history";
import { useFiles, useHistory } from "@/hooks";
import { TFile } from "@/types";
import { ChangeEvent, FC, useState } from "react";

export const SearchBar: FC = () => {
  const [search, setSearch] = useState("");
  const { files, setFilteredFiles } = useFiles();
  const { history, setFilteredHistory } = useHistory();

  const url = window.location.pathname;

  const filterFiles = (e: ChangeEvent<HTMLInputElement>) => {
    setFilteredFiles(
      files.filter((file: TFile) => file.name.includes(e.target.value))
    );
  };

  const filterHistory = (e: ChangeEvent<HTMLInputElement>) => {
    setFilteredHistory(
      history.filter((file: THistoryFile) => file.name.includes(e.target.value))
    );
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);

    switch (url) {
      case "/dashboard/":
        filterFiles(e);
        break;

      case "/dashboard/history":
        filterHistory(e);
        break;
    }
  };

  return (
    <input
      className="min-w-[10rem] w-full max-w-[30rem] shadow-sm text-gray-500 placeholder:text-gray-300 focus:outline-none text-xl p-2 px-4 rounded-xl"
      placeholder="search"
      type="text"
      value={search}
      onChange={handleChange}
    />
  );
};
