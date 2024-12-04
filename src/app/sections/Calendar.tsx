"use client";
import React from 'react';
import { Element } from 'react-scroll';
import { useQuery } from '@tanstack/react-query';
import { get_planning as obtain_planning, WeeklySchedule } from '@/lib/planner_backend';
import { Spinner } from '@nextui-org/spinner';

const get_planning = async (user_id: number): Promise<WeeklySchedule[]> => {
  return await obtain_planning(user_id);
};

interface Props {
  userId: number;
}

const Calendar = ({ userId }: Props) => {
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const timeSlots = [
    '7am', '8am', '9am', '10am', '11am', '12pm', 
    '1pm', '2pm', '3pm', '4pm', '5pm', '6pm', '7pm'
  ];

  const { data, isError, isLoading } = useQuery({
    queryKey: ['planning', userId],
    queryFn: async () => await get_planning(userId),
  });

  if (isError) throw new Error("Error calling get planning from backend");

  if (isLoading || !data) {
    return <Spinner/>
  }

  console.log('planning data is: ')
  console.log(data)

  const dayMap: Record<string, keyof WeeklySchedule> = {
    'Mon': 'monday',
    'Tue': 'tuesday',
    'Wed': 'wednesday',
    'Thu': 'thursday',
    'Fri': 'friday',
    'Sat': 'Saturday',
  }

  return (
    <section className="mb-3 w-full h-full">
      <Element name="calendar" className="w-full h-full">
        <div className="grid grid-cols-7 grid-rows-14 w-full h-full">
          {daysOfWeek.map((day, dayIndex) => (
            <p
              key={day}
              className={`col-start-${dayIndex + 2} col-span-1 text-white flex w-12 h-12 justify-center items-center pl-3 text-xl font-bold`}>
              {day}
            </p>
          ))}

          {timeSlots.map((time, timeIndex) => (
            <p
              key={time}
              className={`row-start-${timeIndex + 2} row-span-1 text-white flex w-12 h-12 justify-center items-center pl-3 text-xl font-bold`}>
              {time}
            </p>
          ))}

          {daysOfWeek.map((day, dayIndex) => {
            const actualDayKey = dayMap[day];
            const daySchedule = data[0]?.[actualDayKey];

            if (!daySchedule) return null

            return Object.entries(daySchedule).map(([timeSlotStr, { class_name }]) => {
              const timeSlot = parseInt(timeSlotStr);

              return (
                <div key={`${day}-${timeSlot}`} className={`col-start-${dayIndex + 2} row-start-${timeSlot - 7 + 2}
col-span-1 row-span-1 bg-red-500 text-white flex justify-center items-center`}>
                  {class_name}
                </div>
              );
            });
          })}
        </div>
      </Element>
    </section>
  );
};

export default Calendar;

