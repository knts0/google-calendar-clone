import { Directive, OnDestroy, OnInit } from '@angular/core'
import { MatDialogRef } from '@angular/material/dialog'
import { Observable, Subject }   from 'rxjs'
import { takeUntil } from 'rxjs/operators'

@Directive({
  selector: '[appEventModalBase]'
})
export class EventModalBaseDirective implements OnInit, OnDestroy {

  unsubscribe$: Subject<any> = new Subject()

  constructor(
    private dialogRefBaseDirective: MatDialogRef<EventModalBaseDirective>,
    private submitSuccess$: Observable<unknown>,
  ) { }

  ngOnInit(): void {
    this.submitSuccess$.pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe(_ =>
      this.close()
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
