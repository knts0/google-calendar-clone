import { Component, Input, OnInit } from '@angular/core';
import { EventEmitter, Output }     from '@angular/core';
import * as dayjs                   from 'dayjs'
import { Emitter, Emittable }       from '@ngxs-labs/emitter';

import { CalendarState } from '../state/calendar.state';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Input() activeDate: dayjs.Dayjs

  @Emitter(CalendarState.setActiveDateToToday)
  private setActiveDateToTodayEmitter: Emittable<void>

  @Output() onPrevClicked: EventEmitter<void> = new EventEmitter()
  @Output() onNextClicked: EventEmitter<void> = new EventEmitter()

  constructor() { }

  ngOnInit(): void {
  }

  onClickTodayButton(): void {
    this.setActiveDateToTodayEmitter.emit()
  }

  onClickPrevButton(): void {
    this.onPrevClicked.emit()
  }

  onClickNextButton(): void {
    this.onNextClicked.emit()
  }
}
