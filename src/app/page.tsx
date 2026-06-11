"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Calendar from "./sections/Calendar";
import Classes from "./sections/Classes";
import GroupPlanning from "./sections/GroupPlanning";
import NavBar from "./sections/NavBar";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { add_user, delete_all_classes } from "@/lib/planner_backend";
import { useEffect, useState } from "react";
import { badgeViolet, card, dangerButton, inputClass, labelClass, primaryButton, secondaryButton } from "@/lib/ui";

const queryClient = new QueryClient()

export default function Home() {

  const [userId, setUserId] = useState('')
  const [userIdTextField, setUserIdTextField] = useState('')
  const [deletingAll, setDeletingAll] = useState(false)

  useEffect(() => {
    const user_id = localStorage.getItem('user_id')
    if (user_id) {
      setUserId(user_id)
      setUserIdTextField(user_id)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('user_id', userId)
  }, [userId])

  const handleDeleteAllClasses = async () => {
    if (!confirm('This permanently deletes ALL classes, sections, and shared courses for every user. Continue?')) return

    setDeletingAll(true)
    try {
      await delete_all_classes(Number(userId))
      queryClient.invalidateQueries()
    } finally {
      setDeletingAll(false)
    }
  }

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen w-full">
        <NavBar/>

        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex flex-col gap-10">
          <div className={`${card} flex flex-wrap items-end gap-4`} suppressHydrationWarning>
            <div className="flex flex-col gap-1">
              <label className={labelClass}>User id</label>
              <input type='number' onChange={(e) => setUserIdTextField(e.target.value)}
                className={`${inputClass} w-36`}
                placeholder='e.g. 1' value={userIdTextField}/>
            </div>

            <button className={primaryButton}
              onClick={async () => {
                const user_id = await add_user()
                setUserId(String(user_id))
                setUserIdTextField(String(user_id))
              }}
            >Register new user</button>

            <button className={secondaryButton}
              onClick={async () => {
                setUserId(userIdTextField)
              }}
            >Log in</button>

            {userId && (
              <span className={badgeViolet}>
                Logged in as #{userId} — share this id with your group
              </span>
            )}

            {userId === '1' && (
              <button className={`${dangerButton} ml-auto`}
                disabled={deletingAll}
                onClick={handleDeleteAllClasses}
              >
                {deletingAll ? 'Deleting...' : 'Delete all classes (admin)'}
              </button>
            )}
          </div>

          {userId ? (
            <>
              <Calendar userId={Number(userId)}/>
              <Classes userId={userId}/>
              <GroupPlanning userId={Number(userId)}/>
            </>
          ) : (
            <p className="text-zinc-400 text-center py-16">
              Register or log in with a user id above to start planning.
            </p>
          )}
        </main>
      </div>
      <ReactQueryDevtools initialIsOpen={false}/>
    </QueryClientProvider>
  );
}
