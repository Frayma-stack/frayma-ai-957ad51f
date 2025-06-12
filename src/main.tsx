
import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { cleanupLocalStorage, forceCleanProblematicEntries } from './utils/localStorageCleanup';

// Comprehensive localStorage cleanup on app startup
console.log('🚀 Application starting - performing localStorage cleanup');
forceCleanProblematicEntries();
cleanupLocalStorage();

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Failed to find the root element");

const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
