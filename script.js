document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM Content Loaded");  // Debugging log
  const apiKey = "15a794d8991ff1578c2b8d32b690655f"; // Replace with your OpenWeather API key
  const getWeatherBtn = document.getElementById("getWeather");
  const loadingText = document.getElementById("loading");
  const errorText = document.getElementById("error");
  const weatherCard = document.getElementById("weatherCard");
  const cityName = document.getElementById("cityName");
  const weatherIcon = document.getElementById("weatherIcon");
  const temperature = document.getElementById("temperature");
  const weatherDescription = document.getElementById("weatherDescription");

  // Debugging: Log button to ensure it is selected correctly
  console.log(getWeatherBtn);

  getWeatherBtn.addEventListener("click", () => {
    console.log("Button Clicked!");  // Debugging log
    getCurrentLocationWeather();
  });

  async function getCurrentLocationWeather() {
    console.log("Getting weather...");  // Debugging log
    loadingText.classList.remove("hidden");
    errorText.classList.add("hidden");
    weatherCard.classList.add("hidden");

    if (navigator.geolocation) {
      console.log("Geolocation supported");
      navigator.geolocation.getCurrentPosition(fetchWeather, showError);
    } else {
      errorText.textContent = "Geolocation is not supported by this browser.";
      errorText.classList.remove("hidden");
      loadingText.classList.add("hidden");
    }
  }

  async function fetchWeather(position) {
    console.log("Fetching weather data...");  // Debugging log
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    try {
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      if (data.cod !== 200) {
        throw new Error(data.message || "Invalid response from API");
      }

      const weather = data.weather[0].main;
      const temp = data.main.temp;

      cityName.textContent = data.name;
      temperature.textContent = `${temp}°C`;
      weatherDescription.textContent = data.weather[0].description;

      // Weather Icon
      getWeatherIcon(weather);

      loadingText.classList.add("hidden");
      weatherCard.classList.remove("hidden");
    } catch (error) {
      errorText.textContent = `Error: ${error.message}`;
      errorText.classList.remove("hidden");
      loadingText.classList.add("hidden");
    }
  }

  function getWeatherIcon(condition) {
    weatherIcon.innerHTML = ""; // Clear previous icon
    const icon = document.createElement("img");

    if (condition.includes("Clear")) {
      icon.src = "https://openweathermap.org/img/wn/01d.png"; // Example sunny icon
    } else if (condition.includes("Cloud")) {
      icon.src = "https://openweathermap.org/img/wn/02d.png"; // Example cloudy icon
    } else if (condition.includes("Rain")) {
      icon.src = "https://openweathermap.org/img/wn/09d.png"; // Example rainy icon
    } else if (condition.includes("Snow")) {
      icon.src = "https://openweathermap.org/img/wn/13d.png"; // Example snowy icon
    } else {
      icon.src = "https://openweathermap.org/img/wn/01d.png"; // Default icon
    }

    weatherIcon.appendChild(icon);
  }

  function showError(error) {
    console.log("Error:", error);  // Debugging log
    switch(error.code) {
      case error.PERMISSION_DENIED:
        errorText.textContent = "User denied the request for Geolocation.";
        break;
      case error.POSITION_UNAVAILABLE:
        errorText.textContent = "Location information is unavailable.";
        break;
      case error.TIMEOUT:
        errorText.textContent = "The request to get user location timed out.";
        break;
      case error.UNKNOWN_ERROR:
        errorText.textContent = "An unknown error occurred.";
        break;
    }

    errorText.classList.remove("hidden");
    loadingText.classList.add("hidden");
  }
});
