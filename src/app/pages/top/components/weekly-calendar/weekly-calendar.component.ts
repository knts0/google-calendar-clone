import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core'
import { MatDialog }                from '@angular/material/dialog'
import * as dayjs                   from 'dayjs'
import * as duration                from 'dayjs/plugin/duration'
import { DAYS_PER_WEEK, FIRST_DAY_OF_WEEK, getFirstDayOfWeek } from 'src/app/util/date'

import { Event }                from '../../../../models/event'
import { EventCreateComponent } from '../modal/event-create/event-create.component'
import { EventEditComponent }   from '../modal/event-edit/event-edit.component'


const HEIGHT_PX_PER_HOUR = 60

type DayItem = {
  day:        dayjs.Dayjs
  weekday:    string
  eventItems: EventItem[]
}

type EventItem = {
  event: Event
  style: {
    top: string
    height: string
  }
}

@Component({
  selector: 'app-weekly-calendar',
  templateUrl: './weekly-calendar.component.html',
  styleUrls: ['./weekly-calendar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WeeklyCalendarComponent implements OnInit {

  @Input()
  get activeDate(): dayjs.Dayjs {
    return this._activeDate
  }
  set activeDate(date: dayjs.Dayjs) {
    this._activeDate = date
  }
  _activeDate: dayjs.Dayjs

  @Input() today: dayjs.Dayjs

  @Input()
  set events(events: Event[]) {
    this._initDays(events)
  }

  _eventItems: EventItem[]

  hours = Array.from({ length: 24 }, (v, i) => i )
  weekdays = [ '月', '火', '水', '木', '金', '土', '日' ]
  days: DayItem[] = []

  isMovingMouse = false
  startHour: number | null =  null
  initialStartHour: number | null =  null
  endHour: number | null =  null

  newEventPreview:
    {
      day: dayjs.Dayjs
      style: {
        top:    number
        height: number
      }
    } | null = null

  constructor(
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
  }

  _initDays(events: Event[]): void {
    this._eventItems = events.map(e => {
      const top    = HEIGHT_PX_PER_HOUR * e.startTime.hour()
      const bottom = HEIGHT_PX_PER_HOUR * e.endTime.hour()

      return {
        event: e,
        style: {
          top:    `${top}px`,
          height: `${bottom - top}px`,
        }
      }
    })

    this.days = []

    const firstDayOfWeek = getFirstDayOfWeek(this._activeDate)

    for (let dayOfWeek = 0; dayOfWeek < DAYS_PER_WEEK; dayOfWeek++) {
      const day = firstDayOfWeek.day(dayOfWeek + FIRST_DAY_OF_WEEK)
      this.days.push({
        day:        day,
        weekday:    this.weekdays[dayOfWeek],
        eventItems: this._eventItems.filter(v => v.event.startTime.isSame(day, 'day') || v.event.endTime.isSame(day, 'day'))
      })
    }
  }

  getTopOfTimelineFrame(hour: number): number {
    return hour * HEIGHT_PX_PER_HOUR
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

  onClickEvent(event: Event): void {
    this.dialog.open(EventEditComponent, {
      data: {
        event: event,
      }
    })
  }

  openEventEditDialog(date: dayjs.Dayjs, startHour: number, endHour: number): void {
    dayjs.extend(duration)

    const data = {
      start: date.hour(startHour),
      end: date.hour(endHour),
      isAllDay: false,
    }

    this.dialog.open(EventCreateComponent, {
      panelClass: 'transition',
      data: data,
    }).afterClosed().subscribe( _ => {
      this.newEventPreview = null
      this.startHour = null
      this.initialStartHour = null
      this.endHour = null
    })
  }
}
