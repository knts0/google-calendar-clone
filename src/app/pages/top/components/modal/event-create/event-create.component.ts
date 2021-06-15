import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnDestroy,
  OnInit
} from '@angular/core'
import {
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material/dialog'
import { FormGroup } from '@ngneat/reactive-forms'
import * as dayjs    from 'dayjs'
import { Subject }   from 'rxjs'
import { takeUntil } from 'rxjs/operators'

import { NewEvent }       from 'src/app/models/new-event'
import { CalendarFacade } from 'src/app/store/calendar/calendar.facade'
import {
  FormData,
  EventCreatePresenter
} from './event-create.presenter'

export type EventCreateDialogData = {
  start:    dayjs.Dayjs
  end:      dayjs.Dayjs
  isAllDay: boolean
}

@Component({
  templateUrl:     './event-create.component.html',
  styleUrls:       ['../shared/event-modal-base.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers:       [EventCreatePresenter],
})
export class EventCreateComponent implements OnInit, OnDestroy {

  unsubscribe$: Subject<any> = new Subject()

  get form(): FormGroup<FormData> {
    return this.presenter.form
  }

  constructor(
    private calendarFacade: CalendarFacade,
    private dialogRef:      MatDialogRef<EventCreateComponent>,
    private presenter:      EventCreatePresenter,
    @Inject(MAT_DIALOG_DATA) public data: EventCreateDialogData
  ) {
    this.presenter.init({
      title:     '',
      startDate: this.data.start.format('YYYY-MM-DD'),
      startTime: this.data.start.format('HH:mm'),
      endDate:   this.data.end.format('YYYY-MM-DD'),
      endTime:   this.data.end.format('HH:mm'),
      isAllDay:  this.data.isAllDay,
    })
  }

  ngOnInit(): void {
    this.presenter.create$.subscribe((newEvent: NewEvent) => {
      this.calendarFacade.createEvent(newEvent)
    })

    this.calendarFacade.createEventSuccess$.pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe(_ =>
      this.dialogRef.close()
    )
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next()
    this.unsubscribe$.complete()
  }

  onSave(): void {
    this.presenter.createEvent()
  }

}
