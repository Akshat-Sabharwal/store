import { Files } from "@/context/files";
import { History } from "@/context/history";
import { useContext } from "react";

export { useFirebase } from "@/config/firebase";

export const useFiles = () => {
  const filesContext = useContext(Files);

  if (!filesContext) {
    throw new Error("Files could not be fetched!");
  }

  return filesContext;
};

export const useHistory = () => {
  const historyContext = useContext(History);

  if (!historyContext) {
    throw new Error("History could not be fetched!");
  }

  return historyContext;
};
