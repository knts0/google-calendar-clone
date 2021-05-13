import { Injectable } from '@angular/core';
import { Actions, ofActionSuccessful, Select, Store } from '@ngxs/store';
import * as dayjs from 'dayjs';
import { Observable } from 'rxjs';
import { NewEvent } from 'src/app/models/new-event';
import { UpdatedEvent } from 'src/app/models/updated-event';

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

  createEventSuccess$ = this.actions$.pipe(
    ofActionSuccessful(CalendarActions.CreateEvent)
  )

  updateEventSuccess$ = this.actions$.pipe(
    ofActionSuccessful(CalendarActions.UpdateEvent)
  )

  constructor(
    private actions$: Actions,
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

  createEvent(newEvent: NewEvent): void {
    this.store.dispatch(new CalendarActions.CreateEvent(newEvent))
  }

  updateEvent(updatedEvent: UpdatedEvent): void {
    this.store.dispatch(new CalendarActions.UpdateEvent(updatedEvent))
  }

  deleteEvent(eventId: string): void {
    this.store.dispatch(new CalendarActions.DeleteEvent({ eventId: eventId }))
  }

  setActiveDate(date: dayjs.Dayjs): void {
    this.store.dispatch(new CalendarActions.SetActiveDate(date))
  }

  setActiveDateToToday(): void {
    this.store.dispatch(new CalendarActions.SetActiveDateToToday())
  }
}
