import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA }                      from '@angular/material/dialog'
import { FormGroup }                                          from '@ngneat/reactive-forms'
import * as dayjs                                             from 'dayjs'

import { NewEvent }                from 'src/app/models/new-event'
import { CalendarFacade }          from 'src/app/store/calendar/calendar.facade'
import { EventModalBaseDirective } from '../shared/event-modal-base.directive'
import { FormData, EventCreatePresenter } from './event-create.presenter'

export type EventCreateDialogData = {
  start: dayjs.Dayjs
  end: dayjs.Dayjs
  isAllDay: boolean
}

@Component({
  templateUrl: './event-create.component.html',
  styleUrls: ['../shared/event-modal-base.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [EventCreatePresenter],
})
export class EventCreateComponent extends EventModalBaseDirective implements OnInit {

  get form(): FormGroup<FormData> {
    return this.presenter.form
  }

  constructor(
    private calendarFacade: CalendarFacade,
    private dialogRef: MatDialogRef<EventCreateComponent>,
    private presenter: EventCreatePresenter,
    @Inject(MAT_DIALOG_DATA) public data: EventCreateDialogData
  ) {
    super(dialogRef, calendarFacade.createEventSuccess$)
    this.presenter.init({
      title: '',
      startDate: this.data.start.format('YYYY-MM-DD'),
      startTime: this.data.start.format('HH:mm'),
      endDate: this.data.end.format('YYYY-MM-DD'),
      endTime: this.data.end.format('HH:mm'),
      isAllDay: this.data.isAllDay,
    })
  }

  ngOnInit(): void {
    super.ngOnInit()
    this.presenter.create$.subscribe((newEvent: NewEvent) => {
      this.calendarFacade.createEvent(newEvent)
    })
  }

  onSave(): void {
    this.presenter.createEvent()
  }

}
