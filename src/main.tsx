import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";

// Import security manager only in production to avoid dev interference
if (import.meta.env.PROD && import.meta.env.VITE_DISABLE_DEVTOOLS === "true") {
  import("./utils/security").catch(console.warn);
}

// Correctly wrap the application with BrowserRouter at the entry point
createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
