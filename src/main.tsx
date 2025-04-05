import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import MapApp from "./Map.tsx";
import { SidebarProvider, SidebarTrigger } from "./components/ui/sidebar.tsx";
import { AppSidebar } from "./components/app-sidebar.tsx";
import App from "./App.tsx";
import Documentation from "./Documentation.tsx";
import Dashboard from "./Dashboard.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full">
        <SidebarTrigger />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="map" element={<MapApp />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="documentation" element={<Documentation />} />
          </Routes>
        </BrowserRouter>
      </main>
    </SidebarProvider>
  </StrictMode>,
);
