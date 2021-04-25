import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA }           from '@angular/material/dialog';
import { FormControl, FormGroup }    from '@angular/forms';
import * as dayjs                    from 'dayjs';
import * as duration                 from 'dayjs/plugin/duration';

import { Event } from '../../../models/event'

export type EventEditDialogData = {
  event: Event,
}

@Component({
  selector: 'app-event-edit',
  templateUrl: './event-edit.component.html',
  styleUrls: [
    '../common/event-modal-base.scss',
    './event-edit.component.scss'
  ]
})
export class EventEditComponent implements OnInit {

  form: FormGroup

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: EventEditDialogData
  ) {
    this.form = new FormGroup({
      title: new FormControl(this.data.event.title),
      startDate: new FormControl(this.data.event.startTime.format('YYYY-MM-DD')),
      startTime: new FormControl(this.data.event.startTime.format('hh:mm')),
      endDate: new FormControl(this.data.event.endTime.format('YYYY-MM-DD')),
      endTime: new FormControl(this.data.event.endTime.format('hh:mm')),
      isAllDay: new FormControl(false),
    })
  }

  ngOnInit(): void {
  }

}
