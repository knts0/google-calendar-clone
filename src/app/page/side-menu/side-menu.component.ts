import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as dayjs                                         from 'dayjs';
import { Emitter, Emittable }                             from '@ngxs-labs/emitter';

import { CalendarState } from '../state/calendar.state';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss']
})
export class SideMenuComponent implements OnInit {

  @Input() activeDate: dayjs.Dayjs

  @Emitter(CalendarState.setActiveDate)
  private setActiveDateEmitter: Emittable<dayjs.Dayjs>

  constructor() { }

  ngOnInit(): void {
  }

  onChangeActiveDate(date: dayjs.Dayjs) {
    this.setActiveDateEmitter.emit(date)
  }
}
