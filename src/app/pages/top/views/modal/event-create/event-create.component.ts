import { ChangeDetectionStrategy, Component, Inject, OnInit }  from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormGroup }     from '@angular/forms';
import * as dayjs                     from 'dayjs';

import { NewEvent } from 'src/app/models/new-event';
import { CalendarFacade } from 'src/app/store/calendar/calendar.facade';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export type EventCreateDialogData = {
  start: dayjs.Dayjs,
  end: dayjs.Dayjs,
  isAllDay: boolean,
}

@Component({
  selector: 'app-event-create',
  templateUrl: './event-create.component.html',
  styleUrls: ['../common/event-modal-base.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventCreateComponent implements OnInit {

  form: FormGroup

  unsubscribe$: Subject<any> = new Subject()

  constructor(
    private dialogRef: MatDialogRef<EventCreateComponent>,
    private calendarFacade: CalendarFacade,
    @Inject(MAT_DIALOG_DATA) public data: EventCreateDialogData
  ) {
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
    const data: NewEvent = {
      title: this.form.value.title,
      startTime: this.form.value.startDate + 'T' + this.form.value.startTime,
      endTime: this.form.value.endDate + 'T' + this.form.value.endTime,
    }

    this.calendarFacade.createEvent(data)
  }

}
