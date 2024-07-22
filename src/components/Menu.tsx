import {
  ComponentProps,
  FC,
  forwardRef,
  ReactNode,
  useEffect,
  useRef,
} from "react";

type MenuProps = ComponentProps<"div"> & {
  children: ReactNode;
};

type MenuItemProps = ComponentProps<"button"> & {
  children: ReactNode;
};

export const Menu = forwardRef<HTMLDivElement, MenuProps>(
  ({ children }, ref) => {
    return (
      <div
        ref={ref}
        className="max-w-min menu absolute z-50 p-1.5 rounded-md shadow-md bg-white hidden"
      >
        {children}
      </div>
    );
  }
);

export const MenuItem: FC<MenuItemProps> = ({ children, ...props }) => {
  return (
    <button
      className="menu-item bg-none w-full text-accent-800 text-left py-1.5 px-4 rounded-md hover:bg-accent-400 active:bg-accent-600 text-nowrap"
      {...props}
    >
      {children}
    </button>
  );
};

export const useMenu = () => {
  const menuRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const scrollable = document.getElementsByClassName("scrollable").item(0);

  buttonRef.current?.classList.add("menu-button");

  if (buttonRef.current?.children) {
    for (const child of buttonRef.current?.children) {
      child.classList.add("menu-button");
    }
  }

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) {
        menuRef.current?.classList.add("hidden");
        scrollable?.classList.remove("overflow-hidden");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleMenu = () => {
    if (!menuRef.current || !buttonRef.current) {
      return;
    }

    if (menuRef.current?.classList.contains("hidden")) {
      const { left, bottom } = buttonRef.current?.getBoundingClientRect();

      const offset = 5;

      menuRef.current.style.top = `${bottom + offset}px`;
      menuRef.current.style.left = `${left}px`;

      if (bottom + offset + 150 > window.innerHeight) {
        menuRef.current.style.top = `${bottom + offset - 150}px`;
      }

      if (left + offset + 150 > window.innerWidth) {
        menuRef.current.style.left = `${left + offset - 75}px`;
      }

      scrollable?.classList.add("overflow-hidden");

      menuRef.current?.classList.remove("hidden");
    } else {
      menuRef.current.classList.add("hidden");
      scrollable?.classList.remove("overflow-hidden");
    }
  };

  return { menuRef, buttonRef, toggleMenu };
};
