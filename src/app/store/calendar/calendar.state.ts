import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import * as dayjs from 'dayjs';
import { tap } from 'rxjs/operators';
import { Event } from '../../models/event';
import { EventService } from 'src/app/services/event.service';
import { CalendarActions } from './calendar.actions';
import { CalendarViewMode } from '../../models/calendar-view-mode';


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
    action: CalendarActions.LoadEvents,
  ) {
    return this.eventService.getEvents(action.payload.startDate, action.payload.endDate)
      .pipe(
        tap((events: Event[]) =>
          ctx.patchState({
            events: events,
          })
        )
      )
  }

  @Action(CalendarActions.SetActiveDate)
  setActiveDate(
    ctx: StateContext<CalendarStateModel>,
    action: CalendarActions.SetActiveDate
  ) {
    const state = ctx.getState();
    ctx.patchState({
      activeDate: action.payload
    });
  }

  @Action(CalendarActions.SetActiveDateToToday)
  setActiveDateToToday(
    ctx: StateContext<CalendarStateModel>,
  ) {
    ctx.patchState({
      activeDate: dayjs().startOf('day')
    });
  }

}
