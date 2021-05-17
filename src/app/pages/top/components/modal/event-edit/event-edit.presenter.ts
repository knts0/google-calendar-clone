import { Injectable, OnDestroy } from '@angular/core';
import { ValidationErrors } from '@angular/forms';
import * as dayjs from 'dayjs';
import { FormControl, FormGroup } from '@ngneat/reactive-forms';
import { Observable, Subject } from 'rxjs';

import { Event } from 'src/app/models/event';
import { UpdatedEvent } from 'src/app/models/updated-event';

export type FormData = {
  title: string,
  startDate: string,
  startTime: string,
  endDate: string,
  endTime: string,
  isAllDay: boolean,
}

type FormGroupWithDateTime = {
  startDate: string,
  startTime: string,
  endDate: string,
  endTime: string,
}

@Injectable()
export class EventEditPresenter implements OnDestroy {

  form: FormGroup<FormData> =
    new FormGroup<FormData>({
      title: new FormControl(),
      startDate: new FormControl(),
      startTime: new FormControl(),
      endDate: new FormControl(),
      endTime: new FormControl(),
      isAllDay: new FormControl(),
    }, { validators: this.dateTimeValidator }
  )

  dateTimeValidator(formGroup: FormGroup<FormGroupWithDateTime>): ValidationErrors | null {
    const startDateTime = dayjs(
      formGroup.value.startDate + formGroup.value.startTime,
      'YYYY-MM-DD HH:mm'
    )
    const endDateTime = dayjs(
      formGroup.value.endDate + formGroup.value.endTime,
      'YYYY-MM-DD HH:mm'
    )

    if (startDateTime.isAfter(endDateTime)) {
      return { inValidDateTime: true }
    }
    return null
  }

  private eventId: string
  private subject: Subject<UpdatedEvent> = new Subject()

  constructor() {}

  ngOnDestroy(): void {
    this.subject.complete()
  }

  get update$(): Observable<UpdatedEvent> {
    return this.subject.asObservable()
  }

  init(event: Event): void {
    this.eventId = event.id

    this.form.setValue({
      title: event.title,
      startDate: event.startTime.format('YYYY-MM-DD'),
      startTime: event.startTime.format('HH:mm'),
      endDate: event.endTime.format('YYYY-MM-DD'),
      endTime: event.endTime.format('HH:mm'),
      isAllDay: false,
    })
  }

  updateEvent(): void {
    const data: UpdatedEvent = {
      id: this.eventId,
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

    this.subject.next(data)
  }
}
