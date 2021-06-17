import * as dayjs         from 'dayjs'
import * as duration      from 'dayjs/plugin/duration'
import { getOrderOfWeek } from 'src/app/util/date'

export const HEIGHT_PX_PER_HOUR = 60
export const WIDTH_PX_PER_DAY   = 100

export namespace CalcStyle {

  /**
   *
   * @param startTime
   * @param endTime
   * @returns { left: string, width: string }
   */
  export function calcAllDayEventStyle(startTime: dayjs.Dayjs, endTime: dayjs.Dayjs): { left: string, width: string } {
    dayjs.extend(duration)

    const startDate = startTime.startOf('date')
    const endDate   = endTime.startOf('date')

    const orderOfWeek = getOrderOfWeek(startDate)
    const left        = orderOfWeek * WIDTH_PX_PER_DAY

    const width       = WIDTH_PX_PER_DAY * (endDate.diff(startDate, 'day') + 1) - 8

    return {
      left:  `${left}px`,
      width: `${width}px`
    }
  }
}
