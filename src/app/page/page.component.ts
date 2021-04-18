import { Component, OnInit } from '@angular/core';
import * as dayjs            from 'dayjs';

import { Event }             from '../models/event';

export type CalendarViewMode = 'month' | 'week'

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss']
})
export class PageComponent implements OnInit {

  activeDate: dayjs.Dayjs = dayjs().startOf('day')

  calendarViewMode: CalendarViewMode = 'week'

  constructor() { }

  ngOnInit(): void {
  }

  onChangeActiveDate(date: dayjs.Dayjs) {
    this.activeDate = date
  }

  changeActiveDatePrev(): void {
    switch (this.calendarViewMode) {
      case 'week': this.activeDate = this.activeDate.subtract(1, 'week')
    }
  }

  changeActiveDateNext(): void {
    switch (this.calendarViewMode) {
      case 'week': this.activeDate = this.activeDate.add(1, 'week')
    }
  }

  changeActiveDateToToday(): void {
    this.activeDate = dayjs().startOf('day')
  }
}
