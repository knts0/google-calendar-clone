import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA }           from '@angular/material/dialog';
import { FormControl, FormGroup }    from '@angular/forms';
import * as dayjs                    from 'dayjs';
import * as duration                 from 'dayjs/plugin/duration';

export type EventCreateDialogData = {
  start: dayjs.Dayjs,
  end: dayjs.Dayjs,
  isAllDay: boolean,
}

@Component({
  selector: 'app-event-create',
  templateUrl: './event-create.component.html',
  styleUrls: ['./event-create.component.scss']
})
export class EventCreateComponent implements OnInit {

  form: FormGroup

  isCalendarOpen = false

  isTimePickerOpen = false

  timeOptions: duration.Duration[]

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: EventCreateDialogData
  ) {
    // dayjs.extend(duration)
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
    const result = []
    for (let minutes = 0; minutes < 60 * 24 / 15; minutes++) {
      result.push(dayjs.duration(0, 'minutes').add(minutes * 15, 'minutes'))
    }
    this.timeOptions = result
  }

  onChangeStartDate($event: dayjs.Dayjs): void {
    console.log($event)
    this.form.patchValue({ date: $event })
    this.isCalendarOpen = false
  }

}
