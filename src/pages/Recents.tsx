import { FC, useEffect } from "react";
import { File, FileSkeleton } from "@/components/File";
import { useFiles } from "@/hooks";
import { TFile } from "@/types";

export const Recents: FC = () => {
  const { buffer, filteredFiles, files, reload } = useFiles();

  useEffect(() => {
    reload();
  }, []);

  return (
    <>
      <div className="flex flex-col justify-start items-start text-left gap-16 p-4 pt-2 sm:p-10 sm:pt-9 scrollable size-full">
        <div className="flex flex-col justify-start items-start gap-6 size-full">
          <p className="text-3xl sm:text-4xl text-accent-600 select-none">
            recents
          </p>
          <div className="flex justify-start items-start gap-6 flex-wrap size-full">
            {buffer ? (
              <>
                <FileSkeleton />
                <FileSkeleton />
                <FileSkeleton />
              </>
            ) : files.length === 0 ? (
              <div className="flex size-full justify-center items-center -mt-4">
                <p className="text-zinc-300 text-md max-w-[20ch] sm:text-2xl wrap sm:max-w-[30ch] text-center tracking-wide">
                  get started by uploading a file by clicking on the
                  <span className="text-zinc-400 p-1.5 bg-zinc-200 rounded-lg mx-2 text-md sm:text-xl">
                    + upload
                  </span>
                  button
                </p>
              </div>
            ) : filteredFiles.length === 0 ? (
              <p className="text-zinc-300 text-2xl wrap max-w-[30ch] text-center tracking-wide">
                no file with such name found!!
              </p>
            ) : (
              filteredFiles.map((file: TFile) => (
                <File key={file.name} file={file} />
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};
