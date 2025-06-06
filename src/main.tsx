import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./index.css";
import { SidebarProvider, SidebarTrigger } from "./components/ui/sidebar.tsx";
import { AppSidebar } from "./components/app-sidebar.tsx";
import App from "./App.tsx";
import Documentation from "./Documentation.tsx";
import Dashboard from "./Dashboard.tsx";
import MapAQI from "./MapAQI.tsx";
import MapNo2 from "./MapNo2.tsx";
import { ThemeProvider } from "./components/theme-provider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <SidebarProvider>
        <AppSidebar />
        <main className="w-full">
          <SidebarTrigger />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<App />} />
              <Route path="map-aqi" element={<MapAQI />} />
              <Route path="map-no2" element={<MapNo2 />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="documentation" element={<Documentation />} />
            </Routes>
          </BrowserRouter>
        </main>
      </SidebarProvider>
    </ThemeProvider>
  </StrictMode>,
);
