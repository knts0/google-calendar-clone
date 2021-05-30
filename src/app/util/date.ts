import * as dayjs from 'dayjs'

export const DAYS_PER_WEEK = 7
export const FIRST_DAY_OF_WEEK = 1

export function getFirstDayOfWeek(date: dayjs.Dayjs): dayjs.Dayjs {
  return (date.day() < FIRST_DAY_OF_WEEK)
    ? date.subtract(1, 'week').day(FIRST_DAY_OF_WEEK)
    : date.day(FIRST_DAY_OF_WEEK)
}

export function getOrderOfWeek(date: dayjs.Dayjs): number {
  return (date.day() + DAYS_PER_WEEK - FIRST_DAY_OF_WEEK) % DAYS_PER_WEEK
}
