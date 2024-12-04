"use client";
import { add_block, add_class, add_schedule, Block, BlockCreation, Day, delete_block, delete_class, delete_schedule, get_class, get_classes } from '@/lib/planner_backend';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react'
import { Element } from 'react-scroll'
import { Spinner } from '@nextui-org/spinner';
import {Accordion, AccordionItem} from "@nextui-org/accordion";


type Props = {
  userId: string
}

const Classes = ({ userId }: Props) => {

  const { data, isError } = useQuery({
    queryKey: ['classes', userId],
    queryFn: async () => await get_classes(Number(userId))
  })

  console.log('class info is: ', data)

  return (
    <section className='mt-2'>
      <ClassAdder user_id={Number(userId)}/>
      <Element name='classes'>
        {isError ?
          <p className='text-red-500'>Invalid user id</p>
        : 
          <div>
            {data?.map(class_info => <Class key={class_info.class_id} class_id={class_info.class_id} user_id={Number(userId)}/>)}
          </div>
        }
      </Element>
    </section>
  )
}

export default Classes


type ClassProps = {
  class_id: number
  user_id: number
}

const Class = ({ class_id, user_id }: ClassProps) => {

  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryFn: async () => {
      const class_info = await get_class(user_id, class_id)
      console.log(class_info)
      return class_info
    },
    queryKey: [`class${class_id}`]
  })

  const deleteClassMutation = useMutation({
    mutationFn: async () => {
      await delete_class(user_id, class_id)
    },
    onMutate: async () => {
      queryClient.invalidateQueries({ queryKey: ['classes']})
    }
  })

  const deleteScheduleMutation = useMutation({
    mutationFn: async (schedule_id: number) => {
      await delete_schedule(schedule_id)
    },
    onMutate: async () => {
      queryClient.invalidateQueries({ queryKey: [`class${class_id}`]})
    }
  })

  const deleteBlockMutation = useMutation({
    mutationFn: async (block_id: number) => {
      await delete_block(block_id)
    },
    onMutate: async () => {
      queryClient.invalidateQueries({ queryKey: [`class${class_id}`]})
      queryClient.invalidateQueries({ queryKey: ['planning']})
    }
  })

  if (isLoading || !data) {
    return <div className='bg-black border border-purple-600 rounded-lg min-h-20 max-w-[520px] p-4'>
      <Spinner/>
    </div>

  }

  return (
    <div className='bg-black border border-purple-600 rounded-lg min-h-20 max-w-[520px] p-4'>
      <div className='flex flex-row justify-between items-center mb-3 mx-2'>
        <h1 className='text-white font-bold text-lg'>{data.class_name}</h1>
        <button className='border px-2 border-red-500 text-red-500 font-bold bg-black rounded-lg'
          onClick={() => deleteClassMutation.mutate()}
        >Delete
        </button>
      </div>
      <ScheduleAdder class_id={class_id}/>
      <Accordion variant='splitted'>
        {data.schedules.map(schedule_info => <AccordionItem key={schedule_info.schedule_id} title={schedule_info.schedule_name}
          className='border border-purple-600 rounded-lg mt-4 text-white py-3'
        >
          <button className='border px-2 border-red-500 text-red-500 font-bold bg-black rounded-lg mr-8 mt-4'
            onClick={() => deleteScheduleMutation.mutate(schedule_info.schedule_id)}
          >Delete
          </button>
          <BlockAdder schedule_id={schedule_info.schedule_id} class_id={class_id}/>
          <Accordion variant='splitted'>
            {schedule_info.blocks.map(block_info => <AccordionItem key={block_info.block_id} title={block_info.day}
              className='border border-purple-600 rounded-lg text-white py-3'
            >
              <button className='border px-2 border-red-500 text-red-500 font-bold bg-black rounded-lg mr-8 mt-4'
                onClick={() => deleteBlockMutation.mutate(block_info.block_id)}
              >Delete
              </button>
              <BlockVizualizer block={block_info}/>
            </AccordionItem>)}
          </Accordion>
        </AccordionItem>)}
      </Accordion>
    </div>
  )
}

interface BlockProps {
  block: Block;
}

const BlockVizualizer = ({ block }: BlockProps) => {
  const formatHour = (hour: number) => {
    return hour.toString().padStart(2, '0');
  };

  return (
    <div className="bg-gray-800 border rounded-lg p-4 shadow-sm flex items-center space-x-4 mt-6">
      <div className="flex items-center space-x-2">
        <span className="text-white">
          {formatHour(block.start_hour)}:00 - {formatHour(block.finish_hour)}:00
        </span>
      </div>
      <div className="flex items-center space-x-2">
        <span className="text-white">{block.day}</span>
      </div>
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
    onMutate: async () => {
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
    <div className="flex flex-col space-y-4 mb-6 mt-4">
      <div className="flex space-x-2">
        <input 
          type="number" 
          value={startHour} 
          onChange={(e) => setStartHour(Number(e.target.value))}
          min={0} 
          max={23} 
          className="w-20 p-2 border rounded bg-black text-white border-purple-600"
          placeholder="Start Hour"
        />

        <input 
          type="number" 
          value={finishHour} 
          onChange={(e) => setFinishHour(Number(e.target.value))}
          min={0} 
          max={23} 
          className="w-20 p-2 border rounded bg-black text-white border-purple-600"
          placeholder="Finish Hour"
        />

        <select 
          value={selectedDay} 
          onChange={(e) => setSelectedDay(e.target.value as Day)}
          className="p-2 border rounded bg-black text-white border-purple-600"
        >
          {days.map((day) => (
            <option key={day} value={day}>{day}</option>
          ))}
        </select>
      </div>

      <button 
        onClick={() => addBlockMutation.mutate()}
        disabled={addBlockMutation.isPending}
        className="text-white rounded-lg bg-black border border-purple-500 p-2"
      >
        {addBlockMutation.isPending ? 'Adding...' : 'Add Block'}
      </button>

      {addBlockMutation.isError && (
        <div className="text-red-500">
          Error adding block: {addBlockMutation.error.message}
        </div>
      )}
    </div>
  );
};

type ScheduleAdderProps = {
  class_id: number
}

const ScheduleAdder = ({ class_id }: ScheduleAdderProps) => {

  const [scheduleName, setScheduleName] = useState('')

  const queryClient = useQueryClient()

  const addScheduleMutation = useMutation({
    mutationFn: async () => {
      await add_schedule(class_id, scheduleName)
    },
    onMutate: async () => {
      queryClient.invalidateQueries({ queryKey: [`class${class_id}`]})
    }
  })

  return <div className='flex flex-row mx-2'>
    <input className='text-white bg-gray-800 p-2 mr-4 rounded-lg grow' onChange={(e) => setScheduleName(e.target.value)}/>
    <button className='text-white rounded-lg bg-black border border-purple-500 p-2'
      onClick={() => addScheduleMutation.mutate()}
    >Add schedule</button>
  </div>

}

type ClassAdderProps = {
  user_id: number
}

const ClassAdder = (props: ClassAdderProps) => {

  const [className, setClassName] = useState('')

  const queryClient = useQueryClient()

  const addClassMutation = useMutation({
    mutationFn: async () => {
      console.log('executing add class mutation')
      await add_class(props.user_id, className)
    },
    onMutate: async () => {
      queryClient.invalidateQueries({ queryKey: ['classes']})
    }
  })

  return (
    <div className='bg-black border border-purple-600 rounded-lg min-h-20 max-w-[520px] flex flex-col my-2 mb-8'>
      <input placeholder='Class name' className='m-3 rounded-lg bg-gray-800 px-3 py-1 text-white' onChange={(e) => setClassName(e.target.value)}/>
      <button className='text-white rounded-lg bg-black border border-purple-500 p-2' onClick={() => {
        console.log('class name added')
        addClassMutation.mutate()
      }}>Add class</button>
    </div>
  )
}
