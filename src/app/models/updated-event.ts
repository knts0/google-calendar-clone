import * as dayjs from 'dayjs'

export type UpdatedEvent = {
  id: string
  title: string
  startTime: dayjs.Dayjs
  endTime: dayjs.Dayjs
  isAllDay: boolean
}

export type EventUpdateDto = {
  id: string
  title: string
  startTime: string
  endTime: string
  isAllDay: boolean
}

export function toDto(model: UpdatedEvent): EventUpdateDto {
  return {
    id: model.id,
    title: model.title,
    startTime: model.startTime.format('YYYY-MM-DDTHH:mm:ss'),
    endTime: model.endTime.format('YYYY-MM-DDTHH:mm:ss'),
    isAllDay: model.isAllDay,
  }
}
