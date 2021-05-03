import * as dayjs from 'dayjs';

export module CalendarActions {
  export class SetActiveDateAction {
    static readonly type = '[CalendarState] SetActiveDate';
    constructor(public readonly payload: dayjs.Dayjs) {}
  }

  export class SetActiveDateToTodayAction {
    static readonly type = '[CalendarState] SetActiveDateToToday';
  }
}
