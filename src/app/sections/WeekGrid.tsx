"use client";
import React from 'react';
import { WeeklySchedule } from '@/lib/planner_backend';

export const colorPalette = [
  'red', 'blue', 'purple', 'green', 'yellow',
  'orange', 'gray', 'cyan', 'lime'
];

export const classColors = new Map<string, string>();

export function colorForClass(className: string): string {
  const cached = classColors.get(className);
  if (cached) return cached;

  const used = new Set(classColors.values());
  const available = colorPalette.filter(color => !used.has(color));
  const pool = available.length > 0 ? available : colorPalette;
  const color = pool[Math.floor(Math.random() * pool.length)];

  classColors.set(className, color);
  return color;
}

const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const timeSlots = [
  '7am', '8am', '9am', '10am', '11am', '12pm',
  '1pm', '2pm', '3pm', '4pm', '5pm', '6pm', '7pm'
];

const dayMap: Record<string, keyof WeeklySchedule> = {
  'Mon': 'monday',
  'Tue': 'tuesday',
  'Wed': 'wednesday',
  'Thu': 'thursday',
  'Fri': 'friday',
  'Sat': 'saturday',
}

type CellEntry = { class_name: string; schedule_name: string; course_id: number };

type Props = {
  week: WeeklySchedule;
  // course_id -> agreement score (0..1). Cells whose course is shared with the
  // group get a ring: green when everyone picked the same section, yellow otherwise.
  highlightCourseIds?: Map<number, number>;
}

const WeekGrid = ({ week, highlightCourseIds }: Props) => {
  const cellMap = new Map<string, CellEntry>();

  daysOfWeek.forEach((day, dayIndex) => {
    const daySchedule = week?.[dayMap[day]];
    if (!daySchedule) return;

    Object.entries(daySchedule).forEach(([timeSlotStr, entry]) => {
      const timeSlot = parseInt(timeSlotStr);
      cellMap.set(`${dayIndex}-${timeSlot}`, entry);
    });
  });

  return (
    <div className="overflow-x-auto rounded-lg border border-zinc-800">
      <div className="grid grid-cols-7 grid-rows-14 min-w-[640px] gap-px bg-zinc-800">
        <div className="bg-zinc-900" />
        {daysOfWeek.map((day) => (
          <div key={day} className="bg-zinc-900 text-white flex items-center justify-center py-2 text-sm font-semibold">
            {day}
          </div>
        ))}

        {timeSlots.map((time, timeIndex) => {
          const hour = timeIndex + 7;
          return (
            <React.Fragment key={time}>
              <div className="bg-zinc-900 text-zinc-400 flex items-center justify-end pr-2 text-xs font-medium">
                {time}
              </div>
              {daysOfWeek.map((day, dayIndex) => {
                const entry = cellMap.get(`${dayIndex}-${hour}`);

                if (!entry) {
                  return <div key={`${day}-${time}`} className="bg-zinc-950 min-h-11" />;
                }

                const color = colorForClass(entry.class_name);
                const agreement = highlightCourseIds?.get(entry.course_id);

                let ring = '';
                if (agreement !== undefined) {
                  ring = agreement >= 1 ? 'ring-2 ring-inset ring-green-400' : 'ring-2 ring-inset ring-yellow-400';
                }

                return (
                  <div key={`${day}-${time}`}
                    className={`bg-${color}-500/20 border-l-2 border-${color}-400 text-${color}-100 ${ring}
                      flex flex-col justify-center items-center text-center text-[11px] leading-tight p-1 min-h-11 overflow-hidden`}>
                    <span className="font-semibold">{entry.class_name}</span>
                    <span className="opacity-75">{entry.schedule_name}</span>
                  </div>
                );
              })}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  )
}

export default WeekGrid;
