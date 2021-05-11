import { Directive }    from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Observable, Subject }   from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Directive({
  selector: '[appEventModalBase]'
})
export class EventModalBaseDirective {

  constructor(
    private dialogRefBaseDirective: MatDialogRef<EventModalBaseDirective>,
    private submitSuccess$: Observable<void>,
  ) { }

  unsubscribe$: Subject<any> = new Subject()

  ngOnInit(): void {
    this.submitSuccess$.pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe(_ =>
      close()
    )
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next()
    this.unsubscribe$.complete()
  }

  close(): void {
    this.dialogRefBaseDirective.close()
  }

}
