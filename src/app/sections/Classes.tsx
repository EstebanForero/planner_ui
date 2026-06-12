"use client";
import { add_block, add_class, add_schedule, Block, BlockCreation, CourseSummary, Day, delete_block, delete_class, delete_schedule, get_class, get_classes_id, get_course, relink_class, search_courses } from '@/lib/planner_backend';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react'
import { Element } from 'react-scroll'
import { Spinner } from '@nextui-org/spinner';
import {Accordion, AccordionItem} from "@nextui-org/accordion";
import { badgeGray, badgeGreen, badgeViolet, card, dangerButton, inputClass, labelClass, primaryButton, secondaryButton, sectionSubtitle, sectionTitle } from '@/lib/ui';
import NumberField from '../components/NumberField';

const accordionItemClasses = {
  base: 'bg-zinc-800/60 border border-zinc-700 rounded-lg',
  title: 'text-white font-medium text-sm',
  trigger: 'px-4 py-3',
  content: 'px-4 pb-4 text-zinc-200',
  indicator: 'text-zinc-400',
}

type Props = {
  userId: string
}

const Classes = ({ userId }: Props) => {

  const { data, isError } = useQuery({
    queryKey: ['classes', userId],
    queryFn: async () => await get_classes_id(Number(userId))
  })

  return (
    <Element name='classes'>
      <section className='flex flex-col gap-4'>
        <div>
          <h2 className={sectionTitle}>My classes</h2>
          <p className={sectionSubtitle}>
            Every class links to a shared course. Classes that share the same course id keep their
            sections in sync with the rest of your group — copy the course id from a card to share it.
          </p>
        </div>

        <ClassAdder user_id={Number(userId)}/>

        {isError ? (
          <p className='text-red-400'>Invalid user id</p>
        ) : data?.length === 0 ? (
          <p className='text-zinc-500 text-sm'>You haven&apos;t added any classes yet.</p>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {data?.map(class_id => <Class key={class_id} class_id={class_id} user_id={Number(userId)}/>)}
          </div>
        )}
      </section>
    </Element>
  )
}

export default Classes


type ClassProps = {
  class_id: number
  user_id: number
}

const Class = ({ class_id, user_id }: ClassProps) => {

  const queryClient = useQueryClient()
  const [copied, setCopied] = useState(false)
  const [showRelink, setShowRelink] = useState(false)

  const { data, isLoading } = useQuery({
    queryFn: async () => await get_class(user_id, class_id),
    queryKey: [`class${class_id}`]
  })

  const { data: courseData } = useQuery({
    queryFn: async () => await get_course(data!.course_id),
    queryKey: [`course${data?.course_id}`],
    enabled: !!data,
  })

  const deleteClassMutation = useMutation({
    mutationFn: async () => {
      await delete_class(user_id, class_id)
    },
    onSettled: async () => {
      queryClient.invalidateQueries({ queryKey: ['classes', String(user_id)]})
    }
  })

  const deleteScheduleMutation = useMutation({
    mutationFn: async (schedule_id: number) => {
      await delete_schedule(schedule_id)
    },
    onSettled: async () => {
      queryClient.invalidateQueries({ queryKey: [`class${class_id}`]})
    }
  })

  const deleteBlockMutation = useMutation({
    mutationFn: async (block_id: number) => {
      await delete_block(block_id)
    },
    onSettled: async () => {
      queryClient.invalidateQueries({ queryKey: [`class${class_id}`]})
      queryClient.invalidateQueries({ queryKey: ['planning']})
    }
  })

  if (isLoading || !data) {
    return <div className={`${card} min-h-32 flex items-center justify-center`}>
      <Spinner/>
    </div>
  }

  const copyCourseId = () => {
    navigator.clipboard.writeText(String(data.course_id))
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className={card}>
      <div className='flex items-start justify-between gap-3 mb-3'>
        <div className='flex flex-col gap-1.5'>
          <h3 className='text-white font-semibold text-lg'>{data.class_name}</h3>
          <div className='flex flex-wrap items-center gap-1.5'>
            <button
              className={`${badgeViolet} hover:bg-violet-500/25 transition`}
              title='Click to copy this course id and share it with your group so they link to the same course'
              onClick={copyCourseId}
            >
              Course #{data.course_id} {copied ? '· copied!' : '· click to share'}
            </button>
            {courseData && (
              courseData.class_count > 1 ? (
                <span className={badgeGreen} title='Other classes are linked to this same shared course'>
                  Shared · {courseData.class_count} classes
                </span>
              ) : (
                <span className={badgeGray} title='No one else has linked a class to this course yet'>
                  Personal · not shared yet
                </span>
              )
            )}
          </div>
        </div>
        <button className={dangerButton} onClick={() => deleteClassMutation.mutate()}>
          Delete
        </button>
      </div>

      <button className={`${secondaryButton} text-sm px-3 py-1.5 mb-3`} onClick={() => setShowRelink(s => !s)}>
        {showRelink ? 'Hide sharing options' : 'Change shared course'}
      </button>

      {showRelink && (
        <RelinkPanel user_id={user_id} class_id={class_id} current_course_id={data.course_id}/>
      )}

      <ScheduleAdder class_id={class_id} course_id={data.course_id}/>

      {data.schedules.length === 0 ? (
        <p className='text-zinc-500 text-sm mt-4'>No sections yet — add one above.</p>
      ) : (
        <Accordion variant='splitted' className='px-0 gap-2 mt-4' itemClasses={accordionItemClasses}>
          {data.schedules.map(schedule_info => (
            <AccordionItem key={schedule_info.schedule_id} title={schedule_info.schedule_name}>
              <div className='flex justify-end mb-2'>
                <button className={dangerButton}
                  onClick={() => deleteScheduleMutation.mutate(schedule_info.schedule_id)}
                >Delete section</button>
              </div>

              <BlockAdder schedule_id={schedule_info.schedule_id} class_id={class_id}/>

              {schedule_info.blocks.length === 0 ? (
                <p className='text-zinc-500 text-sm mt-2'>No time blocks yet.</p>
              ) : (
                <div className='flex flex-col gap-2 mt-2'>
                  {schedule_info.blocks.map(block_info => (
                    <BlockVisualizer key={block_info.block_id} block={block_info}
                      onDelete={() => deleteBlockMutation.mutate(block_info.block_id)}/>
                  ))}
                </div>
              )}
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  )
}

type RelinkPanelProps = {
  user_id: number
  class_id: number
  current_course_id: number
}

const RelinkPanel = ({ user_id, class_id, current_course_id }: RelinkPanelProps) => {
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')

  const queryClient = useQueryClient()

  useEffect(() => {
    const handle = setTimeout(() => setDebouncedQuery(query), 300)
    return () => clearTimeout(handle)
  }, [query])

  const { data: results } = useQuery({
    queryKey: ['searchCourses', debouncedQuery],
    queryFn: async () => await search_courses(debouncedQuery),
    enabled: debouncedQuery.trim().length > 0,
  })

  const relinkMutation = useMutation({
    mutationFn: async (course_id?: number) => {
      await relink_class(user_id, class_id, course_id)
    },
    onSettled: async () => {
      queryClient.invalidateQueries({ queryKey: [`class${class_id}`]})
      queryClient.invalidateQueries({ queryKey: [`course${current_course_id}`]})
      queryClient.invalidateQueries({ queryKey: ['classes', String(user_id)]})
      queryClient.invalidateQueries({ queryKey: ['planning']})
    }
  })

  const otherResults = (results ?? []).filter(c => c.course_id !== current_course_id)

  return (
    <div className='mb-4 pb-4 border-b border-zinc-800 flex flex-col gap-2'>
      <p className={labelClass}>
        Search for the course your group is using and relink this class to it
      </p>
      <input
        placeholder='e.g. Cloud Architecture'
        className={`${inputClass} w-full`}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {otherResults.length > 0 && (
        <ul className='flex flex-col gap-1 max-h-40 overflow-auto'>
          {otherResults.map(course => (
            <li key={course.course_id}>
              <button
                className='w-full text-left px-3 py-2 rounded-lg bg-zinc-800 hover:bg-violet-600/20 transition
                  text-sm text-zinc-100 flex justify-between items-center disabled:opacity-40'
                disabled={relinkMutation.isPending}
                onClick={() => relinkMutation.mutate(course.course_id)}
              >
                <span>{course.course_name}</span>
                <span className='text-zinc-500 text-xs'>
                  #{course.course_id} · {course.class_count} {course.class_count === 1 ? 'class' : 'classes'}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
      <button className={`${secondaryButton} self-start text-sm`}
        disabled={relinkMutation.isPending}
        onClick={() => relinkMutation.mutate(undefined)}
      >
        Make this class personal again
      </button>
      {relinkMutation.isError && (
        <p className='text-red-400 text-xs'>Failed to update this class&apos;s shared course.</p>
      )}
    </div>
  )
}

interface BlockProps {
  block: Block;
  onDelete: () => void;
}

const BlockVisualizer = ({ block, onDelete }: BlockProps) => {
  const formatHour = (hour: number) => hour.toString().padStart(2, '0');

  return (
    <div className='flex items-center justify-between rounded-lg bg-zinc-900 border border-zinc-700 px-3 py-2 text-sm'>
      <span className='text-zinc-200'>
        {block.day} · {formatHour(block.start_hour)}:00 – {formatHour(block.finish_hour)}:00
      </span>
      <button className='text-red-400 hover:text-red-300 text-xs font-medium' onClick={onDelete}>
        Remove
      </button>
    </div>
  );
};

interface BlockAddedProps {
  schedule_id: number
  class_id: number
}

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const BlockAdder = ({ schedule_id, class_id }: BlockAddedProps) => {
  const [startHour, setStartHour] = useState(7);
  const [finishHour, setFinishHour] = useState(9);
  const [selectedDay, setSelectedDay] = useState<Day>('Monday');

  const queryClient = useQueryClient();

  const addBlockMutation = useMutation({
    mutationFn: async () => {
      const blockCreation: BlockCreation = {
        start_hour: startHour,
        finish_hour: finishHour,
        day: selectedDay
      };

      resetForm()
      return await add_block(blockCreation, schedule_id);
    },
    onSettled: async () => {
      queryClient.invalidateQueries({ queryKey: [`class${class_id}`]})
      queryClient.invalidateQueries({ queryKey: [`planning`]})
    }
  });

  const resetForm = () => {
    setStartHour(7);
    setFinishHour(9);
    setSelectedDay('Monday');
  };

  return (
    <div className="flex flex-col gap-2 mb-3">
      <div className="flex flex-wrap items-end gap-2">
        <NumberField label="Start" value={startHour} min={0} max={23} className="w-24"
          onChange={setStartHour}/>

        <NumberField label="End" value={finishHour} min={0} max={23} className="w-24"
          onChange={setFinishHour}/>

        <div className="flex flex-col gap-1">
          <label className={labelClass}>Day</label>
          <select
            value={selectedDay}
            onChange={(e) => setSelectedDay(e.target.value as Day)}
            className={`${inputClass} w-36`}
          >
            {days.map((day) => (
              <option key={day} value={day}>{day}</option>
            ))}
          </select>
        </div>

        <button
          onClick={() => addBlockMutation.mutate()}
          disabled={addBlockMutation.isPending}
          className={`${secondaryButton} px-3 py-2`}
        >
          {addBlockMutation.isPending ? 'Adding...' : '+ Add time block'}
        </button>
      </div>

      {addBlockMutation.isError && (
        <p className="text-red-400 text-xs">
          Error adding block: {addBlockMutation.error.message}
        </p>
      )}
    </div>
  );
};

type ScheduleAdderProps = {
  class_id: number
  course_id: number
}

const ScheduleAdder = ({ class_id, course_id }: ScheduleAdderProps) => {

  const [scheduleName, setScheduleName] = useState('')

  const queryClient = useQueryClient()

  const addScheduleMutation = useMutation({
    mutationFn: async () => {
      await add_schedule(course_id, scheduleName)
    },
    onSuccess: () => {
      setScheduleName('')
    },
    onSettled: async () => {
      queryClient.invalidateQueries({ queryKey: [`class${class_id}`]})
    }
  })

  return <div className='flex gap-2'>
    <input className={`${inputClass} grow`} value={scheduleName} placeholder='Section / schedule name'
      onChange={(e) => setScheduleName(e.target.value)}
    />
    <button className={secondaryButton}
      disabled={!scheduleName.trim() || addScheduleMutation.isPending}
      onClick={() => addScheduleMutation.mutate()}
    >{addScheduleMutation.isPending ? 'Adding...' : '+ Add section'}</button>
  </div>

}

type ClassAdderProps = {
  user_id: number
}

const ClassAdder = (props: ClassAdderProps) => {

  const [className, setClassName] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [selectedCourse, setSelectedCourse] = useState<CourseSummary | null>(null)
  const [showResults, setShowResults] = useState(false)

  const queryClient = useQueryClient()

  useEffect(() => {
    const handle = setTimeout(() => setDebouncedQuery(className), 300)
    return () => clearTimeout(handle)
  }, [className])

  const { data: results } = useQuery({
    queryKey: ['searchCourses', debouncedQuery],
    queryFn: async () => await search_courses(debouncedQuery),
    enabled: debouncedQuery.trim().length > 0,
  })

  const { data: selectedCourseDetails } = useQuery({
    queryKey: [`course${selectedCourse?.course_id}`],
    queryFn: async () => await get_course(selectedCourse!.course_id),
    enabled: !!selectedCourse,
  })

  const addClassMutation = useMutation({
    mutationFn: async () => {
      await add_class(props.user_id, className, selectedCourse?.course_id)
    },
    onSuccess: () => {
      setClassName('')
      setSelectedCourse(null)
    },
    onSettled: async () => {
      queryClient.invalidateQueries({ queryKey: ['classes', String(props.user_id)]})
    }
  })

  const handleSelectCourse = (course: CourseSummary) => {
    setSelectedCourse(course)
    setClassName(course.course_name)
    setShowResults(false)
  }

  const handleChange = (value: string) => {
    setClassName(value)
    setSelectedCourse(null)
    setShowResults(true)
  }

  return (
    <div className={card}>
      <h3 className='text-white font-semibold mb-1'>Add a class</h3>
      <p className='text-zinc-400 text-sm mb-3'>
        Search for a course your group already added (so your sections line up), or type a new name to create one.
      </p>
      <div className='relative'>
        <input
          placeholder='Course or class name'
          className={`${inputClass} w-full`}
          value={className}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => setShowResults(true)}
          onBlur={() => setTimeout(() => setShowResults(false), 150)}
        />
        {showResults && results && results.length > 0 && (
          <ul className='absolute z-10 w-full bg-zinc-900 border border-zinc-700 rounded-lg mt-1 max-h-48 overflow-auto shadow-xl'>
            {results.map(course => (
              <li key={course.course_id}
                className='px-3 py-2 text-zinc-100 hover:bg-violet-600/20 cursor-pointer flex justify-between text-sm'
                onMouseDown={() => handleSelectCourse(course)}
              >
                <span>{course.course_name}</span>
                <span className='text-zinc-500 text-xs'>
                  #{course.course_id} · {course.class_count} {course.class_count === 1 ? 'class' : 'classes'}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
      {selectedCourse ? (
        <p className={`${badgeGreen} mt-2`}>
          Joining &quot;{selectedCourse.course_name}&quot; (#{selectedCourse.course_id}){' '}
          {selectedCourseDetails && selectedCourseDetails.schedules.length > 0
            ? `— ${selectedCourseDetails.schedules.length} section${selectedCourseDetails.schedules.length === 1 ? '' : 's'} `
              + `(${selectedCourseDetails.schedules.map(s => s.schedule_name).join(', ')}) already set up, you'll see them right away`
            : '— sections will line up with this course'}
        </p>
      ) : className.trim() ? (
        <p className={`${badgeGray} mt-2`}>
          New shared course &quot;{className}&quot; will be created
        </p>
      ) : null}
      <button className={`${primaryButton} mt-3`}
        disabled={!className.trim() || addClassMutation.isPending}
        onClick={() => addClassMutation.mutate()}
      >{addClassMutation.isPending ? 'Adding...' : 'Add class'}</button>
      {addClassMutation.isError && (
        <p className="text-red-400 text-xs mt-2">
          Failed to add class: {addClassMutation.error.message}
        </p>
      )}
    </div>
  )
}
