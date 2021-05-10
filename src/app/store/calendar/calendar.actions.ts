import * as dayjs from 'dayjs';

export module CalendarActions {
  export class LoadEvents {
    static readonly type = '[CalendarState] LoadEvents';
  }

  export class SetActiveDate {
    static readonly type = '[CalendarState] SetActiveDate';
    constructor(public readonly payload: dayjs.Dayjs) {}
  }

  export class SetActiveDateToPrev {
    static readonly type = '[CalendarState] SetActiveToPrev';
  }

  export class SetActiveDateToNext {
    static readonly type = '[CalendarState] SetActiveToNext';
  }

  export class SetActiveDateToToday {
    static readonly type = '[CalendarState] SetActiveDateToToday';
  }
}
