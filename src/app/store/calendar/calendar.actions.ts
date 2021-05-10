import * as dayjs from 'dayjs';

export module CalendarActions {
  export class LoadEvents {
    static readonly type = '[CalendarState] LoadEvents';
  }

  export class SetActiveDate {
    static readonly type = '[CalendarState] SetActiveDate';
    constructor(public readonly payload: dayjs.Dayjs) {}
  }

  export class SetActiveDateToToday {
    static readonly type = '[CalendarState] SetActiveDateToToday';
  }
}
