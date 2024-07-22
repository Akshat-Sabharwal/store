import "@/index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "@/pages/App";
import { FilesProvider } from "@/context/files";
import { BrowserRouter } from "react-router-dom";
import { HistoryProvider } from "./context/history";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <FilesProvider>
        <HistoryProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </HistoryProvider>
      </FilesProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
