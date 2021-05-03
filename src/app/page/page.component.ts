import { Component, OnInit }  from '@angular/core';
import * as dayjs             from 'dayjs';
import { Select, Store }      from '@ngxs/store';

import { EventService } from '../services/event.service';
import { CalendarActions } from './state/calendar.actions';
import { CalendarState } from './state/calendar.state';
import { Observable } from 'rxjs';

export type CalendarViewMode = 'month' | 'week'

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss']
})
export class PageComponent implements OnInit {

  @Select(CalendarState.activeDate) activeDate$: Observable<dayjs.Dayjs>;

  today: dayjs.Dayjs = dayjs().startOf('day')

  calendarViewMode: CalendarViewMode = 'week'

  constructor(
    private eventService: EventService,
    private store: Store,
  ) { }

  ngOnInit(): void {
    this.eventService.test().subscribe(_ => console.log('test'))
  }

  onChangeActiveDate(date: dayjs.Dayjs) {
    this.store.dispatch(new CalendarActions.SetActiveDateAction(date))
  }

  changeActiveDatePrev(): void {
    switch (this.calendarViewMode) {
      case 'week':
        const newDate = this.store.selectSnapshot(CalendarState.activeDate).subtract(1, 'week')
        this.store.dispatch(new CalendarActions.SetActiveDateAction(newDate))
    }
  }

  changeActiveDateNext(): void {
    switch (this.calendarViewMode) {
      case 'week':
        const newDate = this.store.selectSnapshot(CalendarState.activeDate).add(1, 'week')
        this.store.dispatch(new CalendarActions.SetActiveDateAction(newDate))
    }
  }

  changeActiveDateToToday(): void {
    this.store.dispatch(new CalendarActions.SetActiveDateAction(dayjs().startOf('day')))
  }
}
