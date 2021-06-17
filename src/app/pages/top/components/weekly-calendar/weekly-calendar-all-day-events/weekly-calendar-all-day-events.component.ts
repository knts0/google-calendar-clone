import {
  Component,
  Input,
  OnInit
} from '@angular/core'
import { MatDialog } from '@angular/material/dialog'

import { Event }              from 'src/app/models/event'
import { EventEditComponent } from '../../modal/event-edit/event-edit.component'
import { CalcStyle }          from '../shared/calc-event-style'
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

  calcAllDayEventStyle(event: Event): { left: string, width: string } {
    return CalcStyle.calcAllDayEventStyle(event.startTime, event.endTime)
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
