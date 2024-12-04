"use client";
import React from 'react';
import { Element } from 'react-scroll';

const Calendar = () => {
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const timeSlots = [
    '7am', '8am', '9am', '10am', '11am', '12pm', 
    '1pm', '2pm', '3pm', '4pm', '5pm', '6pm', '7pm'
  ];

  return (
    <section className="mb-3 w-full h-full">
      <Element name="calendar" className="w-full h-full">
        <div className="grid grid-cols-7 grid-rows-14 w-full h-full">
          {daysOfWeek.map((day, index) => (
            <p
              key={day}
              className={`col-start-${index + 2} col-span-1 text-white flex w-12
h-12 justify-center items-center pl-3 text-xl font-bold`}>
              {day}
            </p>
          ))}

          {timeSlots.map((time, index) => (
            <p
              key={time}
              className={`row-start-${index + 2} row-span-1 text-white flex w-12
h-12 justify-center items-center pl-3 text-xl font-bold`}>
              {time}
            </p>
          ))}
        </div>
      </Element>
    </section>
  );
};

export default Calendar;
