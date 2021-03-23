import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog }                                      from '@angular/material/dialog';
import * as dayjs                                         from 'dayjs';
import * as duration                                      from 'dayjs/plugin/duration';

import { Event }                                          from '../../models/event';
import { EventEditComponent }                             from '../modal/event-edit/event-edit.component';

const DAYS_PER_WEEK = 7
const FIRST_DAY_OF_WEEK = 1

type DayItem = {
  day:     dayjs.Dayjs,
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
  get activeDate(): dayjs.Dayjs {
    return this._activeDate
  }
  set activeDate(date: dayjs.Dayjs) {
    // this._today = dayjs()

    this._activeDate = date

  }
  _activeDate: dayjs.Dayjs

  @Input() events: Event[]

  hours = Array.from({ length: 24 }, (v, i) => i )
  weekdays = [ '月', '火', '水', '木', '金', '土', '日' ]
  days: DayItem[] = []

  isMovingMouse = false
  startHour: number | null =  null

  constructor(
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this._initDays()
  }

  _initDays(): void {
    this.days = []

    for (let dayOfWeek = 0; dayOfWeek < DAYS_PER_WEEK; dayOfWeek++) {
      const day = this._activeDate.day(dayOfWeek + FIRST_DAY_OF_WEEK)
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
    this.openEventEditDialog(dayItem.day, hour, hour + 1)
  }

  // https://developer.mozilla.org/ja/docs/Web/API/Element/mouseup_event
  onMouseDown(hour): void {
    this.isMovingMouse = true
    this.startHour = hour
  }

  onMouseUp(dayItem: DayItem, hour: number): void {
    this.isMovingMouse = false
    this.openEventEditDialog(dayItem.day, this.startHour, hour)

    this.startHour = null
  }

  openEventEditDialog(date: dayjs.Dayjs, startHour: number, endHour: number): void {
    dayjs.extend(duration)
    this.dialog.open(EventEditComponent, {
      data: {
        date: date,
        startTime: dayjs.duration(startHour, 'hours'),
        endTime: dayjs.duration(endHour, 'hours'),
        isAllDay: false,
      }
    })
  }
}
