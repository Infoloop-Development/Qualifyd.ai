import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css";
import App from "./App.tsx";

const queryClient = new QueryClient();

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
      <App />
    </QueryClientProvider>
  </StrictMode>
);
