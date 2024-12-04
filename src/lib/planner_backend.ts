import ky from "ky"

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

type ScheduleEntry = {
  class_name: string;
  schedule_name: string;
};

type DaySchedule = Record<number, ScheduleEntry>;

type WeeklySchedule = {
  monday: DaySchedule;
  tuesday: DaySchedule;
  wednesday: DaySchedule;
  thursday: DaySchedule;
  friday: DaySchedule;
  Saturday: DaySchedule;
};

export async function add_user(): Promise<number> {
  return ky.post('https://planner-production-4a40.up.railway.app/planner/addUser').json();
}

export async function add_class(user_id: number, class_name: string) {
  return ky.post('https://planner-production-4a40.up.railway.app/planner/addClass',{
    json: {
      user_id: user_id,
      class_name: class_name
    }
  })
}

export async function get_class(user_id: number, class_id: number): Promise<ClassU> {
  console.log(`get class user_id: ${user_id} | class_id: ${class_id} `)
  return ky.post('https://planner-production-4a40.up.railway.app/planner/getClass', {
    json: {
      user_id: user_id,
      class_id: class_id
    }
  }).json()
}

export async function get_classes(user_id: number): Promise<ClassU[]> {
  return ky.get(`https://planner-production-4a40.up.railway.app/planner/getClasses/${user_id}`).json()
}

export async function add_schedule(class_id: number, schedule_name: string) {
  return ky.post('https://planner-production-4a40.up.railway.app/planner/addSchedule',{
    json: {
      class_id: class_id,
      schedule_name: schedule_name
    }
  })
}

export async function delete_schedule(schedule_id: number) {
  return ky.post(`https://planner-production-4a40.up.railway.app/planner/deleteSchedule/${schedule_id}`)
}

export async function add_block(block_creation: BlockCreation, schedule_id: number) {
  return ky.post('https://planner-production-4a40.up.railway.app/planner/addBlock', {
    json: {
      block: block_creation,
      schedule_id: schedule_id
    }
  })
}

export async function get_blocks(schedule_id: number): Promise<Block[]> {
  return ky.get(`https://planner-production-4a40.up.railway.app/planner/getBlocks/${schedule_id}`)
    .json()
}

export async function delete_block(block_id: number) {
  return ky.post(`https://planner-production-4a40.up.railway.app/planner/deleteBlock/${block_id}`)
}

export async function get_planning(user_id: number): Promise<WeeklySchedule> {
  return ky.get(`https://planner-production-4a40.up.railway.app/planner/planning/${user_id}`).json()
}
