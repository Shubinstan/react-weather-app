# React Weather Forecast Application

A modern, responsive single-page application that provides real-time weather data and a 5-day forecast. The project is built with React and TypeScript, utilizing the Vite build tool for a high-performance development experience.

*[Link to your live demo on Vercel will go here]*

![React Weather App Screenshot](https://github.com/Shubinstan/weather-app/raw/main/screenshots/weather_screenshot.png?raw=true)

---

## Key Features

-   **Real-time Weather Data:** Fetches and displays current weather conditions, including temperature, wind speed, humidity, and pressure.
-   **5-Day Forecast:** Provides a daily forecast for the next five days.
-   **City Search & Geolocation:** Allows users to search for any city worldwide or get instant weather data for their current location.
-   **Secure API Key Handling:** All API keys are securely managed using environment variables (`.env`) and are not exposed on the client-side.
-   **Dynamic UI:** The application's background and animated effects (rain, snow) change dynamically to match the current weather.
-   **Scroll-Aware Header:** The header title transitions to the current city name when the user scrolls down.
-   **Light & Dark Mode:** A persistent theme toggle for user comfort.
-   **Responsive Design:** Fully optimized for a seamless experience on mobile, tablet, and desktop devices.

---

## Technology Stack

This project was built using a modern front-end stack, demonstrating a variety of professional skills:

-   **Core Technologies:** React, TypeScript, HTML5, CSS3
-   **Development Tools:** Vite, Node.js/npm, Git & GitHub
-   **Styling:** CSS Variables, Flexbox, CSS Grid, Media Queries, Animations
-   **State Management:** React Hooks (`useState`, `useEffect`, `useRef`)
-   **APIs & Data Fetching:**
    -   Asynchronous JavaScript (`async/await`) with the Fetch API
    -   OpenWeatherMap API (Weather Data)
    -   OpenCage Geocoding API (City Suggestions)
-   **Browser APIs:** Geolocation, IntersectionObserver, LocalStorage

---

## Setup and Local Installation

To run this project locally, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/Shubinstan/react-weather-app.git](https://github.com/Shubinstan/react-weather-app.git)
    cd react-weather-app
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    -   Create a `.env` file in the root of the project.
    -   Add your API keys to this file:
        ```
        VITE_WEATHER_API_KEY=your_openweathermap_api_key
        VITE_OPENCAGE_API_KEY=your_opencage_api_key
        ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

The application will then be available at `http://localhost:5173`.
