import React from 'react';
import { WeatherData } from '../types/weather';
import { MapPin, Thermometer, Wind, Droplets, Gauge, Calendar } from 'lucide-react';

interface WeatherCardProps {
  weather: WeatherData;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ weather }) => {
  const getCurrentTemp = () => {
    const overview = weather.weather_overview;
    const tempMatch = overview.match(/temperature of ([\d.]+)°C/);
    return tempMatch ? parseFloat(tempMatch[1]) : null;
  };

  const getFeelsLike = () => {
    const overview = weather.weather_overview;
    const feelsMatch = overview.match(/feels like ([\d.]+)°C/);
    return feelsMatch ? parseFloat(feelsMatch[1]) : null;
  };

  const getWindSpeed = () => {
    const overview = weather.weather_overview;
    const windMatch = overview.match(/Wind speed is ([\d.]+) m\/s/);
    return windMatch ? parseFloat(windMatch[1]) : null;
  };

  const getHumidity = () => {
    const overview = weather.weather_overview;
    const humidityMatch = overview.match(/humidity is (\d+)%/);
    return humidityMatch ? parseInt(humidityMatch[1]) : null;
  };

  const getPressure = () => {
    const overview = weather.weather_overview;
    const pressureMatch = overview.match(/pressure is (\d+) hPa/);
    return pressureMatch ? parseInt(pressureMatch[1]) : null;
  };

  const getWeatherCondition = () => {
    const overview = weather.weather_overview;
    const conditionMatch = overview.match(/weather is ([^,]+)/);
    return conditionMatch ? conditionMatch[1] : 'Unknown';
  };

  const currentTemp = getCurrentTemp();
  const feelsLike = getFeelsLike();
  const windSpeed = getWindSpeed();
  const humidity = getHumidity();
  const pressure = getPressure();
  const condition = getWeatherCondition();

  const getWeatherIcon = (iconCode: string) => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getGradientClass = () => {
    if (!currentTemp) return 'from-blue-400 to-blue-600';
    
    if (currentTemp < 0) return 'from-blue-600 to-purple-700';
    if (currentTemp < 10) return 'from-blue-400 to-blue-600';
    if (currentTemp < 20) return 'from-green-400 to-blue-500';
    if (currentTemp < 30) return 'from-yellow-400 to-orange-500';
    return 'from-orange-500 to-red-600';
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Current Weather Card */}
      <div className={`bg-gradient-to-br ${getGradientClass()} rounded-3xl p-8 text-white shadow-2xl mb-8`}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <MapPin className="w-6 h-6" />
            <span className="text-lg font-medium">
              {weather.lat.toFixed(2)}°, {weather.lon.toFixed(2)}°
            </span>
          </div>
          <div className="text-right">
            <div className="text-sm opacity-90">{weather.tz}</div>
            <div className="text-sm opacity-90">
              {new Date(weather.date).toLocaleString()}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="flex items-center space-x-4 mb-4">
              <div className="text-6xl font-bold">
                {currentTemp ? `${Math.round(currentTemp)}°` : '--°'}
              </div>
              <div className="text-right">
                <div className="text-xl capitalize">{condition}</div>
                {feelsLike && (
                  <div className="text-sm opacity-90">
                    Feels like {Math.round(feelsLike)}°
                  </div>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-6">
              {windSpeed && (
                <div className="flex items-center space-x-2">
                  <Wind className="w-5 h-5" />
                  <div>
                    <div className="text-sm opacity-90">Wind</div>
                    <div className="font-semibold">{windSpeed} m/s</div>
                  </div>
                </div>
              )}
              
              {humidity && (
                <div className="flex items-center space-x-2">
                  <Droplets className="w-5 h-5" />
                  <div>
                    <div className="text-sm opacity-90">Humidity</div>
                    <div className="font-semibold">{humidity}%</div>
                  </div>
                </div>
              )}
              
              {pressure && (
                <div className="flex items-center space-x-2">
                  <Gauge className="w-5 h-5" />
                  <div>
                    <div className="text-sm opacity-90">Pressure</div>
                    <div className="font-semibold">{pressure} hPa</div>
                  </div>
                </div>
              )}
              
              <div className="flex items-center space-x-2">
                <Thermometer className="w-5 h-5" />
                <div>
                  <div className="text-sm opacity-90">Units</div>
                  <div className="font-semibold capitalize">{weather.units}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6">
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Weather Overview
              </h3>
              <p className="text-sm leading-relaxed opacity-95">
                {weather.weather_overview}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 5-Day Forecast */}
      <div className="bg-white rounded-3xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <Calendar className="w-6 h-6 mr-2 text-blue-600" />
          5-Day Forecast
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {weather.forecast_5_days.map((day, index) => (
            <div
              key={day.date}
              className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              <div className="font-semibold text-gray-800 mb-2">
                {index === 0 ? 'Today' : formatDate(day.date)}
              </div>
              
              <div className="flex justify-center mb-3">
                <img
                  src={getWeatherIcon(day.icon)}
                  alt={day.weather}
                  className="w-16 h-16"
                />
              </div>
              
              <div className="text-sm text-gray-600 capitalize mb-3 font-medium">
                {day.weather}
              </div>
              
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">High</span>
                  <span className="font-bold text-red-500">
                    {Math.round(day.temp_max)}°
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">Low</span>
                  <span className="font-bold text-blue-500">
                    {Math.round(day.temp_min)}°
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;