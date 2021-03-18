import * as dayjs from 'dayjs'

export type Event = {
  title: string,
  startTime: dayjs.Dayjs,
  endTime: dayjs.Dayjs,
}
