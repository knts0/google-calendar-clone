import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'

import { Event } from 'src/app/models/event'
import { getOrderOfWeek } from 'src/app/util/date'
import { EventPreview, HEIGHT_PX_PER_HOUR, WIDTH_PX_PER_DAY } from '../weekly-calendar.presenter'


@Component({
  selector: 'app-event-preview',
  templateUrl: './event-preview.component.html',
  styleUrls: ['./event-preview.component.scss']
})
export class EventPreviewComponent implements OnInit {

  @Input() eventPreview: EventPreview

  @Output() mouseMove = new EventEmitter<any>();
  @Output() mouseUp = new EventEmitter<void>();

  constructor() { }

  ngOnInit(): void {
  }

  _originalEventStyle(event: Event): { top: string, height: string, left: string } {
    // calc preview event position
    const top    = event.startTime.hour() * HEIGHT_PX_PER_HOUR
    const bottom = event.endTime.hour() * HEIGHT_PX_PER_HOUR

    const orderOfWeek = getOrderOfWeek(event.startTime)
    const left        = orderOfWeek * WIDTH_PX_PER_DAY

    return {
      top:    `${top}px`,
      height: `${bottom - top}px`,
      left:   `${left}px`,
    }
  }

  onMouseMove(event): void {
    this.mouseMove.emit(event)
  }

  onMouseUp(): void {
    this.mouseUp.emit()
  }

}
