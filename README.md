
# ts-dronitor

**ts-dronitor** is a TypeScript-based drone environmental monitoring platform, built with modern front-end technologies including React, Leaflet JS for mapping, and Shadcn UI for components.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

**ts-dronitor** provides an interactive map-based interface for monitoring environmental data collected by drones. It aims to assist in visualizing and analyzing spatial environmental information efficiently.

---

## Features

- 🗺️ **Interactive Maps**: Real-time map visualization powered by Leaflet JS.
- 🎛️ **Modern UI**: Built with Shadcn UI for a clean and responsive design.
- ⚡ **High Performance**: Powered by Vite for fast development and optimized builds.
- 🔧 **Developer Friendly**: Fully typed with TypeScript and linted with ESLint.

---

## Tech Stack

- **Frontend**: React + TypeScript
- **Mapping Library**: Leaflet JS
- **UI Components**: Shadcn UI
- **Bundler**: Vite
- **Linting**: ESLint

---

## Getting Started

Follow these steps to set up the project locally.

### Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (version 18 or higher recommended)
- npm (comes with Node.js)

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/LiewJiaKang/ts-dronitor.git
   cd ts-dronitor
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Start the development server:**

   ```bash
   npm run dev
   ```

4. **Open your browser:**

   Visit [http://localhost:5173](http://localhost:5173) to view the application.

---

## Project Structure

```bash
ts-dronitor/
├── public/              # Static assets
├── src/                 # Application source code
│   ├── components/      # React components
│   ├── hooks/           # Custom React hooks
│   ├── pages/           # Page components
│   ├── utils/           # Utility functions
│   └── main.tsx         # Application entry point
├── .eslintrc.js         # ESLint configuration
├── tsconfig.json        # TypeScript configuration
├── vite.config.ts       # Vite configuration
└── README.md            # Project documentation
```

---

## Contributing

Contributions are welcome and appreciated.  
To contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature-name`).
3. Commit your changes (`git commit -m 'Add new feature'`).
4. Push to the branch (`git push origin feature/your-feature-name`).
5. Create a Pull Request.

Please ensure your code adheres to the existing style and passes all linting checks.

---

## License

This project is licensed under the [MIT License](LICENSE).
