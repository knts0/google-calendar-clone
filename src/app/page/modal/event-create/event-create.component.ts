import { Component, Inject, OnInit }  from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormGroup }     from '@angular/forms';
import * as dayjs                     from 'dayjs';

import { EventService } from 'src/app/services/event.service';
import { NewEvent } from 'src/app/models/new-event';

export type EventCreateDialogData = {
  start: dayjs.Dayjs,
  end: dayjs.Dayjs,
  isAllDay: boolean,
}

@Component({
  selector: 'app-event-create',
  templateUrl: './event-create.component.html',
  styleUrls: [
    '../common/event-modal-base.scss',
    './event-create.component.scss'
  ]
})
export class EventCreateComponent implements OnInit {

  form: FormGroup

  constructor(
    private dialogRef: MatDialogRef<EventCreateComponent>,
    private eventService: EventService,
    @Inject(MAT_DIALOG_DATA) public data: EventCreateDialogData
  ) {
    this.form = new FormGroup({
      title: new FormControl(''),
      startDate: new FormControl(this.data.start.format('YYYY-MM-DD')),
      startTime: new FormControl(this.data.start.format('hh:mm')),
      endDate: new FormControl(this.data.end.format('YYYY-MM-DD')),
      endTime: new FormControl(this.data.end.format('hh:mm')),
      isAllDay: new FormControl(this.data.isAllDay),
    })
  }

  ngOnInit(): void {
  }

  onSave(): void {
    const data: NewEvent = {
      title: this.form.value.title,
      startTime: this.form.value.startDate + 'T' + this.form.value.startTime,
      endTime: this.form.value.endDate + 'T' + this.form.value.endTime,
    }

    this.eventService.createEvent(data).subscribe(() => {
      this.dialogRef.close()
    })
  }

}
