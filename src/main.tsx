import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";

// Disable security features completely for now to avoid React conflicts
// if (import.meta.env.PROD && import.meta.env.VITE_DISABLE_DEVTOOLS === "true") {
//   import("./utils/security").catch(console.warn);
// }

// Use React.StrictMode to catch issues early
import React from "react";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
