import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class AppService {
  private readonly baseUrl = 'https://api.openweathermap.org/data/2.5';
  private readonly apiKey: string;

  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.get<string>('OPENWEATHER_API_KEY')!;
  }

  async getWeather(location: string) {
    if (!this.apiKey) {
      throw new HttpException('API key not set', HttpStatus.BAD_REQUEST);
    }
    try {
      const currentRes = await axios.get(`${this.baseUrl}/weather`, {
        params: {
          q: location,
          appid: this.apiKey,
          units: 'metric',
        },
      });
      const forecastRes = await axios.get(`${this.baseUrl}/forecast`, {
        params: {
          q: location,
          appid: this.apiKey,
          units: 'metric',
        },
      });
      const currentData = currentRes.data;

      // Merge forecast into daily data
      const forecastList = forecastRes.data.list;
      const dailyMap = new Map<string, any>();

      forecastList.forEach((item) => {
        const date = item.dt_txt.split(' ')[0]; // yyyy-mm-dd
        if (!dailyMap.has(date)) {
          dailyMap.set(date, {
            date,
            temp_min: item.main.temp_min,
            temp_max: item.main.temp_max,
            weather: item.weather[0].description,
            icon: item.weather[0].icon,
          });
        } else {
          const day = dailyMap.get(date);
          day.temp_min = Math.min(day.temp_min, item.main.temp_min);
          day.temp_max = Math.max(day.temp_max, item.main.temp_max);
        }
      });
      const forecast = Array.from(dailyMap.values()).slice(0, 5); // Next 5 days

      // Construct overview text
      const weather_overview = `The current weather is ${currentData.weather[0].description} with a temperature of ${currentData.main.temp}°C, feels like ${currentData.main.feels_like}°C. Wind speed is ${currentData.wind.speed} m/s coming from ${currentData.wind.deg}°, humidity is ${currentData.main.humidity}%, and pressure is ${currentData.main.pressure} hPa.`;

      return {
        lat: currentData.coord.lat,
        lon: currentData.coord.lon,
        tz: forecastRes.data.city.timezone
          ? `UTC${forecastRes.data.city.timezone / 3600 >= 0 ? '+' : ''}${forecastRes.data.city.timezone / 3600}`
          : 'UTC',
        date: new Date(currentData.dt * 1000).toISOString(),
        units: 'metric',
        weather_overview,
        forecast_5_days: forecast,
      };
    } catch (error) {
      throw new HttpException(
        `Failed to fetch weather: ${error.response?.data?.message || error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
