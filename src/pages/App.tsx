import { FC } from "react";
import { Routes, Route } from "react-router-dom";

import { Backdrop } from "@/components/Backdrop";
import { Auth } from "./Auth";
import { Dashboard } from "./Dashboard";
import { Settings } from "./Settings/Settings";

export const App: FC = () => {
  return (
    <Backdrop>
      <Routes>
        <Route path="/authenticate" element={<Auth />} />
        <Route path="/dashboard/*" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Backdrop>
  );
};
