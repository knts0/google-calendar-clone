import { Injectable } from '@angular/core';
import { Selector, State } from '@ngxs/store';
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

}
