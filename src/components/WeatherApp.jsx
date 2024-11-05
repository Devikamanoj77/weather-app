import React, { useState, useEffect } from 'react';
import rainy from '../assets/rainy.png';
import sunny from '../assets/sunny.png';
import snowy from '../assets/snowy.png';
import cloudy from '../assets/cloudy.png';
import './WeatherApp.css';

const WeatherApp = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [city, setCity] = useState(''); // Start with an empty city
  const [loading, setLoading] = useState(false); // Change initial loading state
  const [error, setError] = useState(null);

  // Mapping of weather conditions to their respective images
  const weatherIcons = {
    Rain: rainy,
    Clear: sunny,
    Snow: snowy,
    Clouds: cloudy,
  };

  const fetchWeatherData = async (city) => {
    const apiKey = '8ac5c4d57ba6a4b3dfcf622700447b1e';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('City not found'); // Provide a more specific error
      }
      const data = await response.json();
      setWeatherData(data);
      setLoading(false);
      setError(null); // Clear any previous errors
    } catch (error) {
      setError(error.message);
      setLoading(false);
      setWeatherData(null); // Clear weather data if there's an error
    }
  };

  useEffect(() => {
    if (city) { // Fetch only if the city is not empty
      setLoading(true); // Set loading to true before fetching
      fetchWeatherData(city);
    }
  }, [city]);

  const handleSearch = () => {
    const input = document.getElementById('cityInput');
    setCity(input.value.trim()); // Set the city to the input value and trim whitespace
    input.value = ''; // Clear the input field
  };

  return (
    <div className="weather container-fluid">
      <div className="row justify-content-center align-items-center" style={{ height: '100vh' }}>
        
        {/* Search Section */}
        <div className="col-lg-4 col-md-6 col-10 mb-4 p-5 border rounded search-box">
          <h2 className="mb-3 text-light text-center">Search Weather by City</h2>
          <input
            id="cityInput"
            className="form-control mt-3"
            type="search"
            placeholder="City"
          />
          <button className="btn btn-dark mt-3 form-control" onClick={handleSearch}>
            Search
          </button>
        </div>

        {/* Weather Details Section */}
        <div className="col-lg-4   text-light weather-details">
          <div className="border rounded p-4 weather-info">
            <h1 className="text-center">
              {loading ? 'Loading...' : (error ? error : weatherData?.name)}
            </h1>
            {!loading && weatherData && (
              <>
                <img 
                  style={{ marginLeft: '-90px' }} 
                  src={weatherIcons[weatherData.weather[0].main] || rainy} 
                  alt="Current weather icon" 
                  className="weather-icon" 
                />
                <div className="text-center mt-3">
                  <h2>Weather: {weatherData.weather[0].description}</h2>
                </div>
              </>
            )}
          </div>
          
          {/* Additional Info - Only render when weatherData is available */}
          {!loading && weatherData && (
            <div className="additional-info d-flex align-items-center mt-4">
              <div className="info-box border p-2">
                <i className="fa-solid fa-temperature-quarter"></i> {weatherData.main.temp} °C
              </div>
              <div className="info-box border p-2">
                <i className="fa-solid fa-wind"></i> {weatherData.main.humidity} %
              </div>
              <div className="info-box border p-2">
                <i className="fa-solid fa-cloud"></i> {weatherData.wind.speed} m/s
              </div>
              <div className="info-box border p-2">
                <i className="fa-solid fa-droplet"></i> {weatherData.main.pressure} hPa
              </div>
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
};

export default WeatherApp;
