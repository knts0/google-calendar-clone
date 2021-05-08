import * as dayjs from 'dayjs';

export type Event = {
  id: string,
  title: string,
  startTime: dayjs.Dayjs,
  endTime: dayjs.Dayjs,
}
