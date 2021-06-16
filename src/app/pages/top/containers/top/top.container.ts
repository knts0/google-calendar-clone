import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit
}  from '@angular/core'
import { MatDialog }           from '@angular/material/dialog'
import { MatSnackBar }         from '@angular/material/snack-bar'
import * as dayjs              from 'dayjs'
import { Observable, Subject } from 'rxjs'
import { takeUntil }           from 'rxjs/operators'

import { Event }                from 'src/app/models/event'
import { UpdatedEvent }         from 'src/app/models/updated-event'
import { NewEvent }             from 'src/app/models/new-event'
import { CalendarFacade }       from 'src/app/store/calendar/calendar.facade'
import { getFirstDayOfWeek }    from 'src/app/util/date'
import { EventCreateComponent } from '../../components/modal/event-create/event-create.component'


type CalendarViewMode = 'month' | 'week'

@Component({
  selector: 'app-top-container',
  templateUrl: './top.container.html',
  styleUrls: ['./top.container.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopContainerComponent implements OnInit, OnDestroy {

  activeDate$: Observable<dayjs.Dayjs> = this.calendarFacade.activeDate$
  events$: Observable<Event[]> = this.calendarFacade.events$

  calendarViewMode: CalendarViewMode = 'week'

  unsubscribe$: Subject<any> = new Subject()

  constructor(
    private calendarFacade: CalendarFacade,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.calendarFacade.setActiveDateSuccess$.pipe(
      takeUntil(this.unsubscribe$),
    ).subscribe(_ => {
      this.loadEvent()
    })

    // after event created
    this.calendarFacade.createEventSuccess$.pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe((v: NewEvent) => {
      this.snackBar.open(
        `予定「${v.title}」を作成しました`,
        'OK',
        {
          duration: 5000
        }
      )

      this.loadEvent()
    })

    // after event updated
    this.calendarFacade.updateEventSuccess$.pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe((v: UpdatedEvent) => {
      this.snackBar.open(
        `予定「${v.title}」を更新しました`,
        'OK',
        {
          duration: 5000
        }
      )

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

  onCreateEvent(): void {
    const startDateTime = dayjs().startOf('hour').add(1, 'hour')
    const data = {
      start:    startDateTime,
      end:      startDateTime.add(1, 'hour'),
      isAllDay: false,
    }

    this.dialog.open(EventCreateComponent, {
      data: data,
      panelClass: 'dialog-overlay',
    })
  }

  changeActiveDatePrev(): void {
    switch (this.calendarViewMode) {
      case 'week': {
        const newDate = this.calendarFacade.getActiveDate().subtract(1, 'week')
        this.calendarFacade.setActiveDate(newDate)
        break
      }
    }
  }

  changeActiveDateNext(): void {
    switch (this.calendarViewMode) {
      case 'week': {
        const newDate = this.calendarFacade.getActiveDate().add(1, 'week')
        this.calendarFacade.setActiveDate(newDate)
        break
      }
    }
  }

  changeActiveDateToToday(): void {
    this.calendarFacade.setActiveDate(dayjs().startOf('day'))
  }

  onUpdateEvent(event: UpdatedEvent): void {
    this.calendarFacade.updateEvent(event)
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
