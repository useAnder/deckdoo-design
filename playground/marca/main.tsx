import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@mantine/core/styles.css";
import "@deckdoo/design/styles.css";
import { BancadaRoot } from "./Bancada.js";

const root = document.getElementById("root");
if (!root) throw new Error("Root element #root not found");

createRoot(root).render(
  <StrictMode>
    <BancadaRoot />
  </StrictMode>,
);
