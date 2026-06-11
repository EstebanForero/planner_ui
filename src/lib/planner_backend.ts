import ky from "ky"

// Allow either NEXT_PUBLIC_BACKEND_URL (Next-exposed) or BACKEND_URL (when the host only sets this).
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL
  ?? process.env.BACKEND_URL
  ?? "http://localhost:8080"

export type Day = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday'

export type Block = {
  start_hour: number,
  finish_hour: number,
  day: Day,
  block_id: number
}

export type BlockCreation = {
  start_hour: number,
  finish_hour: number,
  day: Day,
}

export type Schedule = {
  blocks: Block[],
  schedule_name: string,
  schedule_id: number
}

export type ClassU = {
  class_id: number,
  class_name: string,
  course_id: number,
  schedules: Schedule[]
}

export type Course = {
  course_id: number,
  course_name: string,
  schedules: Schedule[],
  class_count: number
}

export type CourseSummary = {
  course_id: number,
  course_name: string,
  class_count: number
}

export type ScheduleEntry = {
  class_name: string;
  schedule_name: string;
  course_id: number;
};

export type DaySchedule = Record<number, ScheduleEntry>;

export type WeeklySchedule = {
  monday: DaySchedule;
  tuesday: DaySchedule;
  wednesday: DaySchedule;
  thursday: DaySchedule;
  friday: DaySchedule;
  saturday: DaySchedule;
  selections: Record<string, number>;
};

export type RankedWeek = {
  week: WeeklySchedule,
  puntuation: number,
}

export interface RankingParameters {
  cost_hour: number,
  cost_day: number,
  exit_time_multiplier: number
}

export type UserRankingInput = {
  user_id: number,
  ranking_parameters: RankingParameters,
}

export type GroupPlanningRequest = {
  users: UserRankingInput[],
  match_weight: number,
}

export type CourseAgreement = {
  course_id: number,
  agreement_pairs: number,
  total_pairs: number,
  agreement_score: number,
}

export type UserRatedWeek = {
  user_id: number,
  rated_week: RankedWeek,
}

export type GroupRatedWeek = {
  user_weeks: UserRatedWeek[],
  match_score: number,
  course_agreements: CourseAgreement[],
  total_score: number,
}

export async function add_user(): Promise<number> {
  return ky.post(`${BACKEND_URL}/planner/addUser`).json();
}

export async function add_class(user_id: number, class_name: string, course_id?: number) {
  return ky.post(`${BACKEND_URL}/planner/addClass`, {
    json: {
      user_id: user_id,
      class_name: class_name,
      course_id: course_id ?? null
    }
  })
}

export async function get_class(user_id: number, class_id: number): Promise<ClassU> {
  console.log(`get class user_id: ${user_id} | class_id: ${class_id} `)
  return ky.post(`${BACKEND_URL}/planner/getClass`, {
    json: {
      user_id: user_id,
      class_id: class_id
    }
  }).json()
}

export async function get_classes(user_id: number): Promise<ClassU[]> {
  return ky.get(`${BACKEND_URL}/planner/getClasses/${user_id}`).json()
}

export async function get_classes_id(user_id: number): Promise<number[]> {
  return ky.get(`${BACKEND_URL}/planner/getClassesId/${user_id}`).json()
}

export async function delete_class(user_id: number, class_id: number) {
  ky.delete(`${BACKEND_URL}/planner/deleteClass`, {
    json: {
      user_id: user_id,
      class_id: class_id
    }
  })
}

export async function add_schedule(course_id: number, schedule_name: string) {
  return ky.post(`${BACKEND_URL}/planner/addSchedule`, {
    json: {
      course_id: course_id,
      schedule_name: schedule_name
    }
  })
}

export async function search_courses(query: string): Promise<CourseSummary[]> {
  if (!query.trim()) return []
  return ky.get(`${BACKEND_URL}/planner/searchCourses`, {
    searchParams: { q: query }
  }).json()
}

export async function get_course(course_id: number): Promise<Course> {
  return ky.get(`${BACKEND_URL}/planner/getCourse/${course_id}`).json()
}

export async function delete_all_classes(user_id: number) {
  return ky.delete(`${BACKEND_URL}/planner/deleteAllClasses`, {
    json: { user_id }
  })
}

export async function relink_class(user_id: number, class_id: number, course_id?: number) {
  return ky.patch(`${BACKEND_URL}/planner/relinkClass`, {
    json: {
      user_id: user_id,
      class_id: class_id,
      course_id: course_id ?? null
    }
  })
}

export async function delete_schedule(schedule_id: number) {
  return ky.delete(`${BACKEND_URL}/planner/deleteSchedule/${schedule_id}`)
}

export async function add_block(block_creation: BlockCreation, schedule_id: number) {
  console.log(`adding block with schedule id: ${schedule_id}`)
  console.log(block_creation)
  return ky.post(`${BACKEND_URL}/planner/addBlock`, {
    json: {
      block: block_creation,
      schedule_id: schedule_id
    }
  })
}

export async function get_blocks(schedule_id: number): Promise<Block[]> {
  return ky.get(`${BACKEND_URL}/planner/getBlocks/${schedule_id}`)
    .json()
}

export async function delete_block(block_id: number) {
  ky.delete(`${BACKEND_URL}/planner/deleteBlock/${block_id}`)
}

export async function get_planning(rankingParameters: RankingParameters, user_id: number): Promise<RankedWeek[]> {
  console.log("parameters: ");
  console.log(rankingParameters);
  return ky.post(`${BACKEND_URL}/planner/planningRanked`, {
    json: {
      ranked_parameters: rankingParameters,
      user_id: user_id,
    }
  }).json()
}

export async function get_group_planning(request: GroupPlanningRequest): Promise<GroupRatedWeek[]> {
  return ky.post(`${BACKEND_URL}/planner/groupPlanning`, {
    json: request
  }).json()
}
