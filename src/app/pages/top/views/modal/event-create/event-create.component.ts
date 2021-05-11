import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA }                      from '@angular/material/dialog';
import { FormControl, FormGroup }                             from '@angular/forms';
import * as dayjs                                             from 'dayjs';

import { NewEvent }                from 'src/app/models/new-event';
import { CalendarFacade }          from 'src/app/store/calendar/calendar.facade';
import { EventModalBaseDirective } from '../common/event-modal-base.directive';

export type EventCreateDialogData = {
  start: dayjs.Dayjs,
  end: dayjs.Dayjs,
  isAllDay: boolean,
}

@Component({
  templateUrl: './event-create.component.html',
  styleUrls: ['../common/event-modal-base.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventCreateComponent extends EventModalBaseDirective implements OnInit {

  form: FormGroup

  constructor(
    private calendarFacade: CalendarFacade,
    private dialogRef: MatDialogRef<EventCreateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EventCreateDialogData
  ) {
    super(dialogRef, calendarFacade.createEventSuccess$)
    this.form = new FormGroup({
      title: new FormControl(''),
      startDate: new FormControl(this.data.start.format('YYYY-MM-DD')),
      startTime: new FormControl(this.data.start.format('HH:mm')),
      endDate: new FormControl(this.data.end.format('YYYY-MM-DD')),
      endTime: new FormControl(this.data.end.format('HH:mm')),
      isAllDay: new FormControl(this.data.isAllDay),
    })
  }

  ngOnInit(): void {
    super.ngOnInit()
  }


  onSave(): void {
    const data: NewEvent = {
      title: this.form.value.title,
      startTime: this.form.value.startDate + 'T' + this.form.value.startTime,
      endTime: this.form.value.endDate + 'T' + this.form.value.endTime,
    }

    this.calendarFacade.createEvent(data)
  }

}
