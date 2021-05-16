import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA }           from '@angular/material/dialog';
import { FormControl, FormGroup }                             from '@ngneat/reactive-forms';
import { map, takeUntil } from 'rxjs/operators';

import { Event }                   from 'src/app/models/event'
import { EventModalBaseDirective } from '../common/event-modal-base.directive';
import { CalendarFacade } from 'src/app/store/calendar/calendar.facade';
import { UpdatedEvent } from 'src/app/models/updated-event';
import * as dayjs from 'dayjs';
import { ConfirmDeleteComponent, ConfirmDeleteResult } from '../../confirm-delete/confirm-delete.component';

export type EventEditDialogData = {
  event: Event,
}

export type EventEditFormData = {
  title: string,
  startDate: string,
  startTime: string,
  endDate: string,
  endTime: string,
  isAllDay: boolean,
}

@Component({
  templateUrl: './event-edit.component.html',
  styleUrls: ['../common/event-modal-base.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventEditComponent extends EventModalBaseDirective implements OnInit {

  form: FormGroup<EventEditFormData>

  constructor(
    private calendarFacade: CalendarFacade,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<EventEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EventEditDialogData
  ) {
    super(dialogRef, calendarFacade.updateEventSuccess$)
    this.form = new FormGroup<EventEditFormData>({
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

    this.calendarFacade.deleteEventSuccess$.pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe(_ =>
      this.close()
    )
  }

  onSave(): void {
    const data: UpdatedEvent = {
      id: this.data.event.id,
      title: this.form.value.title,
      startTime: dayjs(
        this.form.value.startDate + this.form.value.startTime,
        'YYYY-MM-DD HH:mm'
      ),
      endTime: dayjs(
        this.form.value.endDate + this.form.value.endTime,
        'YYYY-MM-DD HH:mm'
      )
    }

    this.calendarFacade.updateEvent(data)
  }

  onDelete(): void {
    this.dialog.open(ConfirmDeleteComponent)
      .afterClosed()
      .pipe(
        map((result: ConfirmDeleteResult) => result.isDelete)
      )
      .subscribe((isDelete: boolean) => {
        if (isDelete) {
          this.calendarFacade.deleteEvent(this.data.event)
        }
      })
  }
}
