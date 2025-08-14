export interface WeatherResponse {
  lat: number;
  lon: number;
  tz: string;
  date: string;
  units: string;
  weather_overview: string;
  forecast_5_days: Array<{
    date: string;
    temp_min: number;
    temp_max: number;
    weather: string;
    icon: string;
  }>;
}