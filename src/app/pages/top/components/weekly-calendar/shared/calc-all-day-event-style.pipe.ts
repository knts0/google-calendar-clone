import { Pipe, PipeTransform } from '@angular/core'
import * as dayjs              from 'dayjs'
import * as duration           from 'dayjs/plugin/duration'
import { getOrderOfWeek }      from 'src/app/util/date'
import {
  WIDTH_PX_PER_DAY
} from './calc-event-style'

@Pipe({
  name: 'calcAllDayEventStyle'
})
export class CalcAllDayEventStylePipe implements PipeTransform {

  transform(value: { startTime: dayjs.Dayjs, endTime: dayjs.Dayjs }): { left: string, width: string } {
    dayjs.extend(duration)

    const startDate = value.startTime.startOf('date')
    const endDate   = value.endTime.startOf('date')

    const orderOfWeek = getOrderOfWeek(startDate)
    const left        = orderOfWeek * WIDTH_PX_PER_DAY

    const width       = WIDTH_PX_PER_DAY * (endDate.diff(startDate, 'day') + 1) - 8

    return {
      left:  `${left}px`,
      width: `${width}px`
    }
  }

}
