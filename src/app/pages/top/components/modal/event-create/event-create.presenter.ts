import { Injectable, OnDestroy }  from '@angular/core'
import * as dayjs                 from 'dayjs'
import { FormControl, FormGroup } from '@ngneat/reactive-forms'
import { Observable, Subject }    from 'rxjs'

import { NewEvent }          from 'src/app/models/new-event'
import { dateTimeValidator } from 'src/app/validators/date-time'

export type FormData = {
  title:     string
  startDate: string
  startTime: string
  endDate:   string
  endTime:   string
  isAllDay:  boolean
}

@Injectable()
export class EventCreatePresenter implements OnDestroy {

  form: FormGroup<FormData> =
    new FormGroup<FormData>(
      {
        title:     new FormControl(),
        startDate: new FormControl(),
        startTime: new FormControl(),
        endDate:   new FormControl(),
        endTime:   new FormControl(),
        isAllDay:  new FormControl(),
      }, { validators: dateTimeValidator }
  )

  private subject: Subject<NewEvent> = new Subject()

  constructor() {}

  ngOnDestroy(): void {
    this.subject.complete()
  }

  get create$(): Observable<NewEvent> {
    return this.subject.asObservable()
  }

  init(formData: FormData): void {
    this.form.setValue(formData)
  }

  createEvent(): void {
    if (this.form.valid) {
      const data: NewEvent = {
        title: this.form.value.title,
        startTime: dayjs(
          this.form.value.startDate + this.form.value.startTime,
          'YYYY-MM-DD HH:mm'
        ),
        endTime: dayjs(
          this.form.value.endDate + this.form.value.endTime,
          'YYYY-MM-DD HH:mm'
        ),
        isAllDay: this.form.value.isAllDay,
      }

      this.subject.next(data)
    }
  }

}
