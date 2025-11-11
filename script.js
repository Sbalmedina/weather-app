// console.log("Hello, World!");

const ddlUnits = document.querySelector("ddlUnits");

async function getGeoData() {
  const search = "los angeles, ca";
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(search)}&format=jsonv2`;

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "MyWeatherApp/1.0 (your_email@example.com)",
        "Accept-Language": "en"
      }
    });

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const result = await response.json();
    console.log("Geo data:", result);

    if (result.length > 0) {
      const lat = result[0].lat;
      const lon = result[0].lon;
      console.log(`Coordinates: lat=${lat}, lon=${lon}`);

      // ✅ Pass coordinates to the weather function
      await getWeatherData(lat, lon);
    } else {
      console.error("No location results found.");
    }

  } catch (error) {
    console.error("Error in getGeoData:", error.message);
  }
}

async function getWeatherData(lat, lon) {
  let tempUnit = "celsius";
  let windUnit = "kmh";
  let precipUnit = "mm";

  // if toggle value = F
  if (ddlUnits.value === "F") {
    tempUnit = "fahrenheit";
    windUnit = "mph";
    precipUnit = "inch";
  }

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=weather_code,temperature_2m_max,temperature_2m_min&hourly=temperature_2m,weather_code&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,precipitation,wind_speed_10m&wind_speed_unit=${windUnit}&temperature_unit=${tempUnit}&precipitation_unit=${precipUnit}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    weatherData = await response.json();
    console.log(weatherData);

    loadCurrentWeather(weatherData);
    loadDailyForecast(weatherData);
    loadHourlyForecast(weatherData);
  } catch (error) {
    console.error(error.message);
  }
}

// ✅ Start by getting the geo data (this calls getWeatherData automatically)
getGeoData();
