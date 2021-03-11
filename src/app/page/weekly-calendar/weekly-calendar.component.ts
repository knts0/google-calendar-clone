import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as moment                                        from 'moment';

const DAYS_PER_WEEK = 7
const FIRST_DAY_OF_WEEK = 1

@Component({
  selector: 'app-weekly-calendar',
  templateUrl: './weekly-calendar.component.html',
  styleUrls: ['./weekly-calendar.component.scss']
})
export class WeeklyCalendarComponent implements OnInit {

  @Input()
  get activeDate(): moment.Moment {
    return this._activeDate
  }
  set activeDate(date: moment.Moment) {
    // this._today = moment()

    this._activeDate = date

    this._initDays()
  }
  _activeDate: moment.Moment

  hours = Array.from({ length: 24 }, (v, i) => i )
  weekdays = [ '月', '火', '水', '木', '金', '土', '日' ]
  days: { day: moment.Moment, weekday: string }[] = []

  constructor() { }

  ngOnInit(): void {
  }

  _initDays(): void {
    this.days = []

    for (let dayOfWeek = 0; dayOfWeek < DAYS_PER_WEEK; dayOfWeek++) {
      const activeDateClone = this._activeDate.clone()
      this.days.push({
        day:     activeDateClone.weekday(dayOfWeek + FIRST_DAY_OF_WEEK),
        weekday: this.weekdays[dayOfWeek]
      })
    }
  }
}
