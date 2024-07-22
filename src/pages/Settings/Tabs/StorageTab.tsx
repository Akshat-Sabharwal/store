import { useFiles, useFirebase } from "@/hooks";
import JSZip from "jszip";
import { useState } from "react";
import { saveAs } from "file-saver";
import { deleteObject, listAll, ref } from "firebase/storage";
import { Tab } from "@/components/Tabs";
import { Button } from "@/components/Button";

export const deleteFiles = async () => {
  const { storage, auth } = useFirebase();

  const folderRef = ref(storage, `${auth.currentUser?.uid}/`);
  const fileRefs = await listAll(folderRef);

  await Promise.all(fileRefs.items.map((file) => deleteObject(file)));
};

export const StorageTab = ({ data }: { data: any }) => {
  const { files } = useFiles();

  const [buffer, setBuffer] = useState(false);

  const downloadFiles = async () => {
    const zip = new JSZip();
    const folder = zip.folder("files");

    if (!folder) return;

    await Promise.all(
      files.map(async (file) => {
        const response = await fetch(file.fileURL);
        const blob = await response.blob();
        folder.file(file.name, blob);
      })
    );

    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, "files.zip");
  };

  return (
    <Tab index={0}>
      <div className="w-full flex flex-col justify-start items-start pt-6 sm:p-4 gap-6 sm:gap-8">
        <div className="w-full flex justify-start items-center h-[2rem] sm:h-[3rem] rounded-lg bg-zinc-100 overflow-hidden">
          {data.categoryStorage.map((file: any) =>
            file.size === 0 ? null : (
              <span
                className="flex justify-start items-center p-4 h-full"
                style={{
                  width: (file.size / 200000) * 100 + "%",
                  backgroundColor: file.color,
                  color: "hsl(180, 20%, 40%)",
                }}
              />
            )
          )}
        </div>
        <div className="flex flex-wrap justify-start items-center gap-5 sm:gap-12 mb-10">
          {data.categoryStorage.map((type: any) => (
            <div
              className="flex justify-start items-center gap-2"
              key={data.categoryStorage.indexOf(type)}
            >
              <span
                className="size-3 sm:size-5 rounded-sm"
                style={{ backgroundColor: type.color }}
              />
              <p className="text-accent-800 text-sm sm:text-lg">{type.type}</p>
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center w-full">
          <p className="text-accent-800 text-md sm:text-lg">download backup</p>
          <Button
            onClick={async () => {
              setBuffer(true);
              await downloadFiles();
              setBuffer(false);
            }}
          >
            download
          </Button>
        </div>
        <div className="flex justify-between items-center w-full">
          <p className="text-accent-800 text-md sm:text-lg">delete all files</p>
          <Button
            color="text-red-500"
            bgColor="bg-red-100"
            disabled={buffer}
            onClick={deleteFiles}
          >
            delete
          </Button>
        </div>
      </div>
    </Tab>
  );
};
