import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import * as dayjs from 'dayjs';
import { tap } from 'rxjs/operators';
import { Event } from '../../models/event';
import { EventService } from 'src/app/services/event.service';
import { CalendarActions } from './calendar.actions';

export type CalendarViewMode = 'month' | 'week'

const FIRST_DAY_OF_WEEK = 1

export interface CalendarStateModel {
  activeDate: dayjs.Dayjs,
  calendarViewMode: CalendarViewMode,
  events: Event[],
}


@State<CalendarStateModel>({
  name: 'calendar',
  defaults: {
    activeDate: dayjs().startOf('day'),
    calendarViewMode: 'week',
    events: [],
  }
})
@Injectable()
export class CalendarState {

  constructor(
    private eventService: EventService
  ) {}

  @Selector()
  static activeDate(state: CalendarStateModel): dayjs.Dayjs {
    return state.activeDate
  }

  @Selector()
  static calendarViewMode(state: CalendarStateModel): CalendarViewMode {
    return state.calendarViewMode
  }

  @Selector()
  static events(state: CalendarStateModel): Event[] {
    return state.events
  }

  @Action(CalendarActions.LoadEvents)
  loadEvents(
    ctx: StateContext<CalendarStateModel>,
  ) {
    const state = ctx.getState()

    switch (state.calendarViewMode) {
      case 'week': {
        const weekStartDate = this.getFirstDayOfWeek(state.activeDate)
        return this.eventService.getEventsInAWeek(weekStartDate)
          .pipe(
            tap((events: Event[]) =>
              ctx.patchState({
                events: events,
              })
            )
          )
      }
    }
  }

  @Action(CalendarActions.SetActiveDateAction)
  setActiveDate(
    ctx: StateContext<CalendarStateModel>,
    action: CalendarActions.SetActiveDateAction
  ) {
    const state = ctx.getState();
    ctx.patchState({
      activeDate: action.payload
    });
  }

  @Action(CalendarActions.SetActiveDateToPrev)
  setActiveDateToPrev(
    ctx: StateContext<CalendarStateModel>,
  ) {
    const state = ctx.getState()
    switch (state.calendarViewMode) {
      case 'week': {
        const newDate = state.activeDate.subtract(1, 'week')
        ctx.patchState({
          activeDate: newDate,
        })
      }
    }
  }

  @Action(CalendarActions.SetActiveDateToNext)
  setActiveDateToNext(
    ctx: StateContext<CalendarStateModel>,
  ) {
    const state = ctx.getState()
    switch (state.calendarViewMode) {
      case 'week': {
        const newDate = state.activeDate.add(1, 'week')
        ctx.patchState({
          activeDate: newDate,
        })
      }
    }
  }

  private getFirstDayOfWeek(date: dayjs.Dayjs): dayjs.Dayjs {
    return (date.day() < FIRST_DAY_OF_WEEK)
      ? date.subtract(1, 'week').day(FIRST_DAY_OF_WEEK)
      : date.day(FIRST_DAY_OF_WEEK)
  }

  @Action(CalendarActions.SetActiveDateToTodayAction)
  setActiveDateToToday(
    ctx: StateContext<CalendarStateModel>,
  ) {
    ctx.patchState({
      activeDate: dayjs().startOf('day')
    });
  }

}
