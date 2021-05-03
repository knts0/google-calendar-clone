import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import * as dayjs from 'dayjs';
import { CalendarActions } from './calendar.actions';

export interface CalendarStateModel {
  activeDate: dayjs.Dayjs,
}


@State<CalendarStateModel>({
  name: 'calendar',
  defaults: {
    activeDate: dayjs().startOf('day')
  }
})
@Injectable()
export class CalendarState {

  @Selector()
  static activeDate(state: CalendarStateModel): dayjs.Dayjs {
    return state.activeDate
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

  @Action(CalendarActions.SetActiveDateToTodayAction)
  setActiveDateToToday(
    ctx: StateContext<CalendarStateModel>,
  ) {
    ctx.patchState({
      activeDate: dayjs().startOf('day')
    });
  }

}
