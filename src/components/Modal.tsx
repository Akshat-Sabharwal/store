import {
  ComponentProps,
  ComponentPropsWithoutRef,
  FC,
  forwardRef,
  MutableRefObject,
  ReactNode,
  useRef,
} from "react";
import { IoCloseOutline } from "react-icons/io5";
import { Overlay } from "./Overlay";

type ModalProps = ComponentPropsWithoutRef<"div"> & {
  children?: ReactNode;
};

type ModalHeadingProps = {
  children?: string;
};

type ModalCloseButtonProps = ComponentProps<"button"> & {
  modalRef: MutableRefObject<HTMLDivElement | null>;
};

export const Modal = forwardRef<HTMLDivElement, ModalProps>(
  ({ children, ...props }, ref) => {
    return (
      <div
        className="absolute left-0 top-0 size-full hidden"
        ref={ref}
        {...props}
      >
        <Overlay />
        <div className="z-50 absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] w-[95%] sm:min-w-[25rem] sm:w-fit max-w-[25rem] sm:max-w-[30rem] rounded-xl bg-white p-6 sm:px-8 pt-5">
          {children}
        </div>
      </div>
    );
  }
);

export const ModalHeading: FC<ModalHeadingProps> = ({ children }) => {
  return (
    <h1 className="text-zinc-600 text-xl sm:text-[1.75rem] sm:mt-2 mb-6">
      {children}
    </h1>
  );
};

export const ModalCloseButton: FC<ModalCloseButtonProps> = ({ modalRef }) => {
  const closeModal = () => {
    modalRef.current?.classList.add("hidden");
  };

  return (
    <button
      className="absolute top-5 right-4 sm:top-6 sm:right-5 text-zinc-500 text-2xl"
      onClick={closeModal}
    >
      <IoCloseOutline />
    </button>
  );
};

export const useModal = () => {
  const modalRef = useRef<HTMLDivElement | null>(null);

  const openModal = () => {
    modalRef.current?.classList.remove("hidden");
  };

  const closeModal = () => {
    modalRef.current?.classList.add("hidden");
  };

  return { modalRef, openModal, closeModal };
};
