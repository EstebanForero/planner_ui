"use client";
import React, { useState } from 'react';
import { Element } from 'react-scroll';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { get_planning as obtain_planning, RankedWeek, RankingParameters, WeeklySchedule } from '@/lib/planner_backend';
import { Spinner } from '@nextui-org/spinner';

const get_planning = async (rankingParameters: RankingParameters, user_id: number): Promise<RankedWeek[]> => {

  return await obtain_planning(rankingParameters, user_id);
};

interface Props {
  userId: number;
}

const myColors = new Map<string, string>()

const Calendar = ({ userId }: Props) => {
  const [count, setCount] = useState(0);
  const [dayCost, setDayCost] = useState("");
  const [hourCost, setHourCost] = useState("");
  const [exitTimeMultiplier, setExitTimeMultiplier] = useState("");

  const queryClient = useQueryClient()

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const timeSlots = [
    '7am', '8am', '9am', '10am', '11am', '12pm', 
    '1pm', '2pm', '3pm', '4pm', '5pm', '6pm', '7pm'
  ];
  const colors = [
    'red', 'blue', 'purple', 'green', 'yellow',
    'orange', 'gray', 'cyan', 'lime'
  ];

  const { data, isError, isLoading } = useQuery({
    queryKey: ['planning', userId],
    queryFn: async () => await get_planning({
      cost_day: Number(dayCost ?? '0'),
      cost_hour: Number(hourCost ?? '0'),
      exit_time_multiplier: Number(exitTimeMultiplier ?? '0')
    }, userId),
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
    'Sat': 'saturday',
  }

  const handler = () => {
    if (count == data.length - 1) {
      return
    }
    setCount(count + 1);
    return
  }

  const prevHandler = () => {
    if (count == 0) {
      return
    }
    setCount(count - 1);
  }

  if (!data[count]) {
    return null
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

            const daySchedule = data[count].week?.[actualDayKey];

            if (!daySchedule) return null

            return Object.entries(daySchedule).map(([timeSlotStr, { class_name }]) => {
              const timeSlot = parseInt(timeSlotStr);
              let color = '';
              if (myColors.has(class_name)) {
                color = myColors.get(class_name) 
              } else {
                myColors.set(class_name, getRandomItem(colors, myColors))
                color = myColors.get(class_name);
              }

              return (
                <div key={`${day}-${timeSlot}`} className={`col-start-${dayIndex + 2} row-start-${timeSlot - 7 + 2}
col-span-1 row-span-1 bg-${color}-500 text-white flex justify-center items-center`}>
                  {class_name}
                </div>
              );
            });
          })}

        </div>

        <button className='bg-transparent border rounded border-purple-800 text-white w-16 h-10'
          onClick={handler}>
          Next
        </button>

        <button className='bg-transparent border rounded border-purple-800 text-white w-16 h-10 ml-3'
          onClick={prevHandler}>
          Prev 
        </button>

        <input className='ml-4 bg-transparent border border-purple-800 text-white w-30 h-10 p-2
          placeholder:p-1 placeholder:text-gray-400 placeholder:m-2 placeholder:bg-gray-800
          placeholder:rounded rounded' placeholder='hour cost' type='number' onChange={(e) => setHourCost(e.target.value)}/>

        <input className='ml-4 bg-transparent border border-purple-800 text-white w-30 h-10 p-2
          placeholder:p-1 placeholder:text-gray-400 placeholder:m-2 placeholder:bg-gray-800
          placeholder:rounded rounded' placeholder='day cost' type='number' onChange={(e) => setDayCost(e.target.value)}/>

        <input className='ml-4 bg-transparent border border-purple-800 text-white w-30 h-10 p-2
          placeholder:p-1 placeholder:text-gray-400 placeholder:m-2 placeholder:bg-gray-800
          placeholder:rounded rounded' placeholder='exit time multiplier' type='number'
          onChange={(e) => setExitTimeMultiplier(e.target.value)}/>

        <button className='bg-transparent border rounded border-purple-800 text-white px-2 h-10 ml-3 hover:bg-purple-800 transition-colors duration-200'
          onClick={() => queryClient.invalidateQueries({ queryKey: ['planning', userId] })}>
          get Plannings
        </button>

        <p className='font-bold text-white text-lg inline ml-4'>puntuation: {data[count].puntuation}</p>
      </Element>
    </section>
  );
};

function getRandomItem(arr: string[], hashMap: Map<string, string>): string {
  const availableColors = arr.filter(color => !Array.from(hashMap.values()).includes(color));

  if (availableColors.length === 0) {
    throw new Error("No available colors left");
  }

  const randomIndex = Math.floor(Math.random() * availableColors.length);
  return availableColors[randomIndex];
}

export default Calendar;


