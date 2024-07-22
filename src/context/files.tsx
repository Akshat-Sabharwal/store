import { createContext, FC, Dispatch, ReactNode, useState } from "react";
import { useFirebase } from "@/hooks";
import { getDownloadURL, listAll, ref } from "firebase/storage";
import { TFile } from "@/types";
import { useQuery } from "@tanstack/react-query";

type ProviderProps = {
  children: ReactNode;
};

type TContext = {
  files: TFile[];
  filteredFiles: TFile[];
  buffer: boolean;
  reload: () => void;
  setFilteredFiles: Dispatch<any>;
};

export const Files = createContext<TContext | null>(null);

export const FilesProvider: FC<ProviderProps> = ({ children }) => {
  const { auth, storage } = useFirebase();
  const [filteredFiles, setFilteredFiles] = useState<TFile[]>([]);

  const {
    isLoading,
    data = [],
    refetch,
  } = useQuery<TFile[]>({
    queryKey: ["files"],
    queryFn: async () => {
      const fileList = await listAll(ref(storage, `${auth.currentUser?.uid}/`));

      const fileListWithURL = await Promise.all(
        fileList.items.map(async (file) => {
          const fileURL = await getDownloadURL(file);
          const res = await fetch(fileURL);
          const blob = await res.blob();
          const blobURL = URL.createObjectURL(blob);

          const fileData = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target?.result as string);
            reader.readAsText(blob);
          });

          return {
            name: file.name,
            size: blob.size,
            blobURL,
            fileURL,
            content: fileData,
          } as TFile;
        })
      );

      const validFiles = fileListWithURL.filter(
        (file) => file?.name !== "undefined"
      );

      setFilteredFiles(validFiles);

      return validFiles;
    },
  });

  const reload = () => {
    refetch();
  };

  return (
    <Files.Provider
      value={{
        files: data,
        filteredFiles,
        buffer: isLoading,
        reload,
        setFilteredFiles,
      }}
    >
      {children}
    </Files.Provider>
  );
};
