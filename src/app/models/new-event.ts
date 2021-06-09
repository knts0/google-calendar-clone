import * as dayjs from 'dayjs'

export type NewEvent = {
  title: string
  startTime: dayjs.Dayjs
  endTime: dayjs.Dayjs
  isAllDay: boolean
}

export type EventCreateDto = {
  title: string
  startTime: string
  endTime: string
  isAllDay: boolean
}

export function toDto(model: NewEvent): EventCreateDto {
  return {
    title: model.title,
    startTime: model.startTime.format('YYYY-MM-DDTHH:mm:ss'),
    endTime: model.endTime.format('YYYY-MM-DDTHH:mm:ss'),
    isAllDay: model.isAllDay,
  }
}
