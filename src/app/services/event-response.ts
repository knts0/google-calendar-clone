import * as dayjs from "dayjs"
import { Event } from '../models/event';

export type EventResponse = Array<{
  id: string,
  title: string,
  startTime: string,
  endTime: string,
}>

export module EventResponseModule {
  export function toModel(res: EventResponse): Event[] {
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
