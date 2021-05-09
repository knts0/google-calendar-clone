import { Component, OnDestroy, OnInit }  from '@angular/core';
import * as dayjs             from 'dayjs';

import { Event } from '../models/event';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CalendarFacade } from '../store/calendar/calendar.facade';
import { CalendarViewMode } from '../models/calendar-view-mode';


@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss']
})
export class PageComponent implements OnInit, OnDestroy {

  activeDate$: Observable<dayjs.Dayjs> = this.calendarFacade.activeDate$
  calendarViewMode$: Observable<CalendarViewMode> = this.calendarFacade.calendarViewMode$
  events$: Observable<Event[]> = this.calendarFacade.events$

  today: dayjs.Dayjs = dayjs().startOf('day')

  unsubscribe$: Subject<any> = new Subject()

  constructor(
    private calendarFacade: CalendarFacade,
  ) { }

  ngOnInit(): void {
    this.activeDate$.pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe(_ => {
      this.calendarFacade.loadEvents()
    })
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next()
    this.unsubscribe$.complete()
  }

  onChangeActiveDate(date: dayjs.Dayjs) {
    this.calendarFacade.setActiveDate(date)
  }

  changeActiveDatePrev(): void {
    this.calendarFacade.setActiveDateToPrev()
  }

  changeActiveDateNext(): void {
    this.calendarFacade.setActiveDateToNext()
  }

  changeActiveDateToToday(): void {
    this.calendarFacade.setActiveDateToToday()
  }
}
