import { ChangeDetectionStrategy, Component, OnDestroy, OnInit }  from '@angular/core';
import { MatSnackBar }                   from '@angular/material/snack-bar';
import * as dayjs                        from 'dayjs';
import { Observable, Subject }           from 'rxjs';
import { merge }                         from 'rxjs';
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
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    merge(
      this.activeDate$,
      this.calendarFacade.createEventSuccess$,
      this.calendarFacade.updateEventSuccess$,
    ).pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe(_ => {
      this.loadEvent()
    })


    // after event deleted
    this.calendarFacade.deleteEventSuccess$.pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe((v: Event) => {
      this.snackBar.open(
        `予定「${v.title}」を削除しました`,
        'OK',
        {
          duration: 5000
        }
      )

      this.loadEvent()
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

  private loadEvent(): void {
    switch (this.calendarViewMode) {
      case 'week': {
        const startDate = getFirstDayOfWeek(this.calendarFacade.getActiveDate())
        this.calendarFacade.loadEvents(startDate, startDate.add(1, 'week'))
        break
      }
    }
  }
}
