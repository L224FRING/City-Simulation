import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Grid from "./grid/grid.tsx";
import "./index.css";
import GridTest from "./grid/test.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/three" element={<App />} />
        <Route path="/" element={<Grid />} />
        <Route path="/test" element={<GridTest/>}/>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
