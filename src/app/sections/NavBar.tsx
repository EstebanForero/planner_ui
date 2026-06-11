"use client";
import React from 'react'
import { Link } from 'react-scroll'

const navLinkClass = 'cursor-pointer text-sm font-medium text-zinc-400 hover:text-white ' +
  'hover:bg-zinc-800 rounded-lg px-3 py-2 transition-colors'

const NavBar = () => {
  return (
    <header className='sticky top-0 z-30 w-full border-b border-zinc-800 bg-zinc-950/80 backdrop-blur'>
      <div className='max-w-6xl mx-auto flex items-center justify-between gap-4 px-4 sm:px-6 h-16'>
        <div className='flex items-center gap-2'>
          <span className='inline-flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600 text-white font-bold'>
            S
          </span>
          <span className='text-white font-semibold tracking-tight'>Schedule Planner</span>
        </div>

        <nav className='flex items-center gap-1'>
          <Link to='calendar' className={navLinkClass} activeClass='text-white bg-zinc-800' offset={-80} smooth spy>
            Calendar
          </Link>
          <Link to='classes' className={navLinkClass} activeClass='text-white bg-zinc-800' offset={-80} smooth spy>
            Classes
          </Link>
          <Link to='group-planning' className={navLinkClass} activeClass='text-white bg-zinc-800' offset={-80} smooth spy>
            Group planning
          </Link>
        </nav>
      </div>
    </header>
  )
}

export default NavBar
