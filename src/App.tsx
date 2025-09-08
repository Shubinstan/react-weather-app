// Import React hooks and necessary assets/modules
import React, { useState, useEffect, useRef } from 'react';
import './style.css';
import { getWeatherIcon } from './weatherIcons';
import { fetchWeatherByCity, fetchWeatherByCoords, fetchCitySuggestions } from './apiService';
import { WeatherData, CitySuggestion, ForecastItem } from './types';
import Precipitation from './Precipitation';

function App() {
    // --- STATE MANAGEMENT ---
    // Manages the current theme (light/dark), persisted in localStorage
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
    // Manages the visibility of the slide-out menu
    const [isMenuOpen, setMenuOpen] = useState(false);
    // Stores the complete weather data object from the API
    const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
    // Stores the forecast data for the currently selected day
    const [selectedDay, setSelectedDay] = useState<ForecastItem | null>(null);
    // Stores the list of city suggestions for the search input
    const [suggestions, setSuggestions] = useState<CitySuggestion[]>([]);
    // Manages the value of the search input field
    const [searchTerm, setSearchTerm] = useState('');
    // Manages the loading state while fetching data
    const [isLoading, setIsLoading] = useState(false);
    // Stores any error messages to display to the user
    const [error, setError] = useState<string | null>(null);
    // Stores the current weather condition string for the precipitation animation
    const [weatherCondition, setWeatherCondition] = useState<string | null>(null);

    // --- REFS ---
    // Ref to attach to the city name element for the IntersectionObserver
    const cityNameRef = useRef<HTMLDivElement>(null);
    // Ref to attach to the header element to toggle classes
    const headerRef = useRef<HTMLElement>(null);

    // --- EFFECTS ---
    // This unified effect manages all dynamic classes on the <body> tag.
    // It runs whenever the theme, menu state, or selected day changes, preventing conflicts.
    useEffect(() => {
        // <<<<<<<<<<<<<<<< ИСПРАВЛЕНИЕ: Явно указываем, что это массив строк >>>>>>>>>>>>>>>>
        const classesToAdd: string[] = [];

        // 1. Add theme class
        if (theme === 'dark') {
            classesToAdd.push('dark-mode');
        }

        // 2. Add menu-open class
        if (isMenuOpen) {
            classesToAdd.push('menu-open');
        }

        // 3. Add weather condition class and update state for precipitation component
        if (selectedDay) {
            const mainCondition = selectedDay.weather[0].main.toLowerCase();
            classesToAdd.push(mainCondition);
            setWeatherCondition(mainCondition);
        } else {
            setWeatherCondition(null);
        }

        // 4. Apply all classes at once, replacing previous ones
        document.body.className = classesToAdd.join(' ');
        
        // Persist the theme choice in localStorage
        localStorage.setItem('theme', theme);

    }, [theme, isMenuOpen, selectedDay]); // Re-runs this effect if any of these values change
    
    // This effect sets up an IntersectionObserver to watch the main city name.
    // When the city name scrolls out of view, it adds a class to the header.
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                headerRef.current?.classList.toggle('show-city', !entry.isIntersecting);
            },
            { threshold: 0.1 } // Triggers when less than 10% of the element is visible
        );

        const currentCityNameRef = cityNameRef.current;
        if (currentCityNameRef) {
            observer.observe(currentCityNameRef);
        }
        
        // Cleanup function to unobserve the element when the component unmounts or weatherData changes
        return () => {
            if (currentCityNameRef) {
                observer.unobserve(currentCityNameRef);
            }
        };
    }, [weatherData]);


    // --- EVENT HANDLERS & API CALLS ---
    // Fetches weather data for a specific city name
    const handleSearch = async (city: string) => {
        if (!city) return;
        setIsLoading(true);
        setError(null);
        setSuggestions([]);
        setSearchTerm('');
        try {
            const data = await fetchWeatherByCity(city);
            const dailyData = data.list.filter(item => item.dt_txt.includes("12:00:00"));
            setWeatherData(data);
            setSelectedDay(dailyData[0] || data.list[0]);
        } catch (err) {
            setError('City not found. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };
    
    // Fetches weather data based on the user's geolocation
    const handleLocationSearch = () => {
        if (!navigator.geolocation) {
            setError("Geolocation is not supported by your browser.");
            return;
        }
        setIsLoading(true);
        setError(null);
        navigator.geolocation.getCurrentPosition(async (position) => {
            try {
                const data = await fetchWeatherByCoords(position.coords.latitude, position.coords.longitude);
                const dailyData = data.list.filter(item => item.dt_txt.includes("12:00:00"));
                setWeatherData(data);
                setSelectedDay(dailyData[0] || data.list[0]);
            } catch (err) {
                 setError('Could not fetch weather for your location.');
            } finally {
                setIsLoading(false);
            }
        }, () => {
            setError("Unable to retrieve your location.");
            setIsLoading(false);
        });
    };

    // Fetches city suggestions as the user types in the search bar
    const handleSuggestionSearch = async (query: string) => {
        setSearchTerm(query);
        if (query.length < 2) {
            setSuggestions([]);
            return;
        }
        try {
            const results = await fetchCitySuggestions(query);
            setSuggestions(results);
        } catch (error) {
            console.error("Suggestion fetch error:", error);
            setSuggestions([]);
        }
    };
    
    // Derived state: filters the full forecast to get one entry per day for the 5-day forecast display
    const dailyForecast = weatherData?.list.filter(item => item.dt_txt.includes("12:00:00")).slice(0, 5);

    // --- RENDER ---
    return (
        <>
            {/* Renders the precipitation animation based on the current weather condition */}
            <Precipitation condition={weatherCondition} /> 
            
            {/* The slide-out navigation menu */}
            <nav id="menu">
                <ul>
                    <li><a href="#news">NEWS</a></li>
                    <li><a href="#weather">WEATHER</a></li>
                    <li><a href="#maps">MAPS</a></li>
                    <li><a href="#apps">APPS</a></li>
                </ul>
            </nav>
            
            {/* The overlay that appears when the menu is open */}
            <div id="menu-overlay" onClick={() => setMenuOpen(false)}></div>

            {/* The main header of the application */}
            <header ref={headerRef}>
                <div className="menu-toggle" onClick={() => setMenuOpen(!isMenuOpen)}>
                    <div className="bar"></div>
                    <div className="bar"></div>
                    <div className="bar"></div>
                </div>
                <div id="header-logo-container">
                    <span id="header-logo-default">SUNDAY</span>
                    <span id="header-logo-city">{weatherData?.city.name}</span>
                </div>
                <div className="theme-toggle" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
                    <svg className="sun-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.106a.75.75 0 010 1.06l-1.591 1.59a.75.75 0 11-1.06-1.06l1.59-1.59a.75.75 0 011.06 0zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.894 17.894a.75.75 0 01-1.06 0l-1.59-1.591a.75.75 0 111.06-1.06l1.59 1.59a.75.75 0 010 1.061zM12 18.75a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0v-2.25a.75.75 0 01.75-.75zM5.106 17.894a.75.75 0 010-1.06l1.59-1.59a.75.75 0 111.06 1.06l-1.59 1.59a.75.75 0 01-1.06 0zM2.25 12a.75.75 0 01.75-.75h2.25a.75.75 0 010 1.5H3a.75.75 0 01-.75-.75zM6.106 5.106a.75.75 0 011.06 0l1.59 1.591a.75.75 0 11-1.06 1.06L5.106 6.166a.75.75 0 010-1.06z" /></svg>
                    <svg className="moon-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
                </div>
            </header>
            
            <div className="content-wrapper">
                {/* Initial welcome message, hidden after first search */}
                {!weatherData && <div className="welcome-message">Find your weather</div>}
                
                {/* Main application container for search and buttons */}
                <div className="app">
                    {weatherData && (
                        <>
                           <div id="country-name" className="country-name show">{weatherData.city.country}</div>
                           <div id="city-name" className="city-name show" ref={cityNameRef}>{weatherData.city.name}</div>
                        </>
                    )}
                    <div className="search-container">
                        <input 
                            type="text" 
                            id="city" 
                            placeholder="Enter city name" 
                            value={searchTerm}
                            onChange={(e) => handleSuggestionSearch(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(searchTerm); }}
                        />
                        {suggestions.length > 0 && (
                            <div id="suggestions" className="show">
                                {suggestions.map(s => (
                                    <div key={s.id} className="suggestion" onClick={() => handleSearch(s.name)}>
                                        {s.name}, {s.country}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="buttons-container">
                        <button id="get-weather-btn" onClick={() => handleSearch(searchTerm)}>Get Weather</button>
                        <button id="get-location-btn" onClick={handleLocationSearch}>Get Weather by Location</button>
                    </div>
                </div>

                {/* Conditional rendering for loading and error states */}
                {isLoading && <p>Loading...</p>}
                {error && <p className="error">{error}</p>}

                {/* Renders the 5-day forecast cards */}
                {dailyForecast && (
                    <div className="forecast-container" id="forecast">
                       {dailyForecast.map(day => (
                           <div 
                                key={day.dt} 
                                className={`forecast-card ${selectedDay?.dt === day.dt ? 'selected' : ''}`}
                                onClick={() => setSelectedDay(day)}
                            >
                               <div dangerouslySetInnerHTML={{ __html: getWeatherIcon(day.weather[0].icon) }} />
                               <p className="day-name">{new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' })}</p>
                               <p>{Math.round(day.main.temp)}°C</p>
                           </div>
                       ))}
                    </div>
                )}
                
                {/* Renders the detailed weather information for the selected day */}
                {selectedDay && weatherData && (
                    <div className="detailed-weather-container show" id="detailed-weather">
                        <div className="details-grid">
                            <div className="detail-item"><div className="label">Wind</div><div className="value">{selectedDay.wind.speed.toFixed(1)}<span className="unit">m/s</span></div></div>
                            <div className="detail-item"><div className="label">Humidity</div><div className="value">{selectedDay.main.humidity}<span className="unit">%</span></div></div>
                            <div className="detail-item"><div className="label">Sunrise</div><div className="value">{new Date(weatherData.city.sunrise * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</div></div>
                            <div className="detail-item"><div className="label">Sunset</div><div className="value">{new Date(weatherData.city.sunset * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</div></div>
                            <div className="detail-item"><div className="label">Feels Like</div><div className="value">{Math.round(selectedDay.main.feels_like)}<span className="unit">°C</span></div></div>
                            <div className="detail-item"><div className="label">Pressure</div><div className="value">{selectedDay.main.pressure}<span className="unit">hPa</span></div></div>
                        </div>
                    </div>
                )}

                {/* Displays the local time for the searched city */}
                {weatherData && <div id="current-time" className="current-time show">Local Time: {new Date(new Date().getTime() + weatherData.city.timezone * 1000 - new Date().getTimezoneOffset() * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>}

            </div>
            
            {/* The main footer of the application */}
            <footer>
                <p>© 2025 SUNDAY. Powered by OpenWeather.</p>
            </footer>
        </>
    );
}

export default App;

