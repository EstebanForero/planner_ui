"use client";
import React from 'react'
import { Link } from 'react-scroll'

const NavBar = () => {
  return (
    <section className='flex sticky top-0 w-full h-20 bg-[#2C2C2C] justify-between 
      items-center p-8'>

      <Link to='calendar' className='cursor-pointer text-[#CCCCCC] order-1' offset={-100} smooth>
        Calendar
      </Link>

      <figure className='aspect-square rounded-full bg-blue-500 w-12 h-12 order-2'/>

      <Link to='classes' className='cursor-pointer text-[#CCCCCC] order-3' offset={-100} smooth>
        Classes 
      </Link>
    </section>
  )
}

export default NavBar
