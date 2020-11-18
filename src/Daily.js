import React from 'react';
import Hourly from './Hourly';

function Daily({ day }) {
  const days = [
    'Duminică',
    'Luni',
    'Marți',
    'Miercuri',
    'Joi',
    'Vineri',
    'Sâmbătă',
  ];
  const months = [
    'Ianuarie',
    'Februarie',
    'Martie',
    'Aprilie',
    'Mai',
    'Iunie',
    'Iulie',
    'August',
    'Septembrie',
    'Octombie',
    'Noiembrie',
    'Decembrie',
  ];
  return (
    <li className='day'>
      <h3>{`${days[day.date.getDay()]}, ${day.date.getDate()} ${
        months[day.date.getMonth()]
      }`}</h3>
      <ul className='hourly'>
        {day.forecast.map((hour) => (
          <Hourly key={hour.dt} hour={hour} />
        ))}
      </ul>
    </li>
  );
}

export default Daily;
