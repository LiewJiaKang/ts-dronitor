import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

function Documentation() {
  const markdownText = `# Dronitor System Documentation

## Overview

**Dronitor** is an autonomous environmental monitoring system designed to collect air quality data, geographic location data, and visualize it in real time through an interactive dashboard.

The system workflow is:

1. **Sensors** (MQ-135, PMS7003, and Neo-6M GPS) collect air quality and location data.
2. **Arduino** reads the sensor outputs and transmits them to the **Raspberry Pi** via serial communication.
3. **Raspberry Pi** runs a Python script to receive and save the data into \`dist/points.txt\`.
4. A **Python-based web server**, managed by **systemd**, serves the frontend application and the latest sensor data.
5. The **frontend dashboard** displays:
   - Map visualization
   - Raw sensor data table
   - Bar charts of AQI metrics
   - AI-based insights overview

---

## System Architecture

\`\`\`plaintext
[MQ-135 + PMS7003 + Neo-6M GPS] → [Arduino] → [Serial Port] → [Raspberry Pi] → [points.txt] → [Python Server (systemd)] → [Web Browser (Dashboard)]
\`\`\`

---

## Tech Stack

| Layer                  | Technology                             |
| ---------------------- | ------------------------------------- |
| Frontend                | React + TypeScript                   |
| Mapping                 | Leaflet JS                           |
| Data Visualization      | Shadcn UI, Recharts (for bar charts) |
| AI Module               | GROQ Cloud (AI API integration)      |
| Reverse Geocoding       | OpenCage (Location name resolution)  |
| Build Tool              | Vite                                 |
| Backend Data Handling   | Python (Serial Communication, File Writing) |
| Server                  | Python HTTP Server (started via systemd) |

---

## Sensors Used

| Sensor / Module | Purpose                                   |
|-----------------|-------------------------------------------|
| MQ-135          | Detects gases such as NH₃, NOₓ, alcohol, benzene, smoke, CO₂. |
| PMS7003         | Measures particulate matter (PM1.0, PM2.5, PM10) concentrations. |
| Neo-6M GPS      | Provides geolocation data (latitude, longitude). |

---

## Data Flow Details

 - **Sensor Layer**:
   - MQ-135, PMS7003, and Neo-6M continuously monitor environmental conditions and geographic location.

 - **Microcontroller (Arduino)**:
   - Collects sensor and GPS readings.
   - Formats and transmits data over serial.

 - **Processing Unit (Raspberry Pi)**:
   - Python script reads incoming serial data.
   - Saves the latest readings into \`dist/points.txt\`.

 - **Web Server**:
   - A lightweight Python server hosts the \`dist/\` folder.
   - Managed automatically via a **systemd** service.

 - **Frontend Application**:
   - Periodically fetches \`points.txt\`.
   - Parses sensor values and geolocation.
   - Displays data across multiple dashboards:
     - **Map View**: Points plotted with GPS coordinates.
     - **Raw Data Table**: Latest sensor readings.
     - **Bar Chart**: Visualizes various AQI metrics.
     - **AI Overview**: Highlights key trends and insights.

---

## Project Structure

\`\`\`bash
        ts-dronitor/
        ├── dist/                # Production build output (served by Python server)
        │   ├── index.html
        │   ├── assets/
        │   └── points.txt       # Real-time environmental and GPS data
        ├── public/              # Static assets
        ├── src/                 # Application source code
        │   ├── components/      # Reusable UI components (tables, charts, etc.)
        │   ├── hooks/           # Custom React hooks
        │   ├── pages/           # Pages (e.g., Dashboard, Documentation.tsx)
        │   ├── utils/           # Utilities (data parsing, calculations)
        │   └── main.tsx         # App bootstrap
        ├── README.md            # Project overview
        ├── package.json         # Scripts and dependencies
        ├── tsconfig.json        # TypeScript compiler settings
        ├── vite.config.ts       # Vite build settings
        └── eslint.config.js     # ESLint rules
\`\`\`

---

## Building the Application

\`\`\`bash
npm install
npm run build
\`\`\`

 - Output will be located in \`dist/\`.
 - Served automatically by the Python server managed by systemd.

 > **Note**: No manual server startup is needed on the Raspberry Pi.

---

## Dashboard Features

 - **Interactive Map (Leaflet)**:
   - Displays real-time geospatial air quality data.

 - **AI Overview (GROQ Cloud + OpenCage)**:
   - Pre-processes coordinates into readable locations (OpenCage).
   - Provides quick summaries and trends from sensor readings.

 - **Raw Data Table**:
   - Displays latest raw data entries for transparency and debugging.

 - **Bar Chart Visualization**:
   - Compares different AQI indices for PM1.0, PM2.5, PM10, and gas concentrations.

 ---

## Future Enhancements

 - Integrate WebSocket for real-time data push updates.
 - Implement historical data storage with SQLite.
 - Enable alerting based on threshold exceedance (e.g., high PM2.5 levels).
 - Expand AI module for predictive analytics.

 ---

# End of Documentation
        `;
  return (
    <div className="w-full flex flex-col items-center justify-center pt-5">
      <article className="prose dark:prose-invert text-pretty w-full px-[20px]">
        <Markdown remarkPlugins={[remarkGfm]}>{markdownText}</Markdown>
      </article>
    </div>
  );
}

export default Documentation;
