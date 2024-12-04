"use client";
import { add_class, add_schedule, add_user, ClassU, delete_class, get_class, get_classes } from '@/lib/planner_backend';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react'
import { Element } from 'react-scroll'
import { Spinner } from '@nextui-org/spinner';
import {Accordion, AccordionItem} from "@nextui-org/accordion";


type Props = {
  userId: string
}

const Classes = ({ userId }: Props) => {

  const { data, isError, isLoading } = useQuery({
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
      delete_class(user_id, class_id)
    },
    onMutate: () => {
      queryClient.invalidateQueries({ queryKey: ['classes']})
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

        </AccordionItem>)}
      </Accordion>
    </div>
  )
}

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
    onMutate: () => {
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
    onMutate: () => {
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
