import { Component, OnDestroy, OnInit }  from '@angular/core';
import * as dayjs             from 'dayjs';
import { Select, Store }      from '@ngxs/store';

import { Event } from '../models/event';
import { EventService } from '../services/event.service';
import { CalendarActions } from './state/calendar.actions';
import { CalendarState, CalendarViewMode } from './state/calendar.state';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss']
})
export class PageComponent implements OnInit, OnDestroy {

  @Select(CalendarState.activeDate) activeDate$: Observable<dayjs.Dayjs>;
  @Select(CalendarState.calendarViewMode) calendarViewMode$: Observable<CalendarViewMode>;
  @Select(CalendarState.events) events$: Observable<Event[]>;

  today: dayjs.Dayjs = dayjs().startOf('day')

  unsubscribe$: Subject<any> = new Subject()

  constructor(
    private eventService: EventService,
    private store: Store,
  ) { }

  ngOnInit(): void {
    this.activeDate$.pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe(_ => {
      this.store.dispatch(new CalendarActions.LoadEvents())
    })
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next()
    this.unsubscribe$.complete()
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
