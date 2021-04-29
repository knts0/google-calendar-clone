import { Component, Inject, OnInit }  from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormGroup }     from '@angular/forms';
import * as dayjs                     from 'dayjs';

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
    private dialog: MatDialog,
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

  }

}
