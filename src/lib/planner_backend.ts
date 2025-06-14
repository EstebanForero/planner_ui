import ky from "ky"

const BACKEND_URL = "http://localhost:8080"

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
  schedules: Schedule[]
}

export type ScheduleEntry = {
  class_name: string;
  schedule_name: string;
};

export type DaySchedule = Record<number, ScheduleEntry>;

export type WeeklySchedule = {
  monday: DaySchedule;
  tuesday: DaySchedule;
  wednesday: DaySchedule;
  thursday: DaySchedule;
  friday: DaySchedule;
  saturday: DaySchedule;
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

export async function add_user(): Promise<number> {
  return ky.post(`${BACKEND_URL}/planner/addUser`).json();
}

export async function add_class(user_id: number, class_name: string) {
  return ky.post(`${BACKEND_URL}/planner/addClass`, {
    json: {
      user_id: user_id,
      class_name: class_name
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

export async function add_schedule(class_id: number, schedule_name: string) {
  return ky.post(`${BACKEND_URL}/planner/addSchedule`, {
    json: {
      class_id: class_id,
      schedule_name: schedule_name
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
