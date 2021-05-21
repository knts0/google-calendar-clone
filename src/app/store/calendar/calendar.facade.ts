import { Injectable } from '@angular/core'
import { Actions, ofActionSuccessful, Select, Store } from '@ngxs/store'
import * as dayjs from 'dayjs'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { NewEvent } from 'src/app/models/new-event'
import { UpdatedEvent } from 'src/app/models/updated-event'

import { CalendarViewMode } from '../../models/calendar-view-mode'
import { Event } from '../../models/event'
import { CalendarActions } from './calendar.actions'
import { CalendarState } from './calendar.state'

@Injectable({
  providedIn: 'root',
})
export class CalendarFacade {

  @Select(CalendarState.activeDate) activeDate$: Observable<dayjs.Dayjs>
  @Select(CalendarState.calendarViewMode) calendarViewMode$: Observable<CalendarViewMode>
  @Select(CalendarState.events) events$: Observable<Event[]>

  createEventSuccess$: Observable<NewEvent> = this.actions$.pipe(
    ofActionSuccessful(CalendarActions.CreateEvent),
    map((action: CalendarActions.CreateEvent) => action.payload)
  )

  updateEventSuccess$: Observable<UpdatedEvent> = this.actions$.pipe(
    ofActionSuccessful(CalendarActions.UpdateEvent),
    map((action: CalendarActions.UpdateEvent) => action.payload)
  )

  deleteEventSuccess$: Observable<Event> = this.actions$.pipe(
    ofActionSuccessful(CalendarActions.DeleteEvent),
    map((action: CalendarActions.DeleteEvent) => action.payload)
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

  deleteEvent(event: Event): void {
    this.store.dispatch(new CalendarActions.DeleteEvent(event))
  }

  setActiveDate(date: dayjs.Dayjs): void {
    this.store.dispatch(new CalendarActions.SetActiveDate(date))
  }

  setActiveDateToToday(): void {
    this.store.dispatch(new CalendarActions.SetActiveDateToToday())
  }

}
