import { ChangeDetectionStrategy, Component, OnDestroy, OnInit }  from '@angular/core';
import * as dayjs                        from 'dayjs';
import { Observable, Subject }           from 'rxjs';
import { takeUntil }                     from 'rxjs/operators';

import { Event } from '../../../../models/event';
import { CalendarViewMode } from '../../../../models/calendar-view-mode';
import { CalendarFacade } from '../../../../store/calendar/calendar.facade';
import { getFirstDayOfWeek } from 'src/app/util/date';


@Component({
  selector: 'app-top-container',
  templateUrl: './top.container.html',
  styleUrls: ['./top.container.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopContainerComponent implements OnInit, OnDestroy {

  activeDate$: Observable<dayjs.Dayjs> = this.calendarFacade.activeDate$
  events$: Observable<Event[]> = this.calendarFacade.events$

  today: dayjs.Dayjs = dayjs().startOf('day')

  calendarViewMode: CalendarViewMode = 'week'

  unsubscribe$: Subject<any> = new Subject()

  constructor(
    private calendarFacade: CalendarFacade,
  ) { }

  ngOnInit(): void {
    this.activeDate$.pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe(_ => {
      switch (this.calendarViewMode) {
        case 'week': {
          const startDate = getFirstDayOfWeek(this.calendarFacade.getActiveDate())
          this.calendarFacade.loadEvents(startDate, startDate.add(1, 'week'))
          break
        }
      }
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
    let newDate
    switch (this.calendarViewMode) {
      case 'week': {
        newDate = this.calendarFacade.getActiveDate().subtract(1, 'week')
        break
      }
    }
    this.calendarFacade.setActiveDate(newDate)
  }

  changeActiveDateNext(): void {
    let newDate
    switch (this.calendarViewMode) {
      case 'week': {
        newDate = this.calendarFacade.getActiveDate().add(1, 'week')
        break
      }
    }
    this.calendarFacade.setActiveDate(newDate)
  }

  changeActiveDateToToday(): void {
    this.calendarFacade.setActiveDateToToday()
  }
}
