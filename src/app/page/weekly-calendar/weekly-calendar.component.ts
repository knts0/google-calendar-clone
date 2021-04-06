import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog }                                      from '@angular/material/dialog';
import * as dayjs                                         from 'dayjs';
import * as duration                                      from 'dayjs/plugin/duration';

import { Event }                                          from '../../models/event';
import { EventEditComponent }                             from '../modal/event-edit/event-edit.component';

const DAYS_PER_WEEK = 7
const FIRST_DAY_OF_WEEK = 1

const HEIGHT_PX_PER_HOUR = 60

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
  initialStartHour: number | null =  null
  endHour: number | null =  null

  newEventPreview:
    {
      day: dayjs.Dayjs,
      style: {
        top:    number,
        height: number,
      },
    } | null = null

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
    const top    = HEIGHT_PX_PER_HOUR * event.startTime.hour() + 15 * event.startTime.minute() / 15
    const bottom = HEIGHT_PX_PER_HOUR * event.endTime.hour() + 15 * event.endTime.minute() / 15

    return {
      top:    top,
      height: bottom - top,
    }
  }

  onClickTimeFrame(dayItem: DayItem, hour: number) {
    this.openEventEditDialog(dayItem.day, hour, hour + 1)
  }

  // https://developer.mozilla.org/ja/docs/Web/API/Element/mouseup_event
  onMouseDown(event, dayItem: DayItem): void {
    // set start hour of event(round down mouse down position)
    this.startHour = Math.floor(event.offsetY / HEIGHT_PX_PER_HOUR)
    this.endHour   = this.startHour + 1
    this.initialStartHour = this.startHour

    // calc preview event position
    const top    = this.startHour * HEIGHT_PX_PER_HOUR
    const bottom = top + HEIGHT_PX_PER_HOUR

    this.newEventPreview= {
      day: dayItem.day,
      style: {
        top:    top,
        height: bottom - top,
      }
    }

    event.stopImmediatePropagation()
    this.isMovingMouse = true
  }

  onMouseUp(event, dayItem: DayItem): void {
    this.openEventEditDialog(dayItem.day, this.startHour, this.endHour)

    // reset
    this.isMovingMouse = false
    this.startHour = null
  }

  onMouseMove(event): void {
    if (this.isMovingMouse && this.newEventPreview != null) {
      // mouse move (down)
      if (this.initialStartHour * HEIGHT_PX_PER_HOUR < event.offsetY) {
        // update end hour of event (round up mouse move position)
        const endHour = Math.ceil(event.offsetY / HEIGHT_PX_PER_HOUR)
        this.endHour = endHour

      // mouse move (up)
      } else {
        // update start hour of event (round down mouse move position)
        const newStartHour = Math.floor(event.offsetY / HEIGHT_PX_PER_HOUR)
        this.startHour = newStartHour
      }

      // calc preview event position
      const top = this.startHour * HEIGHT_PX_PER_HOUR
      const bottom = this.endHour * HEIGHT_PX_PER_HOUR

      // update event preview style
      this.newEventPreview.style = {
        top:    top,
        height: bottom - top,
      }
    }
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
    }).afterClosed().subscribe( _ => {
      this.newEventPreview = null
    })
  }
}
