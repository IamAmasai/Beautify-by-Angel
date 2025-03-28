import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Define custom CSS variables for our color palette
document.documentElement.style.setProperty('--color-plum', '#4B2E4A');
document.documentElement.style.setProperty('--color-amber', '#D4A017');
document.documentElement.style.setProperty('--color-blush', '#F8C1C6');
document.documentElement.style.setProperty('--color-midnight', '#1A1A1A');
document.documentElement.style.setProperty('--color-ivory', '#F5F1E9');

createRoot(document.getElementById("root")!).render(<App />);
