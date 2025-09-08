import { WeatherData, CitySuggestion } from './types';

const weatherApiKey = import.meta.env.VITE_WEATHER_API_KEY;
const openCageApiKey = import.meta.env.VITE_OPENCAGE_API_KEY;

export const fetchWeatherByCity = async (city: string): Promise<WeatherData> => {
  const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${weatherApiKey}&units=metric&lang=en`);
  if (!response.ok) throw new Error('City not found');
  return response.json();
};

export const fetchWeatherByCoords = async (lat: number, lon: number): Promise<WeatherData> => {
  const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${weatherApiKey}&units=metric&lang=en`);
  if (!response.ok) throw new Error('Could not fetch weather for coordinates');
  return response.json();
};

export const fetchCitySuggestions = async (query: string): Promise<CitySuggestion[]> => {
  const response = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${query}&key=${openCageApiKey}&language=en&limit=5`);
  const data = await response.json();
  return data.results.map((result: any) => ({
    id: result.annotations.geohash,
    name: result.components.city || result.components.town || result.components.village,
    country: result.components.country,
  }));
};
