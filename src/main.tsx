import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { VolrUIProvider } from "@volr/react-ui";
import type { VolrUIConfig } from "@volr/react-ui";

const volrConfig: VolrUIConfig = {
  defaultChainId: 8453,
  projectApiKey: import.meta.env.VITE_VOLR_PROJECT_API_KEY,
  appName: "Volr CES Demo",
  accentColor: "#3b82f6",
  enabledLoginMethods: ["email", "social"],
  socialProviders: ["google", "twitter"],
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <VolrUIProvider config={volrConfig}>
      <App />
    </VolrUIProvider>
  </StrictMode>
);
