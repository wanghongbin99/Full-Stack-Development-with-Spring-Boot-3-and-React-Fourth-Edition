import { useState, useEffect } from "react";

import "./App.css";
import HelloComponent from "./HelloComponent";

function App() {
  const [weather, setWeather] = useState({
    temp: "",
    desc: "",
    icon: "",
  });
  useEffect(() => {
    const fetchWeather = async () => {
      const response = await fetch(
        "https://api.openweathermap.org/data/2.5/weather?q=Singapore&appid=79b829a813c9027585efab98b8bd1302&units=metric"
      );
      const data = await response.json();
      setWeather({
        temp: data.main.temp,
        desc: data.weather[0].description,
        icon: data.weather[0].icon,
      });
    };
    fetchWeather();
  }, []);

  if (weather.icon) {
    return (
      <div className="App">
        <h1>Weather App</h1>
        <h2>Temperature: {weather.temp}°C</h2>
        <h2>Description: {weather.desc}</h2>
        <img
          src={`http://openweathermap.org/img/wn/${weather.icon}.png`}
          alt="Weather Icon"
        />
        <hr />
        <HelloComponent sname="John" age={30} />
      </div>
    );
  } else {
    return (
      <div className="App">
        <h1>Weather App</h1>
        <h2>Loading...</h2>
      </div>
    );
  }
}

export default App;
