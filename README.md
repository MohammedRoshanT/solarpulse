
# SolarPulse

> **Space weather, as it happens.**

SolarPulse is a production-quality, single-page Space Weather Dashboard built for the **μLearn / NASA Space Apps preselection challenge: "Space Weather Dashboard"**.

It converts live NOAA observations into a clear, visually polished overview of solar activity, geomagnetic storms, solar wind, and recent space-weather events.

<img width="1911" height="1088" alt="Screenshot 2026-10-04 112343" src="https://github.com/user-attachments/assets/d74009f2-a287-407a-a13e-663007a3ab71" />

<img width="1897" height="1083" alt="Screenshot 2026-10-04 112331" src="https://github.com/user-attachments/assets/17bd2065-5697-42f2-aafe-1f2256bfa32f" />

## Overview & Key Features

- **Atmospheric Scientific Glassmorphism**: A meticulously crafted UI using Tailwind CSS designed to look like a modern mission-control interface.
- **Live Telemetry & Metrics**: Displays up-to-date Geomagnetic Kp, Solar Flare X-ray flux, Solar Wind speed, and IMF Bz.
- **Advanced Visualizations**: Uses `recharts` to render a 3-day planetary Kp bar chart, a 24h logarithmic X-ray flux line chart, and solar wind speed tracking.
- **Event Timeline**: A unified feed of recent space weather alerts (solar flares, geomagnetic storms, CMEs).
- **Intelligent Status Derivation**: Derives an overarching educational space-weather status (Quiet, Elevated, Storm) based on the latest NOAA scales and readings.
- **Earth & Mission Impact**: Explains how current space weather conditions can affect satellites, navigation (GNSS), HF radio, and astronauts.
- **Resilient API Architecture**: Aggregates multiple external sources server-side with strict timeouts and validation. Handled gracefully so one failed endpoint does not crash the dashboard.

## Tech Stack

- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Charts**: Recharts
- **Icons**: Lucide React
- **Dates**: date-fns

## Data Sources & Verified Endpoints

This dashboard fetches data exclusively from official, public government space-weather APIs.

**NOAA Space Weather Prediction Center (SWPC):**
- Planetary Kp Index: `https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json`
- NOAA Scales (G, S, R): `https://services.swpc.noaa.gov/products/noaa-scales.json`
- GOES Primary X-ray Flux: `https://services.swpc.noaa.gov/json/goes/primary/xrays-1-day.json`
- Real-time Solar Wind (Speed): `https://services.swpc.noaa.gov/json/rtsw/rtsw_wind_1m.json`
- Real-time Solar Wind (Mag): `https://services.swpc.noaa.gov/json/rtsw/rtsw_mag_1m.json`
- Alerts & Watches: `https://services.swpc.noaa.gov/products/alerts.json`

**NASA CCMC DONKI:**
- *Note:* During integration testing, the NASA DONKI API (`https://ccmc.gsfc.nasa.gov/DONKI-API/get/FLR`) was verified but observed to timeout consistently. To maintain dashboard resilience, SolarPulse gracefully marks DONKI as unavailable and relies on NOAA SWPC for all space event telemetry.

## Local Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd nasa-space-apps-challenge
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Environment Variables:**
   - Copy `.env.example` to `.env` (No API keys are required; everything uses public keyless endpoints).
4. **Run the development server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` with your browser to see the result.

## Environment Variables

No API keys or authentication secrets are required to run this project. A `.env.example` file is included purely for standardizing configurations if needed in the future.

## Disclaimer

**Educational visualization only.** This dashboard uses publicly available NASA and NOAA space-weather data but is not an official forecast or warning service. Not affiliated with NASA or NOAA.
