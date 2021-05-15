import * as dayjs from 'dayjs';

import { Event } from 'src/app/models/event';
import { NewEvent } from 'src/app/models/new-event';
import { UpdatedEvent } from 'src/app/models/updated-event';

export module CalendarActions {
  export class LoadEvents {
    static readonly type = '[CalendarState] LoadEvents';
    constructor(public readonly payload: {
      startDate: dayjs.Dayjs,
      endDate: dayjs.Dayjs,
    }) {}
  }

  export class CreateEvent {
    static readonly type = '[CalendarState] CreateEvent';
    constructor(public readonly payload: NewEvent) {}
  }

  export class UpdateEvent {
    static readonly type = '[CalendarState] UpdateEvent';
    constructor(public readonly payload: UpdatedEvent) {}
  }

  export class DeleteEvent {
    static readonly type = '[CalendarState] DeleteEvent';
    constructor(public readonly payload: Event) {}
  }

  export class SetActiveDate {
    static readonly type = '[CalendarState] SetActiveDate';
    constructor(public readonly payload: dayjs.Dayjs) {}
  }

  export class SetActiveDateToToday {
    static readonly type = '[CalendarState] SetActiveDateToToday';
  }
}
