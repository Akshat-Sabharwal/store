import {
  ComponentProps,
  useState,
  createContext,
  type FC,
  type ReactNode,
  Dispatch,
  useContext,
} from "react";

type TTabGroupProps = {
  children: ReactNode;
};

type TTabLabelProps = ComponentProps<"button"> & {
  children: ReactNode;
  index: number;
};

type TTabProps = {
  children: ReactNode;
  index: number;
};

type TTabContext = {
  activeTab: number;
  setActiveTab: Dispatch<number>;
};

const TabContext = createContext<TTabContext | null>(null);

export const TabProvider = ({ children }: { children: ReactNode }) => {
  const [activeTab, setActiveTab] = useState<number>(0);

  return (
    <TabContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </TabContext.Provider>
  );
};

export const TabGroup: FC<TTabGroupProps> = ({ children }) => {
  return (
    <div className="flex justify-start items-center gap-2 sm:gap-6">
      {children}
    </div>
  );
};

export const TabLabel: FC<TTabLabelProps> = ({ children, index, ...props }) => {
  const { activeTab, setActiveTab } = useContext(TabContext) as TTabContext;
  const activeTabStyle = "rounded-lg bg-white shadow-md text-accent-800";

  return (
    <button
      className={`py-1.5 px-3 text-sm sm:text-lg text-accent-600 ${
        activeTab === index ? activeTabStyle : ""
      }`}
      onClick={(e) => {
        setActiveTab(index);

        if (props.onClick) {
          props.onClick(e);
        }
      }}
    >
      {children}
    </button>
  );
};

export const Tab: FC<TTabProps> = ({ children, index }) => {
  const { activeTab } = useContext(TabContext) as TTabContext;

  return (
    <div className={activeTab === index ? "size-full" : "hidden"}>
      {children}
    </div>
  );
};
