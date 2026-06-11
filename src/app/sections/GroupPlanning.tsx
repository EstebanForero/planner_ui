"use client";
import React, { useState } from 'react';
import { Element } from 'react-scroll';
import { useMutation } from '@tanstack/react-query';
import { get_group_planning } from '@/lib/planner_backend';
import WeekGrid from './WeekGrid';
import { badgeGray, badgeGreen, badgeViolet, badgeYellow, card, dangerButton, primaryButton, secondaryButton, sectionSubtitle, sectionTitle } from '@/lib/ui';
import NumberField from '../components/NumberField';

type Props = {
  userId: number;
}

const GroupPlanning = ({ userId }: Props) => {
  const [friendIds, setFriendIds] = useState<string[]>([''])
  const [matchWeight, setMatchWeight] = useState('1')
  const [dayCost, setDayCost] = useState('')
  const [hourCost, setHourCost] = useState('')
  const [exitTimeMultiplier, setExitTimeMultiplier] = useState('')
  const [count, setCount] = useState(0)

  const groupPlanningMutation = useMutation({
    mutationFn: async () => {
      const ranking_parameters = {
        cost_day: Number(dayCost || '0'),
        cost_hour: Number(hourCost || '0'),
        exit_time_multiplier: Number(exitTimeMultiplier || '0'),
      }

      const friendUserIds = friendIds
        .map(Number)
        .filter(id => !isNaN(id) && id > 0 && id !== userId)

      const uniqueIds = Array.from(new Set([userId, ...friendUserIds]))

      return await get_group_planning({
        users: uniqueIds.map(user_id => ({ user_id, ranking_parameters })),
        match_weight: Number(matchWeight || '0'),
      })
    },
    onSuccess: () => setCount(0)
  })

  const data = groupPlanningMutation.data
  const current = data?.[count]

  const highlightMap = current
    ? new Map(current.course_agreements.map(ca => [ca.course_id, ca.agreement_score]))
    : undefined

  const updateFriendId = (index: number, value: string) => {
    setFriendIds(prev => prev.map((id, i) => i === index ? value : id))
  }

  const addFriendField = () => setFriendIds(prev => [...prev, ''])

  const removeFriendField = (index: number) => {
    setFriendIds(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <Element name="group-planning">
      <section className="flex flex-col gap-4">
        <div>
          <h2 className={sectionTitle}>Group planning</h2>
          <p className={sectionSubtitle}>
            Build a joint schedule with your group. Add the user ids of the friends you want to plan with —
            for the best results, make sure everyone linked their classes to the same shared courses (copy
            the course id shown on each class card in the Classes section).
          </p>
        </div>

        <div className={`${card} flex flex-col gap-3`}>
          <span className={`${badgeViolet} self-start`}>Your user id: {userId}</span>

          <div className="flex flex-col gap-2">
            {friendIds.map((id, index) => (
              <div key={index} className="flex gap-2">
                <NumberField
                  placeholder="Friend's user id"
                  value={id}
                  onChange={(v) => updateFriendId(index, String(v))}
                  className="grow"
                  min={0}
                />
                <button
                  className={dangerButton}
                  onClick={() => removeFriendField(index)}
                  disabled={friendIds.length === 1}
                >Remove</button>
              </div>
            ))}
          </div>

          <button className={`${secondaryButton} self-start`} onClick={addFriendField}>
            + Add friend
          </button>

          <div className="flex flex-wrap items-end gap-3 pt-3 border-t border-zinc-800">
            <NumberField label="Hour cost" placeholder='0' value={hourCost} className="w-32"
              onChange={(v) => setHourCost(String(v))}/>
            <NumberField label="Day cost" placeholder='0' value={dayCost} className="w-32"
              onChange={(v) => setDayCost(String(v))}/>
            <NumberField label="Exit time multiplier" placeholder='0' value={exitTimeMultiplier} className="w-44"
              onChange={(v) => setExitTimeMultiplier(String(v))}/>
            <NumberField label="Match weight" placeholder='1' value={matchWeight} className="w-32"
              onChange={(v) => setMatchWeight(String(v))}/>
          </div>

          <button className={`${primaryButton} self-start`}
            disabled={groupPlanningMutation.isPending}
            onClick={() => groupPlanningMutation.mutate()}
          >
            {groupPlanningMutation.isPending ? 'Finding plans...' : 'Find group schedules'}
          </button>

          {groupPlanningMutation.isError && (
            <p className="text-red-400 text-sm">
              Error fetching group planning. Make sure all user ids exist and have classes.
            </p>
          )}
        </div>

        {data && data.length === 0 && (
          <p className="text-zinc-500 text-sm">No combined schedule could be found for this group.</p>
        )}

        {current && (
          <div className={card}>
            <div className="flex flex-wrap items-center gap-3 mb-4 pb-4 border-b border-zinc-800">
              <button className={`${secondaryButton} px-3 py-1.5`} disabled={count === 0} onClick={() => setCount(c => c - 1)}>
                ← Prev
              </button>
              <button className={`${secondaryButton} px-3 py-1.5`} disabled={!data || count === data.length - 1} onClick={() => setCount(c => c + 1)}>
                Next →
              </button>
              <span className="text-sm text-zinc-400">Option {count + 1} of {data?.length}</span>
              <span className={badgeViolet}>Match score: {current.match_score.toFixed(2)}</span>
              <span className="ml-auto text-sm font-semibold text-white">Total score: {current.total_score.toFixed(2)}</span>
            </div>

            {highlightMap && highlightMap.size > 0 && (
              <div className="flex flex-wrap gap-2 mb-4 text-xs">
                <span className={badgeGreen}>Green ring — everyone picked the same section</span>
                <span className={badgeYellow}>Yellow ring — shared course, different sections</span>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {current.user_weeks.map(uw => (
                <div key={uw.user_id}>
                  <p className="text-white font-semibold mb-2">User {uw.user_id} — score {uw.rated_week.puntuation.toFixed(2)}</p>
                  <WeekGrid week={uw.rated_week.week} highlightCourseIds={highlightMap}/>
                </div>
              ))}
            </div>

            {current.course_agreements.length > 0 && (
              <div className="mt-4 pt-4 border-t border-zinc-800">
                <p className="text-white font-semibold mb-2">Shared courses</p>
                <div className="flex flex-col gap-1.5">
                  {current.course_agreements.map(ca => (
                    <div key={ca.course_id} className="flex items-center gap-2 text-sm text-zinc-300">
                      <span className={ca.agreement_score >= 1 ? badgeGreen : ca.agreement_score > 0 ? badgeYellow : badgeGray}>
                        {(ca.agreement_score * 100).toFixed(0)}% aligned
                      </span>
                      <span>Course #{ca.course_id}: {ca.agreement_pairs}/{ca.total_pairs} pairs picked the same section</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </section>
    </Element>
  )
}

export default GroupPlanning
