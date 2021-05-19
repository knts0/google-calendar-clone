import * as dayjs from 'dayjs'

export type NewEvent = {
  title: string
  startTime: dayjs.Dayjs
  endTime: dayjs.Dayjs
}

export type EventCreateDto = {
  title: string
  startTime: string
  endTime: string
}

export namespace EventCreateDtoModule {
  export function toDto(model: NewEvent): EventCreateDto {
    return {
      title: model.title,
      startTime: model.startTime.format('YYYY-MM-DDTHH:mm:ss'),
      endTime: model.endTime.format('YYYY-MM-DDTHH:mm:ss'),
    }
  }
}
