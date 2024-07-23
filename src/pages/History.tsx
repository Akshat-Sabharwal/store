import { Menu, MenuItem, useMenu } from "@/components/Menu";
import { useHistory } from "@/hooks";
import { FC, useEffect, useState, useMemo } from "react";
import { PiArrowDown, PiArrowUp } from "react-icons/pi";
import { RiDropdownList } from "react-icons/ri";

export const History: FC = () => {
  const { buffer, filteredHistory, reload } = useHistory();
  const { menuRef, buttonRef, toggleMenu } = useMenu();

  const [sort, setSort] = useState<"name" | "size" | "created_at">(
    "created_at"
  );
  const [order, setOrder] = useState<1 | -1>(-1);

  const sortedHistory = useMemo(() => {
    if (!sort) return filteredHistory;

    const sorted = [...filteredHistory].sort((a, b) => {
      switch (sort) {
        case "name":
          return order * a.name.localeCompare(b.name);
        case "size":
          return order * (a.size - b.size);
        case "created_at":
          return (
            order *
            (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
          );
        default:
          return 0;
      }
    });

    return sorted;
  }, [sort, order, filteredHistory]);

  useEffect(() => {
    reload();
  }, []);

  return (
    <>
      <Menu ref={menuRef}>
        <MenuItem onClick={() => setSort("name")}>Name</MenuItem>
        <MenuItem onClick={() => setSort("size")}>Size</MenuItem>
        <MenuItem onClick={() => setSort("created_at")}>Created At</MenuItem>
      </Menu>

      <div className="flex flex-col justify-start items-start w-full p-4 sm:p-10 gap-8">
        <div className="flex justify-between items-center w-full">
          <p className="text-3xl sm:text-4xl text-accent-600">history</p>
          <div className="flex justify-end items-center gap-3 w-full">
            <button
              ref={buttonRef}
              onClick={toggleMenu}
              className="bg-accent-400 hover:bg-accent-600 p-2 text-accent-800 rounded-lg text-xl"
            >
              <RiDropdownList />
            </button>
            <button
              onClick={() => setOrder(order === 1 ? -1 : 1)}
              className="bg-accent-400 hover:bg-accent-600 p-2 text-accent-800 rounded-lg text-xl"
            >
              {order === 1 ? <PiArrowDown /> : <PiArrowUp />}
            </button>
          </div>
        </div>
        {buffer ? (
          <div className="w-full h-[60vh] rounded-lg bg-zinc-200 animate-pulse" />
        ) : (
          <table className="w-full table-auto">
            <thead className="w-full text-left mb-6">
              <tr className="border-b-2 border-zinc-200 text-accent-600 text-lg font-normal">
                <th className="font-normal text-lg sm:text-xl pb-2">
                  Filename
                </th>
                <th className="font-normal text-lg sm:text-xl pb-2 pl-6 sm:pl-12">
                  Size
                </th>
                <th className="font-normal text-lg sm:text-xl pb-2">
                  Created At
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedHistory.map((item) => (
                <tr key={item.createdAt} className="border-b-2 border-zinc-200">
                  <td className="py-1 sm:py-2 text-zinc-600 text-md sm:text-xl truncate max-w-[40ch]">
                    {item.name}
                  </td>
                  <td className="text-nowrap py-1 sm:py-2 text-zinc-600 text-md sm:text-lg px-6 sm:pl-12">
                    {Math.round(item.size / 1000)} kB
                  </td>
                  <td className="text-nowrap py-1 sm:py-2 text-zinc-600 text-md sm:text-lg">
                    {item.createdAt}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};
