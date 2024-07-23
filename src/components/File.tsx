import { FC, useState } from "react";
import { deleteObject, ref, uploadBytes } from "firebase/storage";
import SyntaxHighlighter from "react-syntax-highlighter";
import { stackoverflowLight } from "react-syntax-highlighter/dist/esm/styles/hljs";

import { GoKebabHorizontal } from "react-icons/go";
import { IoCloseOutline } from "react-icons/io5";

import { Menu, MenuItem, useMenu } from "./Menu";
import { Modal, ModalCloseButton, ModalHeading, useModal } from "./Modal";
import { Button } from "./Button";
import { Overlay } from "./Overlay";

import { useFiles, useFirebase } from "@/hooks";
import { getLang } from "@/utils";
import { TFile } from "@/types";

type FileProps = {
  file: TFile;
};

export const FileSkeleton: FC = () => {
  return (
    <div className="flex flex-col justify-start items-center p-2 pb-0 rounded-xl bg-zinc-200 w-[8rem] h-[9rem] sm:w-[9rem] sm:max-w-[9rem] sm:h-[12rem] sm:max-h-[18rem] animate-pulse">
      <div className="flex justify-start items-center h-[7rem] w-[97%] bg-white rounded-xl"></div>
      <span className="w-[70%] h-5 bg-zinc-300 my-3 rounded-md self-start ml-1"></span>
    </div>
  );
};

export const File: FC<FileProps> = (props) => {
  const type = props.file.name.split(".").at(-1) as string;
  const name =
    props.file.name.split(".").length > 2
      ? props.file.name.split(".").slice(0, -2).join(".")
      : props.file.name.split(".").at(0);

  const language = getLang(type);

  const { auth, storage } = useFirebase();
  const { menuRef, buttonRef, toggleMenu } = useMenu();

  const [fileRename, setFileRename] = useState("");
  const [editor, setEditor] = useState(false);
  const [buffer, setBuffer] = useState(false);

  const { reload } = useFiles();

  const {
    modalRef: renameRef,
    openModal: openRename,
    closeModal: closeRename,
  } = useModal();
  const {
    modalRef: deleteRef,
    openModal: openDelete,
    closeModal: closeDelete,
  } = useModal();
  const { modalRef: infoRef, openModal: openInfo } = useModal();

  const handleRenameClose = () => {
    closeRename();
    setFileRename("");
  };

  const deleteFile = async () => {
    setBuffer(true);

    const storageRef = ref(
      storage,
      `${auth.currentUser?.uid}/${props.file.name}`
    );
    await deleteObject(storageRef);

    setBuffer(false);

    closeDelete();
    reload();
  };

  const openFile = () => {
    if (["jpg", "png", "pdf"].includes(type)) {
      return window.open(props.file.blobURL);
    }

    setEditor(true);
  };

  const renameFile = async () => {
    setBuffer(true);

    const res = await fetch(props.file.fileURL);
    const blob = await res.blob();

    await deleteFile();
    await uploadBytes(
      ref(storage, `${auth.currentUser?.uid}/${fileRename}.${type}`),
      blob
    );

    setBuffer(false);

    closeRename();
    reload();
  };

  return (
    <>
      <Menu ref={menuRef}>
        <MenuItem
          onClick={() => {
            toggleMenu();
            openRename();
          }}
        >
          rename
        </MenuItem>
        <a download={name} href={props.file.blobURL} className="size-full">
          <MenuItem>download</MenuItem>
        </a>

        <MenuItem
          onClick={() => {
            toggleMenu();
            openDelete();
          }}
        >
          delete
        </MenuItem>
        <MenuItem
          onClick={() => {
            toggleMenu();
            openInfo();
          }}
        >
          info
        </MenuItem>
      </Menu>

      <Modal ref={renameRef}>
        <ModalCloseButton modalRef={renameRef} />
        <ModalHeading>Rename</ModalHeading>
        <div className="flex flex-col justify-start items-start gap-7 mx-1">
          <input
            className="w-full p-2 rounded-md border-2 border-gray-300 text-zinc-600 outline-none focus:border-gray-400"
            type="text"
            placeholder="Rename File"
            value={fileRename}
            onChange={(e) => setFileRename(e.target.value)}
          />
          <div className="flex flex-row self-end justify-end items-start gap-3">
            <Button
              onClick={async () => {
                await renameFile();
              }}
              disabled={buffer}
            >
              Rename
            </Button>
            <Button onClick={handleRenameClose} disabled={buffer}>
              Discard
            </Button>
          </div>
        </div>
      </Modal>

      <Modal ref={deleteRef}>
        <ModalCloseButton modalRef={deleteRef} />
        <ModalHeading>Delete File</ModalHeading>
        <div className="flex flex-col justify-start items-start gap-6 mx-1">
          <p className="text-zinc-600 text-lg mr-2">
            Are you sure you want to delete the file?
          </p>
          <div className="flex flex-row self-end justify-end items-start gap-3">
            <Button
              color="text-red-500"
              bgColor="bg-red-100"
              onClick={deleteFile}
              disabled={buffer}
            >
              Delete
            </Button>
            <Button onClick={closeDelete} disabled={buffer}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      <Modal ref={infoRef}>
        <ModalCloseButton modalRef={infoRef} />
        <ModalHeading>File Info</ModalHeading>
        <div className="flex flex-col justify-start items-start gap-5 mt-6 text-lg text-zinc-600">
          <span className="flex justify-between items-center max-w-[12rem] gap-12 truncate">
            Name <span>{name}</span>
          </span>
          <hr className="w-full" />
          <span className="flex justify-between items-center w-full gap-12">
            File-Type <span>{type}</span>
          </span>
          <hr className="w-full" />
          <span className="flex justify-between items-center w-full gap-12">
            Size
            <span>
              {Math.floor(props.file.size / 1000) === 0
                ? "1"
                : Math.floor(props.file.size / 1000)}
              kB
            </span>
          </span>
        </div>
      </Modal>

      {editor === true ? (
        <>
          <Overlay />

          <div className="absolute z-50 pt-20 top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] size-full max-w-full md:max-w-[60rem] bg-[#f6f6f6] overflow-scroll text-sm sm:text-md overscroll-none code-preview">
            <div className="absolute w-full top-0 left-0 flex justify-between items-center px-5 py-4 bg-accent-400 text-accent-800">
              <p className="text-lg sm:text-xl truncate max-w-[50ch]">
                {props.file.name}
              </p>
              <button
                className="mb-1 text-2xl"
                onClick={() => setEditor(false)}
              >
                <IoCloseOutline />
              </button>
            </div>
            <SyntaxHighlighter
              language={language}
              style={stackoverflowLight}
              wrapLongLines
              showLineNumbers
              lineNumberStyle={{
                width: "1rem",
                paddingInline: "0rem",
                marginRight: "1.3rem",
                textWrap: "nowrap",
                color: "rgba(0, 0, 0, 0.2)",
              }}
            >
              {props.file.content}
            </SyntaxHighlighter>
          </div>
        </>
      ) : null}

      <div className="flex flex-col justify-start items-center p-2 pb-0 rounded-xl bg-accent-400 w-full max-w-[8rem] h-[9rem] sm:w-[9rem] sm:max-w-[9rem] sm:h-[10rem] sm:max-h-[18rem]">
        <div
          className="flex justify-center items-center h-[7rem] w-[97%] bg-white rounded-xl text-accent-600 text-xl select-none cursor-pointer"
          onClick={openFile}
        >
          {type}
        </div>
        <div className="relative flex justify-between items-center w-full pl-2 gap-4 text-nowrap">
          <div className="w-[70%] group">
            <p
              className="font-medium text-accent-800 text-lg sm:text-xl my-1.5 sm:mt-3 sm:mb-2 select-none cursor-pointer truncate"
              onClick={openFile}
            >
              {name}
            </p>
            <p className="hidden sm:group-hover:block absolute -translate-x-3 min-w-fit bg-white shadow-md rounded-lg p-2.5 pb-2 text-accent-800">
              {name}
            </p>
          </div>
          <button ref={buttonRef} onClick={toggleMenu}>
            <GoKebabHorizontal className="text-accent-800 rotate-90 text-lg" />
          </button>
        </div>
      </div>
    </>
  );
};
