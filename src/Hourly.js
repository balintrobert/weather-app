import React from 'react';

function Hourly({ hour }) {
  const getHour = (dt) => {
    const date = new Date(dt * 1000);
    return date.getHours();
  };
  return (
    <li className='hour'>
      <p>
        {getHour(hour.dt)}
        <span>00</span>
      </p>
      <div className='weather'>
        <div className='weather-img'>
          <img
            src={`http://openweathermap.org/img/wn/${hour.weather[0].icon}.png`}
            alt=''
          />
        </div>
        <p>{hour.weather[0].description}</p>
      </div>
      <p>
        {Math.round(hour.main.temp)} °C ({Math.round(hour.main.feels_like)} °C)
      </p>
    </li>
  );
}

export default Hourly;
