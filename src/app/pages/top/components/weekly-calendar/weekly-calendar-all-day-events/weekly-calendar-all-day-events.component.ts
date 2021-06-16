import {
  Component,
  Input,
  OnInit
} from '@angular/core'
import { MatDialog } from '@angular/material/dialog'

import { EventEditComponent } from '../../modal/event-edit/event-edit.component'
import { AllDayEventRow }     from '../weekly-calendar.presenter'

@Component({
  selector: 'app-weekly-calendar-all-day-events',
  templateUrl: './weekly-calendar-all-day-events.component.html',
  styleUrls: ['./weekly-calendar-all-day-events.component.scss']
})
export class WeeklyCalendarAllDayEventsComponent implements OnInit {

  @Input() allDayEventRows: AllDayEventRow[]

  constructor(
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
  }

  onClickEvent(event: Event) {
    this.openEventEditDialog(event)
  }

  private openEventEditDialog(event: Event): void {
    this.dialog.open(EventEditComponent, {
      data: {
        event: event,
      },
      panelClass: 'dialog-overlay',
    })
  }

}
