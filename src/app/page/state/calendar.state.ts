import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import * as dayjs from 'dayjs';
import { CalendarActions } from './calendar.actions';

export type CalendarViewMode = 'month' | 'week'

export interface CalendarStateModel {
  activeDate: dayjs.Dayjs,
  calendarViewMode: CalendarViewMode,
}


@State<CalendarStateModel>({
  name: 'calendar',
  defaults: {
    activeDate: dayjs().startOf('day'),
    calendarViewMode: 'week',
  }
})
@Injectable()
export class CalendarState {

  @Selector()
  static activeDate(state: CalendarStateModel): dayjs.Dayjs {
    return state.activeDate
  }

  @Selector()
  static calendarViewMode(state: CalendarStateModel): CalendarViewMode {
    return state.calendarViewMode
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
    const state = ctx.getState();

    let newDate;
    switch (state.calendarViewMode) {
      case 'week':
        newDate = state.activeDate.subtract(1, 'week')
        break
    }
    ctx.patchState({
      activeDate: newDate
    });
  }

  @Action(CalendarActions.SetActiveDateToNext)
  setActiveDateToNext(
    ctx: StateContext<CalendarStateModel>,
  ) {
    const state = ctx.getState();

    let newDate;
    switch (state.calendarViewMode) {
      case 'week':
        newDate = state.activeDate.add(1, 'week')
        break
    }
    ctx.patchState({
      activeDate: newDate
    });
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
