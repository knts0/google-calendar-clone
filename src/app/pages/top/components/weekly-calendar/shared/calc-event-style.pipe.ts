import { Pipe, PipeTransform } from '@angular/core'
import * as dayjs              from 'dayjs'
import * as duration           from 'dayjs/plugin/duration'
import { getOrderOfWeek }      from 'src/app/util/date'
import {
  HEIGHT_PX_PER_HOUR,
  WIDTH_PX_PER_DAY
} from './calc-event-style'


@Pipe({
  name: 'calcEventStyle'
})
export class CalcEventStylePipe implements PipeTransform {

  transform(value: { startTime: dayjs.Dayjs, endTime: dayjs.Dayjs }): unknown {
    dayjs.extend(duration)
    const startOfDay = value.startTime.startOf('day')
    // calc preview event position
    const top    = dayjs.duration(value.startTime.diff(startOfDay)).as('hours') * HEIGHT_PX_PER_HOUR
    const bottom = dayjs.duration(value.endTime.diff(startOfDay)).as('hours') * HEIGHT_PX_PER_HOUR

    const orderOfWeek = getOrderOfWeek(startOfDay)
    const left        = orderOfWeek * WIDTH_PX_PER_DAY

    return {
      top:    `${top}px`,
      height: `${bottom - top}px`,
      left:   `${left}px`,
    }
  }

}
