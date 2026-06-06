import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createHashHistory } from "@tanstack/react-router";
import { getRouter } from "./router";

const router = getRouter(createHashHistory());

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
