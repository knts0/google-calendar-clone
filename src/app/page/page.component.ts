import { Component, OnInit }  from '@angular/core';
import * as dayjs             from 'dayjs';
import { Select, Store }      from '@ngxs/store';

import { EventService } from '../services/event.service';
import { CalendarActions } from './state/calendar.actions';
import { CalendarState, CalendarViewMode } from './state/calendar.state';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss']
})
export class PageComponent implements OnInit {

  @Select(CalendarState.activeDate) activeDate$: Observable<dayjs.Dayjs>;
  @Select(CalendarState.calendarViewMode) calendarViewMode$: Observable<CalendarViewMode>;

  today: dayjs.Dayjs = dayjs().startOf('day')

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
    this.store.dispatch(new CalendarActions.SetActiveDateToPrev())
  }

  changeActiveDateNext(): void {
    this.store.dispatch(new CalendarActions.SetActiveDateToNext())
  }

  changeActiveDateToToday(): void {
    this.store.dispatch(new CalendarActions.SetActiveDateAction(dayjs().startOf('day')))
  }
}
