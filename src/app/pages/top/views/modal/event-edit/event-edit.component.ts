import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA }                      from '@angular/material/dialog';
import { FormControl, FormGroup }                             from '@angular/forms';

import { Event }                   from 'src/app/models/event'
import { EventModalBaseDirective } from '../common/event-modal-base.directive';
import { CalendarFacade } from 'src/app/store/calendar/calendar.facade';

export type EventEditDialogData = {
  event: Event,
}

@Component({
  templateUrl: './event-edit.component.html',
  styleUrls: ['../common/event-modal-base.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventEditComponent extends EventModalBaseDirective implements OnInit {

  form: FormGroup

  constructor(
    private calendarFacade: CalendarFacade,
    private dialogRef: MatDialogRef<EventEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EventEditDialogData
  ) {
    super(dialogRef, calendarFacade.createEventSuccess$)
    this.form = new FormGroup({
      title: new FormControl(this.data.event.title),
      startDate: new FormControl(this.data.event.startTime.format('YYYY-MM-DD')),
      startTime: new FormControl(this.data.event.startTime.format('HH:mm')),
      endDate: new FormControl(this.data.event.endTime.format('YYYY-MM-DD')),
      endTime: new FormControl(this.data.event.endTime.format('HH:mm')),
      isAllDay: new FormControl(false),
    })
  }

  ngOnInit(): void {
    super.ngOnInit()
  }

}
