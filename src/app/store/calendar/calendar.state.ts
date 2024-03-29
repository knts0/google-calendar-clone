import { Injectable } from '@angular/core'
import { Action, Selector, State, StateContext } from '@ngxs/store'
import * as dayjs from 'dayjs'
import { tap } from 'rxjs/operators'
import { Event } from '../../models/event'
import { EventService } from 'src/app/services/event.service'
import { CalendarActions } from './calendar.actions'
import * as newEvent from 'src/app/models/new-event'
import * as updatedEvent from 'src/app/models/updated-event'


export interface CalendarStateModel {
  activeDate: dayjs.Dayjs
  events: Event[]
}


@State<CalendarStateModel>({
  name: 'calendar',
  defaults: {
    activeDate: dayjs().startOf('day'),
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

  @Action(CalendarActions.CreateEvent)
  createEvent(
    ctx: StateContext<CalendarStateModel>,
    action: CalendarActions.CreateEvent,
  ) {
    return this.eventService.createEvent(
      newEvent.toDto(action.payload)
    )
  }

  @Action(CalendarActions.UpdateEvent)
  updateEvent(
    ctx: StateContext<CalendarStateModel>,
    action: CalendarActions.UpdateEvent,
  ) {
    return this.eventService.updateEvent(
      updatedEvent.toDto(action.payload)
    )
  }

  @Action(CalendarActions.DeleteEvent)
  deleteEvent(
    ctx: StateContext<CalendarStateModel>,
    action: CalendarActions.DeleteEvent,
  ) {
    return this.eventService.deleteEvent(action.payload.id)
  }

  @Action(CalendarActions.SetActiveDate)
  setActiveDate(
    ctx: StateContext<CalendarStateModel>,
    action: CalendarActions.SetActiveDate
  ) {
    const state = ctx.getState()
    ctx.patchState({
      activeDate: action.payload
    })
  }

}
