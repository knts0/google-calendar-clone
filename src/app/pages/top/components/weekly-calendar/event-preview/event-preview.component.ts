import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core'
import * as dayjs from 'dayjs'

import { CalcStyle }    from '../shared/calc-event-style'
import { EventPreview } from '../weekly-calendar.presenter'


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

  calcEventStyle(startTime: dayjs.Dayjs, endTime: dayjs.Dayjs): { top: string, height: string, left: string } {
    return CalcStyle.calcEventStyle(startTime, endTime)
  }

  onMouseMove(event): void {
    this.mouseMove.emit(event)
  }

  onMouseUp(): void {
    this.mouseUp.emit()
  }

}
