"use client";
import React from 'react'
import { Element } from 'react-scroll'

const Calendar = () => {
  return (
    <section className='mb-3 w-full h-full'>
      <Element name='calendar' className='w-full h-full'>

        <div className='grid grid-cols-7 grid-rows-13 w-full h-full'>

          <p className='col-start-2 col-span-1 text-white flex w-52 h-52 justify-center
            items-center pr-6 text-9xl font-bold'>
            M
          </p>

          <p className='col-start-3 col-span-1 text-white flex w-52 h-52 justify-center
            items-center pr-6 text-9xl font-bold'>
            T
          </p>

          <p className='col-start-4 col-span-1 text-white flex w-52 h-52 justify-center
            items-center pr-6 text-9xl font-bold'>
            W
          </p>

          <p className='col-start-5 col-span-1 text-white flex w-52 h-52 justify-center
            items-center pr-6 text-9xl font-bold'>
            Th
          </p>

          <p className='col-start-6 col-span-1 text-white flex w-52 h-52 justify-center
            items-center pr-6 text-9xl font-bold'>
            F
          </p>

          <p className='col-start-7 col-span-1 text-white flex w-52 h-52 justify-center
            items-center pr-6 text-9xl font-bold'>
            S
          </p>

          <p className='row-start-2 row-span-1 text-white flex w-52 h-52 justify-center
            items-center pr-6 text-7xl font-bold'>
            8am
          </p>

          <p className='row-start-3 row-span-1 text-white flex w-52 h-52 justify-center 
            items-center pr-6 text-7xl font-bold'>
            9am
          </p>

          <p className='row-start-4 row-span-1 text-white flex w-52 h-52 justify-center 
            items-center pr-6 text-6xl font-bold'>
            10am
          </p>

          <p className='row-start-5 row-span-1 text-white flex w-52 h-52 justify-center 
            items-center pr-6 text-6xl font-bold'>
            11am
          </p>

          <p className='row-start-6 row-span-1 text-white flex w-52 h-52 justify-center 
            items-center pr-6 text-6xl font-bold'>
            12pm
          </p>

          <p className='row-start-7 row-span-1 text-white flex w-52 h-52 justify-center 
            items-center pr-6 text-7xl font-bold'>
            1pm
          </p>

          <p className='row-start-8 row-span-1 text-white flex w-52 h-52 justify-center 
            items-center pr-6 text-7xl font-bold'>
            2pm
          </p>

          <p className='row-start-9 row-span-1 text-white flex w-52 h-52 justify-center 
            items-center pr-6 text-7xl font-bold'>
            3pm
          </p>

          <p className='row-start-10 row-span-1 text-white flex w-52 h-52 justify-center 
            items-center pr-6 text-7xl font-bold'>
            4pm
          </p>

          <p className='row-start-11 row-span-1 text-white flex w-52 h-52 justify-center 
            items-center pr-6 text-7xl font-bold'>
            5pm
          </p>

          <p className='row-start-12 row-span-1 text-white flex w-52 h-52 justify-center 
            items-center pr-6 text-7xl font-bold'>
            6pm
          </p>

          <p className='row-start-13 row-span-1 text-white flex w-52 h-52 justify-center 
            items-center pr-6 text-7xl font-bold'>
            7pm
          </p>
        </div>

      </Element>
    </section>
  )
}

export default Calendar
