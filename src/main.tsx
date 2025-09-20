import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";

// Ensure React is available globally to prevent createContext issues
if (typeof window !== 'undefined') {
  (window as any).React = React;
}

// Restore full app with proper React context handling
createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
