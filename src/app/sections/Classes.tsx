"use client";
import { add_class, add_user, ClassU, get_class, get_classes } from '@/lib/planner_backend';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react'
import { Element } from 'react-scroll'
import { Spinner } from '@nextui-org/spinner';
import {Accordion, AccordionItem} from "@nextui-org/accordion";


const Classes = () => {

  const [userId, setUserId] = useState('')
  const [userIdTextField, setUserIdTextField] = useState('')

  const { data, isError, isLoading } = useQuery({
    queryKey: ['classes', userId],
    queryFn: async () => await get_classes(Number(userId))
  })

  console.log('class info is: ', data)

  return (
    <section className='mt-2'>
      <input type='number' onChange={(e) => setUserIdTextField(e.target.value)} className='rounded-lg px-4 py-1 m-4' placeholder='user id' value={userIdTextField}/>
      <button className='text-white rounded-lg bg-black border border-purple-500 p-2'
        onClick={async () => {
          const user_id = await add_user()
          setUserId(String(user_id))
          setUserIdTextField(String(user_id))
        }}
      >Register</button>
      <button className='text-white rounded-lg bg-black border border-purple-500 p-2 ml-4'
        onClick={async () => {
          setUserId(userIdTextField)
        }}
      >Log In</button>
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

  const { data, isLoading } = useQuery({
    queryFn: async () => {
      const class_info = await get_class(user_id, class_id)
      console.log(class_info)
      return class_info
    },
    queryKey: [`class${class_id}`]
  })

  if (isLoading) {
    return <div className='bg-black border border-purple-600 rounded-lg min-h-20 max-w-[520px] p-4'>
      <Spinner/>
    </div>

  }

  return (
    <div className='bg-black border border-purple-600 rounded-lg min-h-20 max-w-[520px] p-4'>
      <h1 className='text-white'>{data?.class_name}</h1>
      <Accordion variant='splitted'>
        {data?.schedules.map(schedule => <AccordionItem>
          {schedule.schedule_name}
        </AccordionItem>)}
      </Accordion>
    </div>
  )
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
