"use client";
import React, { useState } from 'react';
import { Element } from 'react-scroll';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { get_planning as obtain_planning, RankedWeek, RankingParameters, WeeklySchedule } from '@/lib/planner_backend';
import { Spinner } from '@nextui-org/spinner';
import WeekGrid, { colorForClass } from './WeekGrid';
import { card, primaryButton, secondaryButton, sectionSubtitle, sectionTitle } from '@/lib/ui';
import NumberField from '../components/NumberField';

const get_planning = async (rankingParameters: RankingParameters, user_id: number): Promise<RankedWeek[]> => {
  return await obtain_planning(rankingParameters, user_id);
};

const dayKeys: (keyof WeeklySchedule)[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

function collectClassNames(week: WeeklySchedule): string[] {
  const names = new Set<string>();
  for (const day of dayKeys) {
    Object.values(week[day]).forEach(entry => names.add(entry.class_name));
  }
  return Array.from(names);
}

interface Props {
  userId: number;
}

const Calendar = ({ userId }: Props) => {
  const [count, setCount] = useState(0);
  const [dayCost, setDayCost] = useState("");
  const [hourCost, setHourCost] = useState("");
  const [exitTimeMultiplier, setExitTimeMultiplier] = useState("");

  const queryClient = useQueryClient()

  const { data, isError, isLoading } = useQuery({
    queryKey: ['planning', userId],
    queryFn: async () => await get_planning({
      cost_day: Number(dayCost ?? '0'),
      cost_hour: Number(hourCost ?? '0'),
      exit_time_multiplier: Number(exitTimeMultiplier ?? '0')
    }, userId),
  });

  if (isError) throw new Error("Error calling get planning from backend");

  const handler = () => {
    if (!data || count == data.length - 1) return
    setCount(count + 1);
  }

  const prevHandler = () => {
    if (count == 0) return
    setCount(count - 1);
  }

  const current = data?.[count];
  const classNames = current ? collectClassNames(current.week) : [];

  return (
    <Element name="calendar">
      <section className="flex flex-col gap-4">
        <div>
          <h2 className={sectionTitle}>My schedule</h2>
          <p className={sectionSubtitle}>Find the best weekly combination of your own classes.</p>
        </div>

        <div className={`${card} flex flex-wrap items-end gap-4`}>
          <NumberField label="Hour cost" placeholder='0' value={hourCost} className="w-32"
            onChange={(v) => setHourCost(String(v))}/>
          <NumberField label="Day cost" placeholder='0' value={dayCost} className="w-32"
            onChange={(v) => setDayCost(String(v))}/>
          <NumberField label="Exit time multiplier" placeholder='0' value={exitTimeMultiplier} className="w-44"
            onChange={(v) => setExitTimeMultiplier(String(v))}/>
          <button className={primaryButton}
            onClick={() => queryClient.invalidateQueries({ queryKey: ['planning', userId] })}>
            Get plannings
          </button>
        </div>

        <div className={card}>
          {isLoading || !data ? (
            <div className="flex justify-center py-12"><Spinner/></div>
          ) : !current ? (
            <p className='text-zinc-400 text-center py-8'>
              No valid schedule could be generated yet. Add some classes and schedules first.
            </p>
          ) : (
            <>
              <WeekGrid week={current.week}/>

              {classNames.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {classNames.map(name => {
                    const color = colorForClass(name);
                    return (
                      <span key={name}
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium
                          bg-${color}-500/15 text-${color}-300 border border-${color}-500/30`}>
                        {name}
                      </span>
                    );
                  })}
                </div>
              )}

              <div className="flex flex-wrap items-center gap-3 mt-4 pt-4 border-t border-zinc-800">
                <button className={`${secondaryButton} px-3 py-1.5`} disabled={count === 0} onClick={prevHandler}>
                  ← Prev
                </button>
                <button className={`${secondaryButton} px-3 py-1.5`} disabled={count === data.length - 1} onClick={handler}>
                  Next →
                </button>
                <span className="text-sm text-zinc-400">Option {count + 1} of {data.length}</span>
                <span className="ml-auto text-sm font-semibold text-white">Score: {current.puntuation.toFixed(2)}</span>
              </div>
            </>
          )}
        </div>
      </section>
    </Element>
  );
};

export default Calendar;
