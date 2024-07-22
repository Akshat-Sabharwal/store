import { SearchBar } from "@/components/SearchBar";
import { Sidebar } from "@/components/Sidebar";
import {
  Modal,
  ModalCloseButton,
  ModalHeading,
  useModal,
} from "@/components/Modal";
import { History } from "./History";
import { Recents } from "./Recents";
import { Route, Routes, useNavigate } from "react-router-dom";
import { useFiles, useFirebase, useHistory } from "@/hooks";
import { GrAdd } from "react-icons/gr";
import {
  ChangeEvent,
  FC,
  MutableRefObject,
  useEffect,
  useRef,
  useState,
} from "react";
import { Button } from "@/components/Button";
import { IoCloseOutline, IoReload } from "react-icons/io5";
import { allowedFileTypes } from "@/constants";
import { ref, uploadBytesResumable } from "firebase/storage";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { wait } from "@/utils";
import { MdMenu } from "react-icons/md";
import { Menu, MenuItem, useMenu } from "@/components/Menu";

type UploadModalTypes = {
  modalUtils: {
    openModal: () => void;
    closeModal: () => void;
    modalRef: MutableRefObject<HTMLDivElement | null>;
  };
};

const UploadModal: FC<UploadModalTypes> = ({ modalUtils }) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [fileInputPreview, setFileInputPreview] = useState<string | null>(null);
  const [fileInput, setFileInput] = useState<File | null>(null);
  const [progress, setProgress] = useState<number | null>(null);

  const { auth, storage, db } = useFirebase();
  const { reload: reloadFiles } = useFiles();

  const handleFileInputValidation = (file: File): void => {
    setFileInput(file);
  };

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target?.files?.item(0) as File;
    const [_, type] = file.type.split("/");

    if (type === "png" || type === "jpg") {
      const preview = URL.createObjectURL(file);

      setFileInputPreview(preview);
    }

    handleFileInputValidation(file);
  };

  const handleFileDiscard = () => {
    setFileInput(null);
    setFileInputPreview(null);
  };

  const uploadFile = async () => {
    const storageRef = ref(
      storage,
      `${auth.currentUser?.uid}/${fileInput?.name}`
    );

    const uploadProgress = uploadBytesResumable(storageRef, fileInput as File);

    uploadProgress.on(
      "state_changed",
      (snap) => {
        const progress = (snap.bytesTransferred / snap.totalBytes) * 100;

        setProgress(progress);
      },
      (e) => {
        console.log(e);
      },
      () => {
        setProgress(null);
      }
    );

    await addDoc(collection(db, auth.currentUser?.uid as string), {
      name: fileInput?.name,
      createdAt: serverTimestamp(),
      size: fileInput?.size,
    });

    handleFileDiscard();

    wait(1500, reloadFiles);
  };

  return (
    <Modal ref={modalUtils.modalRef}>
      <ModalHeading>Upload File</ModalHeading>
      <ModalCloseButton
        modalRef={modalUtils.modalRef}
        onClick={handleFileDiscard}
      />
      <div className="flex flex-col justify-start items-start gap-8 sm:mx-1 w-full">
        <input
          ref={fileInputRef}
          className="hidden"
          type="file"
          accept={allowedFileTypes.join(", ")}
          onChange={handleFileInput}
        />
        {progress != null ? (
          <div className="relative flex justify-start items-center w-full gap-4 rounded-lg border-2 border-zinc-100">
            <span
              className="w-full flex justify-center items-center bg-accent-600 h-[3rem] rounded-l-lg"
              style={{ width: progress + "%" }}
            ></span>
            <p className="absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] text-accent-800">
              {Math.floor(progress) + "%"}
            </p>
          </div>
        ) : (
          <>
            {fileInput == null ? (
              <div
                className="flex justify-center items-center w-full py-4 sm:py-12 border-2 border-dashed text-3xl text-zinc-300 border-zinc-300 rounded-xl cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <GrAdd />
              </div>
            ) : (
              <div className="flex justify-start items-center w-full gap-4 rounded-lg border-2 border-zinc-100">
                {fileInputPreview == null ? (
                  <span className="hidden sm:flex justify-center items-center size-[5rem] p-2 border-r-2 border-r-zinc-100 text-lg text-zinc-600">
                    {fileInput.type.split("/").at(1)}
                  </span>
                ) : (
                  <img
                    src={fileInputPreview as unknown as string}
                    className="hidden sm:inline size-[5rem] p-2 border-r-2 border-r-zinc-100"
                  />
                )}
                <span className="flex justify-between items-center w-full mr-3 text-zinc-600">
                  <p className="ml-3 text-zinc-600 text-lg py-2 m:text-xl max-w-[10rem] truncate">
                    {fileInput?.name}
                  </p>
                  <button className="p-2 text-xl" onClick={handleFileDiscard}>
                    <IoCloseOutline />
                  </button>
                </span>
              </div>
            )}
          </>
        )}

        <div className="flex flex-row self-end justify-end items-start gap-3">
          <Button
            onClick={async () => {
              await uploadFile();
              modalUtils.closeModal();
            }}
          >
            Upload
          </Button>
          <Button
            onClick={() => {
              modalUtils.closeModal();
              handleFileDiscard();
            }}
          >
            Discard
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export const Dashboard = () => {
  const navigate = useNavigate();
  const url = window.location.pathname;

  const { modalRef, openModal, closeModal } = useModal();
  const { menuRef, buttonRef, toggleMenu } = useMenu();

  const { auth } = useFirebase();
  const { reload: reloadFiles } = useFiles();
  const { reload: reloadHistory } = useHistory();

  const [userBuffer, setUserBuffer] = useState(true);

  useEffect(() => {
    auth.onAuthStateChanged(() => {
      setUserBuffer(false);
    });

    if (!auth.currentUser) {
      navigate("/authenticate");
    }
  }, []);

  const handleReload = () => {
    switch (url) {
      case "/dashboard":
      case "/dashboard/":
        reloadFiles();
        break;

      case "/dashboard/history":
      case "/dashboard/history/":
        reloadHistory();
        break;
    }
  };

  return (
    <>
      <UploadModal modalUtils={{ modalRef, openModal, closeModal }} />

      <Menu ref={menuRef}>
        <MenuItem onClick={() => navigate("/dashboard/")}>recents</MenuItem>
        <MenuItem onClick={() => navigate("/dashboard/history")}>
          history
        </MenuItem>
        <MenuItem onClick={() => navigate("/settings/")}>settings</MenuItem>
      </Menu>

      <Sidebar />
      <div className="flex flex-col justify-start items-start size-full gap-6">
        <div className="flex justify-between items-start w-full">
          <div className="flex justify-start items-center gap-2">
            <SearchBar />
            <button
              className="hidden sm:inline text-3xl text-accent-600 hover:rotate-45 duration-300"
              onClick={handleReload}
            >
              <IoReload />
            </button>
            <button
              className="p-1 text-2xl text-accent-800 sm:hidden"
              ref={buttonRef}
              onClick={toggleMenu}
            >
              <MdMenu />
            </button>
          </div>
          {userBuffer == true ? (
            <span className="animate-pulse bg-zinc-300 hidden sm:flex justify-center items-center size-10 rounded-md" />
          ) : (
            <img
              src={auth.currentUser?.photoURL as string}
              className="hidden sm:inline size-10 rounded-md cursor-pointer"
              onClick={() => navigate("/dashboard/settings")}
            />
          )}
        </div>
        <div className="flex flex-col justify-start items-start size-full gap-20 overflow-y-scroll shadow-sm rounded-lg bg-white">
          <Routes>
            <Route index={true} path="/" element={<Recents />} />
            <Route path="/history" element={<History />} />
          </Routes>
          <button
            className="z-10 fixed bottom-4 right-4 sm:bottom-16 sm:right-16 flex justify-start items-center py-2 px-3 sm:py-3 sm:px-4 gap-3 rounded-xl text-lg sm:text-xl bg-accent-800 text-accent-400"
            onClick={openModal}
          >
            <GrAdd />
            <span className="mt-1">Upload</span>
          </button>
        </div>
      </div>
    </>
  );
};
