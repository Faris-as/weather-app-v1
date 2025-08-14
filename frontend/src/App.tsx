import React, { useState } from 'react';
import axios from 'axios';
import LocationInput from './components/LocationInput';
import WeatherCard from './components/WeatherCard';
import { WeatherData } from './types/weather';
import { Cloud, Sun, CloudRain } from 'lucide-react';

function App() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchWeather = async (location: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(`http://localhost:3000/weather`, {
        params: { location }
      });
      
      setWeather(response.data);
    } catch (err: any) {
      setError(
        err.response?.data?.message || 
        'Failed to fetch weather data. Please try again.'
      );
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 text-blue-200 opacity-20">
          <Sun className="w-32 h-32 animate-pulse" />
        </div>
        <div className="absolute top-40 right-20 text-indigo-200 opacity-20">
          <Cloud className="w-24 h-24 animate-bounce" />
        </div>
        <div className="absolute bottom-20 left-1/4 text-purple-200 opacity-20">
          <CloudRain className="w-28 h-28 animate-pulse" />
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <LocationInput onSearch={searchWeather} loading={loading} />
        
        {error && (
          <div className="max-w-2xl mx-auto mb-8">
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="text-red-600 font-bold">!</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-red-800 font-semibold">Error</h3>
                  <p className="text-red-700">{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {weather && <WeatherCard weather={weather} />}
        
        {!weather && !loading && !error && (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="text-6xl mb-6">🌤️</div>
              <h2 className="text-2xl font-bold text-gray-700 mb-4">
                Welcome to Weather Forecast
              </h2>
              <p className="text-gray-500 text-lg">
                Enter a location above to get started with current weather and 5-day forecast
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;