/**
 * リサイズ考慮しない
 * auto scrollなし
 * light dom false
 */

import { ChangeDetectorRef, Component, ElementRef, EventEmitter, OnInit, Output } from '@angular/core'
import { Carousel } from './carousel'
import { Rows } from './cells'
import { Container } from './container'
import { Properties as CarouselProperties } from './interfaces'
import { Slide } from './slide'
import { Utils } from './utils'

type NewType = EventEmitter<any>

@Component({
  selector: 'app-time-picker',
  templateUrl: './time-picker.component.html',
  styleUrls: ['./time-picker.component.scss']
})
export class TimePickerComponent implements OnInit {

  ROW_LENGTH = 24
  hours = Array.from(new Array(this.ROW_LENGTH).keys())

  @Output() events: EventEmitter<any> = new EventEmitter<any>()

  constructor(
    private elementRef: ElementRef,
  ) {
  }

  ngOnInit(): void {
  }

}
