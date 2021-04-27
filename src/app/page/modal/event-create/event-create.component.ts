import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA }           from '@angular/material/dialog';
import { FormControl, FormGroup }    from '@angular/forms';
import * as dayjs                    from 'dayjs';
import { APP_OVERLAY_DATA } from '../../weekly-calendar/weekly-calendar.component';
import { OverlayRef } from '@angular/cdk/overlay';

import {
  animate,
  state,
  style,
  transition,
  trigger,
  AnimationTriggerMetadata,
} from '@angular/animations';

import {AnimationCurves, AnimationDurations} from '@angular/material/core';

export type EventCreateDialogData = {
  start: dayjs.Dayjs,
  end: dayjs.Dayjs,
  isAllDay: boolean,
}

@Component({
  selector: 'app-event-create',
  templateUrl: './event-create.component.html',
  animations: [trigger(
    'state',
    [
      state('void, hidden', style({transform: 'translateY(100%)'})),
      state('visible', style({transform: 'translateY(0%)'})),
      transition('visible => void, visible => hidden',
          animate(`${AnimationDurations.COMPLEX} ${AnimationCurves.ACCELERATION_CURVE}`)),
      transition('void => visible',
          animate(`${AnimationDurations.EXITING} ${AnimationCurves.DECELERATION_CURVE}`)),
    ]
  )],
  styleUrls: [
    '../common/event-modal-base.scss',
    './event-create.component.scss'
  ]
})
export class EventCreateComponent implements OnInit {

  form: FormGroup

  constructor(
    private dialog: MatDialog,
    // @Inject(MAT_DIALOG_DATA) public data: EventCreateDialogData
    private overlayRef: OverlayRef,
    @Inject(APP_OVERLAY_DATA) public data: EventCreateDialogData,
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
    this.overlayRef.detach()

  }

}
