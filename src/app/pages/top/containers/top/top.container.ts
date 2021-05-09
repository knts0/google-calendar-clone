import { Component, OnDestroy, OnInit }  from '@angular/core';
import * as dayjs                        from 'dayjs';
import { Observable, Subject }           from 'rxjs';
import { takeUntil }                     from 'rxjs/operators';

import { Event } from '../../../../models/event';
import { CalendarViewMode } from '../../../../models/calendar-view-mode';
import { CalendarFacade } from '../../../../store/calendar/calendar.facade';


@Component({
  selector: 'app-top-container',
  templateUrl: './top.container.html',
  styleUrls: ['./top.container.scss']
})
export class TopContainerComponent implements OnInit, OnDestroy {

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
