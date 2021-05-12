import * as dayjs from 'dayjs';

export type Event = {
  id: string,
  title: string,
  startTime: dayjs.Dayjs,
  endTime: dayjs.Dayjs,
}

export type EventLoadDto = Array<{
  id: string,
  title: string,
  startTime: string,
  endTime: string,
}>

export module EventLoadDtoModule {
  export function toModel(res: EventLoadDto): Event[] {
    return res.map(v => {
      const model: Event = {
        id: v.id,
        title: v.title,
        startTime: dayjs(v.startTime),
        endTime: dayjs(v.endTime),
      }
      return model
    })
  }
}
