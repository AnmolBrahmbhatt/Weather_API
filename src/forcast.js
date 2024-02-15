import React, { useState, useEffect } from "react";
import axios from "axios";
import apiKeys from "./apiKeys";
import ReactAnimatedWeather from "react-animated-weather";

function Forecast(props) {
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [weather, setWeather] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const search = (city) => {
    axios
      .get(
        `${apiKeys.base}weather?q=${city}&units=metric&APPID=${apiKeys.key}`
      )
      .then((response) => {
        setWeather(response.data);
        setQuery("");
        setIsLoading(false);
      })
      .catch(function (error) {
        console.log(error);
        setWeather({});
        setQuery("");
        setIsLoading(false);
        setError({ message: "Not Found", query: city });
      });
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      axios
        .get(
          `${apiKeys.base}weather?lat=${latitude}&lon=${longitude}&units=metric&APPID=${apiKeys.key}`
        )
        .then((response) => {
          setWeather(response.data);
          setIsLoading(false);
        })
        .catch((error) => {
          console.log(error);
          setIsLoading(false);
          setError({ message: "Not Found", query: "Current Location" });
        });
    });
  }, []);

  const defaults = {
    color: "white",
    size: 112,
    animate: true,
  };

  return (
    <div className="forecast">
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="forecast-icon">
            <ReactAnimatedWeather
              icon={props.icon}
              color={defaults.color}
              size={defaults.size}
              animate={defaults.animate}
            />
          </div>
          <div className="today-weather">
            <h3>{props.weather}</h3>
            <div className="search-box">
              <input
                type="text"
                className="search-bar"
                placeholder="Search any city"
                onChange={(e) => setQuery(e.target.value)}
                value={query}
              />
              <div className="img-box">
                {" "}
                <img
                  src="https://images.avishkaar.cc/workflow/newhp/search-white.png"
                  onClick={() => search(query)}
                />
              </div>
            </div>
            <ul>
              {weather.main ? (
                <>
                  <li className="cityHead">
                    <p>
                      {weather.name}, {weather.sys.country}
                    </p>
                    <img
                      className="temp"
                      src={`https://openweathermap.org/img/wn/${
                        weather.weather[0].icon
                      }.png`}
                      alt={weather.weather[0].description}
                    />
                  </li>
                  <li>
                    Temperature{" "}
                    <span className="temp">
                      {Math.round(weather.main.temp)}°c (
                      {weather.weather[0].main})
                    </span>
                  </li>
                  <li>
                    Humidity{" "}
                    <span className="temp">
                      {Math.round(weather.main.humidity)}%
                    </span>
                  </li>
                  <li>
                    Visibility{" "}
                    <span className="temp">
                      {Math.round(weather.visibility)} mi
                    </span>
                  </li>
                  <li>
                    Wind Speed{" "}
                    <span className="temp">
                      {Math.round(weather.wind.speed)} Km/h
                    </span>
                  </li>
                </>
              ) : (
                <li>
                  {error.query} {error.message}
                </li>
              )}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}

export default Forecast;
