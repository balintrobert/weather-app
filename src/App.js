import React, { useEffect, useState } from 'react';
import Daily from './Daily';

function App() {
  const BASE_URL = 'http://api.openweathermap.org/data/2.5/forecast?',
    API_KEY = '15a8a971b6ae66dd707d9d4bb2a235ac',
    UNITS = 'metric',
    LANG = 'RO';

  const [fetched, setFetched] = useState({});
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [structuredData, setStructuredData] = useState([]);
  const [error, setError] = useState({});
  useEffect(() => {
    fetchWeatherByLocation();
  }, []);

  useEffect(() => {
    fetchWeather();
  }, [query]);

  useEffect(() => {
    if (Object.keys(fetched).length > 2) {
      structureData();
    }
  }, [fetched]);

  const fetchWeatherByLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        try {
          const res = await fetch(
            `${BASE_URL}lat=${position.coords.latitude}&lon=${position.coords.longitude}&units=${UNITS}&lang=${LANG}&appid=${API_KEY}`
          );
          const dataFetched = await res.json();
          console.log(fetched);
          if (res.status === 200) {
            setFetched(dataFetched);
            structureData();
          } else {
            setError(dataFetched);
          }
        } catch (err) {
          console.log(err);
        }
      });
    } else {
      window.alert('Geolocation is not supported by this browser.');
    }
  };

  const fetchWeather = async () => {
    if (query !== '') {
      setFetched({});
      setStructuredData([]);
      setIsLoaded(false);
      setError({});
      try {
        const res = await fetch(
          `${BASE_URL}q=${query}&units=${UNITS}&lang=${LANG}&appid=${API_KEY}`
        );
        const dataFetched = await res.json();
        if (res.status === 200) {
          setFetched(dataFetched);
          structureData();
        } else {
          setError(dataFetched);
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  const updateSearch = (e) => {
    setSearch(e.target.value);
  };

  const getSearch = (e) => {
    e.preventDefault();
    setQuery(search);
    setSearch('');
  };

  const structureData = () => {
    try {
      if (Object.keys(fetched).length > 2) {
        let initialDate = new Date(fetched.list[0].dt * 1000);
        let forecast = [];
        let date = new Date();
        const finalData = [];
        fetched.list.forEach((item) => {
          const itemDate = new Date(item.dt * 1000);
          if (itemDate.getDate() === initialDate.getDate()) {
            const { dt, main, weather } = item;
            forecast.push({ dt, main, weather });
            date = itemDate;
          } else {
            finalData.push({ forecast, date });
            initialDate.setDate(itemDate.getDate());
            forecast = [];
          }
        });
        setIsLoaded(true);
        setStructuredData(finalData);
      } else {
        console.log('Im here');
        setStructuredData([]);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const convertDate = (dt) => {
    const date = new Date(dt * 1000);
    return date;
  };

  return (
    <div className='container'>
      <div className='app-title'>
        <h1>
          <i className='fas fa-cloud-sun-rain'></i>Meteo
        </h1>
      </div>
      <form className='search' onSubmit={getSearch}>
        <input type='text' value={search} onChange={updateSearch} />
        <button type='submit'>Cauta</button>
      </form>
      {isLoaded === true &&
      Object.keys(fetched).length > 2 &&
      Object.keys(error).length === 0 ? (
        <div className='result-container'>
          <h2 className='city-title'>
            {fetched.city.name}, <span>{fetched.city.country}</span>
          </h2>
          <h4 className='city-coords'>
            ({fetched.city.coord.lat}, {fetched.city.coord.lon})
          </h4>
          <div className='current'>
            <div className='current-img'>
              <img
                src={`http://openweathermap.org/img/wn/${structuredData[0].forecast[0].weather[0].icon}@4x.png`}
                alt=''
              />
            </div>
            <h3>
              {Math.round(structuredData[0].forecast[0].main.temp)} °C ( se
              simte ca{' '}
              {Math.round(structuredData[0].forecast[0].main.feels_like)} °C)
            </h3>
            <h3>{structuredData[0].forecast[0].weather[0].description}</h3>
          </div>
          <div className='additional-info'>
            <p>
              <b>Apus:</b>
              {` ${convertDate(fetched.city.sunset).getHours()}:${convertDate(
                fetched.city.sunset
              ).getMinutes()}`}
              <br />
              <b>Răsărit:</b>
              {` ${convertDate(fetched.city.sunrise).getHours()}:${convertDate(
                fetched.city.sunrise
              ).getMinutes()}`}
            </p>
            <p>
              <b>Presiune:</b> {structuredData[0].forecast[0].main.pressure} hPa{' '}
              <br />
              <b>Umiditate:</b> {structuredData[0].forecast[0].main.humidity} %
            </p>
          </div>
          <ul className='daily'>
            {structuredData.map((day) => (
              <Daily key={day.date} day={day} />
            ))}
          </ul>
        </div>
      ) : Object.keys(error).length !== 0 ? (
        <h1>
          Error {error.cod}: {error.message}
        </h1>
      ) : (
        <h1>Loading</h1>
      )}
    </div>
  );
}

export default App;
