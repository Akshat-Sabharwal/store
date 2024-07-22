import { useFirebase } from "@/hooks";
import { collection, getDocs } from "firebase/firestore";
import {
  createContext,
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from "react";

export type THistoryFile = {
  name: string;
  createdAt: string;
  size: number;
};

type TContext = {
  history: THistoryFile[];
  filteredHistory: THistoryFile[];
  buffer: boolean;
  setHistory: Dispatch<SetStateAction<THistoryFile[]>>;
  setFilteredHistory: Dispatch<SetStateAction<THistoryFile[]>>;
  reload: () => void;
};

type TProvider = {
  children: ReactNode;
};

export const History = createContext<TContext | null>(null);

export const HistoryProvider: FC<TProvider> = ({ children }) => {
  const [history, setHistory] = useState<THistoryFile[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<THistoryFile[]>([]);
  const [updater, setUpdater] = useState(false);
  const [buffer, setBuffer] = useState(true);

  const { db, auth } = useFirebase();

  useEffect(() => {
    const fetchHistory = async () => {
      const docs = await getDocs(
        collection(db, auth.currentUser?.uid as string)
      );

      const newHistory: THistoryFile[] = [];
      const newFilteredHistory: THistoryFile[] = [];

      docs.docs.forEach((doc) => {
        const data = doc.data();
        const date = new Date(data?.createdAt.seconds * 1000).toUTCString();

        const file = {
          name: data.name,
          createdAt: date,
          size: data.size,
        };

        newHistory.push(file);
        newFilteredHistory.push(file);
      });

      setHistory(newHistory);
      setFilteredHistory(newFilteredHistory);
    };

    if (updater) {
      fetchHistory();
      setUpdater(false);
    }
  }, [updater, db, auth.currentUser?.uid]);

  useEffect(() => {
    setTimeout(() => {
      setBuffer(false);
    }, 5000);
  }, [history]);

  const reload = () => {
    setBuffer(true);
    setUpdater(true);
  };

  return (
    <History.Provider
      value={{
        history,
        buffer,
        filteredHistory,
        setFilteredHistory,
        setHistory,
        reload,
      }}
    >
      {children}
    </History.Provider>
  );
};
