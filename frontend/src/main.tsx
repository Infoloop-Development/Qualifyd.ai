import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css";
import App from "./App.tsx";
import LaunchingSoon from "./LaunchingSoon.tsx";

const queryClient = new QueryClient();

// Check if we should show the launching soon page
const launchDate = new Date("2026-02-02T18:00:00").getTime();
const currentDate = new Date().getTime();
const showLaunchingSoon = currentDate < launchDate;

// Hide initial loader when React mounts
const hideLoader = () => {
  const loader = document.getElementById("initial-loader");
  if (loader) {
    loader.classList.add("hidden");
    setTimeout(() => {
      loader.remove();
    }, 300);
  }
};

// Hide loader immediately when React loads
setTimeout(hideLoader, 100);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      {showLaunchingSoon ? <LaunchingSoon /> : <App />}
    </QueryClientProvider>
  </StrictMode>
);
