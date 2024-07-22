import { createContext, useState } from "react";
import type { ReactNode, FC, Dispatch, SetStateAction } from "react";
import type { UserType } from "../types";

type ProviderProps = {
  children: ReactNode;
};

type Context = {
  user: UserType;
  setUser: Dispatch<SetStateAction<UserType>>;
};

export const User = createContext<Context | null>(null);

export const UserProvider: FC<ProviderProps> = (props) => {
  const [user, setUser] = useState<UserType>(null);

  return (
    <User.Provider value={{ user, setUser }}>{props.children}</User.Provider>
  );
};
