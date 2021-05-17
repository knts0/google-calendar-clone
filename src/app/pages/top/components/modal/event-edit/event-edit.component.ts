import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup } from '@ngneat/reactive-forms';
import { map, takeUntil } from 'rxjs/operators';

import { Event } from 'src/app/models/event'
import { EventModalBaseDirective } from '../common/event-modal-base.directive';
import { CalendarFacade } from 'src/app/store/calendar/calendar.facade';
import { UpdatedEvent } from 'src/app/models/updated-event';
import { ConfirmDeleteComponent, ConfirmDeleteResult } from '../../confirm-delete/confirm-delete.component';
import { FormData, EventEditPresenter } from './event-edit.presenter';

export type EventEditDialogData = {
  event: Event,
}

@Component({
  templateUrl: './event-edit.component.html',
  styleUrls: ['../common/event-modal-base.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [EventEditPresenter],
})
export class EventEditComponent extends EventModalBaseDirective implements OnInit {

  get form(): FormGroup<FormData> {
    return this.presenter.form
  }

  constructor(
    private calendarFacade: CalendarFacade,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<EventEditComponent>,
    private presenter: EventEditPresenter,
    @Inject(MAT_DIALOG_DATA) public data: EventEditDialogData
  ) {
    super(dialogRef, calendarFacade.updateEventSuccess$)
  }

  ngOnInit(): void {
    super.ngOnInit()

    this.presenter.init(this.data.event)

    this.presenter.update$.subscribe((updatedEvent: UpdatedEvent) => {
      this.calendarFacade.updateEvent(updatedEvent)
    })

    this.calendarFacade.deleteEventSuccess$.pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe(_ =>
      this.close()
    )
  }

  onSave(): void {
    this.presenter.updateEvent()
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
