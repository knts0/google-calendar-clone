import * as moment from 'moment'

export type Event = {
  title: string,
  startTime: moment.Moment,
  endTime: moment.Moment,
}
