import { Injectable } from '@angular/core';
import { Selector, State, StateContext } from '@ngxs/store';
import { EmitterAction, Receiver } from '@ngxs-labs/emitter';
import * as dayjs from 'dayjs';

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

  @Receiver()
  public static setActiveDate(
    { patchState }: StateContext<CalendarStateModel>,
    { payload }: EmitterAction<dayjs.Dayjs>
  ) {
    patchState({
      activeDate: payload
    })
  }

  @Receiver()
  public static setActiveDateToToday(
    state: StateContext<CalendarStateModel>,
  ) {
    state.patchState({
      activeDate: dayjs().startOf('day')
    })
  }

}
