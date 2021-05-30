import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import * as dayjs from 'dayjs'

import { Event } from 'src/app/models/event'

export type EventPreview ={
  originalEvent?: Event,
  startTime: dayjs.Dayjs
  endTime: dayjs.Dayjs
  style: {
    top:    string
    height: string
    left:   string
  }
}

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

  onMouseMove(event): void {
    this.mouseMove.emit(event)
  }

  onMouseUp(): void {
    this.mouseUp.emit()
  }

}
