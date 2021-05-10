import { Injectable } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import * as dayjs from 'dayjs';
import { Observable } from 'rxjs';

import { CalendarViewMode } from '../../models/calendar-view-mode';
import { Event } from '../../models/event';
import { CalendarActions } from './calendar.actions';
import { CalendarState } from './calendar.state';

@Injectable({
  providedIn: 'root',
})
export class CalendarFacade {
  @Select(CalendarState.activeDate) activeDate$: Observable<dayjs.Dayjs>;
  @Select(CalendarState.calendarViewMode) calendarViewMode$: Observable<CalendarViewMode>;
  @Select(CalendarState.events) events$: Observable<Event[]>;

  constructor(
    private store: Store
  ) {}

  getActiveDate(): dayjs.Dayjs {
    return this.store.selectSnapshot(CalendarState.activeDate)
  }

  loadEvents(startDate: dayjs.Dayjs, endDate: dayjs.Dayjs): void {
    this.store.dispatch(new CalendarActions.LoadEvents({
      startDate: startDate,
      endDate: endDate,
    }))
  }

  setActiveDate(date: dayjs.Dayjs): void {
    this.store.dispatch(new CalendarActions.SetActiveDate(date))
  }

  setActiveDateToToday(): void {
    this.store.dispatch(new CalendarActions.SetActiveDateToToday())
  }
}
