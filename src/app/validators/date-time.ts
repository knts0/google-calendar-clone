import { ValidationErrors } from '@angular/forms';
import * as dayjs from 'dayjs';
import { FormGroup } from '@ngneat/reactive-forms';

type FormGroupWithDateTime = {
  startDate: string,
  startTime: string,
  endDate: string,
  endTime: string,
}

export function dateTimeValidator(formGroup: FormGroup<FormGroupWithDateTime>): ValidationErrors | null {
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
