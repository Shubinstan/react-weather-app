export interface ForecastItem {
  dt: number;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
  };
  weather: {
    main: string;
    description: string;
    icon: string;
  }[];
  wind: {
    speed: number;
  };
  dt_txt: string;
}

export interface City {
  name: string;
  country: string;
  sunrise: number;
  sunset: number;
  timezone: number;
}

export interface WeatherData {
  list: ForecastItem[];
  city: City;
}

export interface CitySuggestion {
  id: string;
  name: string;
  country: string;
}
