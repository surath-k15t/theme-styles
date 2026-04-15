import { createRoot } from "react-dom/client";
import "./lib/presets/baseStyles";
import "./global.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(<App />);
