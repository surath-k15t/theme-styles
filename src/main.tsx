import { createRoot } from "react-dom/client";
import "./lib/presets/baseStyles";
import "./global.css";
import "./components/theme-side-panel/k15t-primitives/k15t-primitives.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(<App />);
