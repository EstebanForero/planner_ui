"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Calendar from "./sections/Calendar";
import Classes from "./sections/Classes";
import NavBar from "./sections/NavBar";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { add_user } from "@/lib/planner_backend";
import { useEffect, useState } from "react";

const queryClient = new QueryClient()

export default function Home() {

  const [userId, setUserId] = useState('')
  const [userIdTextField, setUserIdTextField] = useState('')

  useEffect(() => {
    const user_id = localStorage.getItem('user_id')
    if (user_id) {
      setUserId(userId)
    }
  })

  useEffect(() => {
    localStorage.setItem('user_id', userId)
  }, [userId])

  return (
    <QueryClientProvider client={queryClient}>
      <div className="w-full h-full">
        <NavBar/>
        <input type='number' onChange={(e) => setUserIdTextField(e.target.value)} className='rounded-lg px-4 py-2 m-4 bg-black text-white border border-purple-600' placeholder='user id' value={userIdTextField}/>
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
        <div className="w-full h-full px-8 py-6">
          <Calendar userId={Number(userId)}/>
          <Classes userId={userId}/>
        </div>
      </div>
      <ReactQueryDevtools initialIsOpen/>
    </QueryClientProvider>
  );
}
