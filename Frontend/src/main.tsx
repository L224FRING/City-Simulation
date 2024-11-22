import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Grid from "./grid/grid.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/three" element={<App />} />
        <Route path="/grid" element={<Grid />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
