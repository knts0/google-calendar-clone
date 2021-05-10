import * as dayjs from 'dayjs';

export module CalendarActions {
  export class LoadEvents {
    static readonly type = '[CalendarState] LoadEvents';
    constructor(public readonly payload: {
      startDate: dayjs.Dayjs,
      endDate: dayjs.Dayjs,
    }) {}
  }

  export class SetActiveDate {
    static readonly type = '[CalendarState] SetActiveDate';
    constructor(public readonly payload: dayjs.Dayjs) {}
  }

  export class SetActiveDateToToday {
    static readonly type = '[CalendarState] SetActiveDateToToday';
  }
}
