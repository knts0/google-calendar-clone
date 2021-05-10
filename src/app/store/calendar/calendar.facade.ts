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

  loadEvents(): void {
    this.store.dispatch(new CalendarActions.LoadEvents())
  }

  setActiveDate(date: dayjs.Dayjs): void {
    this.store.dispatch(new CalendarActions.SetActiveDateAction(date))
  }

  setActiveDateToPrev(): void {
    this.store.dispatch(new CalendarActions.SetActiveDateToPrev())
  }

  setActiveDateToNext(): void {
    this.store.dispatch(new CalendarActions.SetActiveDateToNext())
  }

  setActiveDateToToday(): void {
    this.store.dispatch(new CalendarActions.SetActiveDateAction(dayjs().startOf('day')))
  }
}
