export enum STATUS {
  EMERGENCY,
  NORMAL,
}

export enum MODE {
  MONTH,
  DAY,
}

export type DateItem = {
  date: string
}

export type Task = {
  date: string
  todo: string[]
  status: STATUS
}
