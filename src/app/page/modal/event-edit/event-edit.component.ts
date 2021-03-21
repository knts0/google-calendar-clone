import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA }           from '@angular/material/dialog';
import { FormControl, FormGroup }    from '@angular/forms';
import * as dayjs                    from 'dayjs';
import * as duration                 from 'dayjs/plugin/duration';

export type EventEditDialogData = {
  date: dayjs.Dayjs,
  startTime: duration.Duration,
  endTime: duration.Duration,
}

@Component({
  selector: 'app-event-edit',
  templateUrl: './event-edit.component.html',
  styleUrls: ['./event-edit.component.scss']
})
export class EventEditComponent implements OnInit {

  form: FormGroup

  isCalendarOpen = false

  isTimePickerOpen = false

  get date(): dayjs.Dayjs {
    return this.form.value.date.format('M月D日')
  }

  timeOptions: duration.Duration[]

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: EventEditDialogData
  ) {
    dayjs.extend(duration)
    console.log(this.data.startTime.asMinutes())
    this.form = new FormGroup({
      title: new FormControl(''),
      date: new FormControl(this.data.date),
      startTime: new FormControl(this.data.startTime.asMinutes()),
      endTime: new FormControl(this.data.endTime),
    })
  }

  ngOnInit(): void {
    const result = []
    for (let minutes = 0; minutes < 60 * 24 / 15; minutes++) {
      result.push(dayjs.duration(0, 'minutes').add(minutes * 15, 'minutes'))
    }
    this.timeOptions = result
  }

  onChangeActiveDate($event: dayjs.Dayjs): void {
    this.form.patchValue({ date: $event })
    this.isCalendarOpen = false
  }

}
