import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./index.css";
import { SidebarProvider, SidebarTrigger } from "./components/ui/sidebar.tsx";
import { AppSidebar } from "./components/app-sidebar.tsx";
import App from "./App.tsx";
import Documentation from "./Documentation.tsx";
import Dashboard from "./Dashboard.tsx";
import MapCo from "./MapCo2.tsx";
import MapPm from "./MapPm25.tsx";
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
              <Route path="map-co2" element={<MapCo />} />
              <Route path="map-pm25" element={<MapPm />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="documentation" element={<Documentation />} />
            </Routes>
          </BrowserRouter>
        </main>
      </SidebarProvider>
    </ThemeProvider>
  </StrictMode>,
);
