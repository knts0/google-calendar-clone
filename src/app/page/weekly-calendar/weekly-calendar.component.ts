import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog }                                      from '@angular/material/dialog';
import * as moment                                        from 'moment';

import { Event }                                          from '../../models/event';
import { EventEditComponent }                             from '../modal/event-edit/event-edit.component';

const DAYS_PER_WEEK = 7
const FIRST_DAY_OF_WEEK = 1

type DayItem = {
  day:     moment.Moment,
  weekday: string,
  events:  Event[]
}

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

  }
  _activeDate: moment.Moment

  @Input() events: Event[]

  hours = Array.from({ length: 24 }, (v, i) => i )
  weekdays = [ '月', '火', '水', '木', '金', '土', '日' ]
  days: DayItem[] = []

  constructor(
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this._initDays()
  }

  _initDays(): void {
    this.days = []

    for (let dayOfWeek = 0; dayOfWeek < DAYS_PER_WEEK; dayOfWeek++) {
      const activeDateClone = this._activeDate.clone()
      const day = activeDateClone.weekday(dayOfWeek + FIRST_DAY_OF_WEEK)
      this.days.push({
        day:     day,
        weekday: this.weekdays[dayOfWeek],
        events:  this.events.filter(v => {
          return v.startTime.isSame(day, 'day') || v.endTime.isSame(day, 'day')
        })
      })
    }
  }

  getStyleOfEvent(event: Event) {
    const top    = 60 * event.startTime.hour() + 15 * event.startTime.minute() / 15
    const bottom = 60 * event.endTime.hour() + 15 * event.endTime.minute() / 15

    return {
      top:    `${top}px`,
      height: `${bottom - top}px`,
    }
  }

  onClickTimeFrame(dayItem: DayItem, hour: number) {
    this.dialog.open(EventEditComponent)
  }
}
