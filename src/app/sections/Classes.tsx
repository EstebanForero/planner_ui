"use client";
import { ClassU } from '@/lib/planner_backend';
import React from 'react'
import { Element } from 'react-scroll'


const Classes = () => {

  return (
    <section className='mt-2'>
      <Element name='classes'>
        <Class class={
          {
            class_id: 0,
            class_name: 'Math',
            schedules: []
          }
        }/>
      </Element>
    </section>
  )
}

export default Classes


type ClassProps = {
  class: ClassU
}

const Class = ({ current_class }: ClassProps) => {
  return (
    <div className='bg-black border border-purple-600 rounded-lg min-h-20 max-w-[520px]'>Classes</div>
  )
}
