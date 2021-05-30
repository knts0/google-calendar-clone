import { Output } from '@angular/core'
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit } from '@angular/core'
import { MatDialog }                from '@angular/material/dialog'
import * as dayjs                   from 'dayjs'
import * as duration                from 'dayjs/plugin/duration'
import { merge, Observable, Subject } from 'rxjs'
import { filter, map, scan, share, takeUntil, tap, withLatestFrom } from 'rxjs/operators'
import { UpdatedEvent } from 'src/app/models/updated-event'
import { DAYS_PER_WEEK, FIRST_DAY_OF_WEEK, getFirstDayOfWeek } from 'src/app/util/date'

import { Event }                from '../../../../models/event'
import { EventCreateComponent } from '../modal/event-create/event-create.component'
import { EventEditComponent }   from '../modal/event-edit/event-edit.component'


const HEIGHT_PX_PER_HOUR = 60

type EventItem = {
  event: Event
  style: {
    top: string
    height: string
  }
}

type DayItem = {
  day:        dayjs.Dayjs
  weekday:    string
}

type EventPreview ={
  originalEvent?: Event,
  startTime: dayjs.Dayjs
  endTime: dayjs.Dayjs
  style: {
    top:    string
    height: string
    left:   string
    width:  string
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

  @Input() today: dayjs.Dayjs

  @Input()
  set events(events: Event[]) {
    this._initDays(events)
  }

  @Output() eventUpdated = new EventEmitter<UpdatedEvent>();

  _activeDate: dayjs.Dayjs

  hours = Array.from({ length: 24 }, (v, i) => i )
  weekdays = [ '月', '火', '水', '木', '金', '土', '日' ]
  days: DayItem[] = []

  eventItems: EventItem[]

  // event preview
  _eventPreviewStart = new Subject<{ startTime: dayjs.Dayjs, endTime: dayjs.Dayjs, originalEvent?: Event }>()
  _mouseMove = new Subject<{ offsetY: number }>()
  _mouseUp = new Subject<void>()
  _isShowEventPreview: boolean = false
  _eventPreview$: Observable<EventPreview>

  _newEvent = new Subject<EventPreview | null>()

  private readonly onDestroy$ = new EventEmitter();

  constructor(
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this._eventPreview$ = merge(
      this._eventPreviewStart.pipe(
        tap(_ => this._isShowEventPreview = true),
        map(mouseDown => { return {
          originalEvent: mouseDown.originalEvent,
          startTime: mouseDown.startTime,
          endTime: mouseDown.endTime,
          style: this.calcEventStyle(mouseDown.startTime, mouseDown.endTime)
        }})
      ),
      this._mouseMove.pipe(
        filter(_ => this._isShowEventPreview),
        withLatestFrom(this._eventPreviewStart),
        map(([mouseMove, mouseDown]) => { return {
          ...this.eventPreview(mouseDown.startTime, mouseDown.endTime, mouseMove.offsetY),
          originalEvent: mouseDown.originalEvent,
        }}),
      )
    )

    this._mouseUp.pipe(
      filter(_ => this._isShowEventPreview),
      takeUntil(this.onDestroy$),
      withLatestFrom(this._eventPreviewStart, this._eventPreview$)
    ).subscribe(([_, eventMouseDown, newEventPreview]) => {
      this._isShowEventPreview = false

      this._newEvent.next({
        startTime: newEventPreview.startTime,
        endTime: newEventPreview.endTime,
        style: this.calcEventStyle(newEventPreview.startTime, newEventPreview.endTime),
      })

      if (eventMouseDown.originalEvent != null) {
        const data: UpdatedEvent = {
          id: eventMouseDown.originalEvent.id,
          title: eventMouseDown.originalEvent.title,
          startTime: newEventPreview.startTime,
          endTime: newEventPreview.endTime,
        }
        this.eventUpdated.emit(data)

        this._newEvent.next(null)
      } else {
        this.openEventEditDialog(newEventPreview.startTime, newEventPreview.endTime)
      }
    })
  }

  private eventPreview(startTimeWhenMouseDown: dayjs.Dayjs, endTimeWhenMouseDown: dayjs.Dayjs, newOffsetY: number): EventPreview {
    const startTimeWhenMouseDownOffsetY = startTimeWhenMouseDown.hour() * HEIGHT_PX_PER_HOUR

    // mouse move (up): only change start time
    if (startTimeWhenMouseDownOffsetY >= newOffsetY) {
      // new start time of event (round down mouse move position)
      const startTime = startTimeWhenMouseDown.hour(Math.floor(newOffsetY / HEIGHT_PX_PER_HOUR))
      const endTime = startTimeWhenMouseDown.add(1, 'hour')
      return {
        startTime: startTime,
        endTime: endTime,
        style: this.calcEventStyle(startTime, endTime),
      }

    // mouse move (down): only change end time
    } else {
      const startTime = startTimeWhenMouseDown
      // new end time of event (round up mouse move position)
      const endTime = endTimeWhenMouseDown.hour(Math.ceil(newOffsetY / HEIGHT_PX_PER_HOUR))
      return {
        startTime: startTime,
        endTime: endTime,
        style: this.calcEventStyle(startTime, endTime),
      }
    }
  }

  private calcEventStyle(startTime: dayjs.Dayjs, endTime: dayjs.Dayjs): { top: string, height: string, left: string, width: string } {
    // calc preview event position
    const top    = startTime.hour() * HEIGHT_PX_PER_HOUR
    const bottom = endTime.hour() * HEIGHT_PX_PER_HOUR

    const orderOfWeek = (startTime.day() + DAYS_PER_WEEK - FIRST_DAY_OF_WEEK) % DAYS_PER_WEEK
    const left   = 50 + orderOfWeek * 100

    return {
      top:    `${top}px`,
      height: `${bottom - top}px`,
      left:   `${left}px`,
      width:  `100px`,
    }
  }

  ngOnDestroy() {
    this.onDestroy$.emit();
  }

  private _initDays(events: Event[]): void {
    this.eventItems = events.map(e => {
      return {
        event: e,
        style: this.calcEventStyle(e.startTime, e.endTime),
      }
    })

    this.days = []

    const firstDayOfWeek = getFirstDayOfWeek(this._activeDate)

    for (let dayOfWeek = 0; dayOfWeek < DAYS_PER_WEEK; dayOfWeek++) {
      const day = firstDayOfWeek.day(dayOfWeek + FIRST_DAY_OF_WEEK)
      this.days.push({
        day:        day,
        weekday:    this.weekdays[dayOfWeek],
      })
    }
  }

  getTopOfTimelineFrame(hour: number): number {
    return hour * HEIGHT_PX_PER_HOUR
  }

  onMouseDown(event, dayItem: DayItem, hour: number): void {
    this._eventPreviewStart.next({
      startTime: dayItem.day.hour(hour),
      endTime: dayItem.day.hour(hour + 1),
    })

    event.stopImmediatePropagation()
  }

  onMouseMove(event): void {
    this._mouseMove.next({ offsetY: event.offsetY })
  }

  onMouseUp(): void {
    this._mouseUp.next()
  }

  onMouseDownOnResizable(event, targetEvent: Event): void {
    this._eventPreviewStart.next({
      startTime: targetEvent.startTime,
      endTime: targetEvent.endTime,
      originalEvent: targetEvent,
    })

    event.stopImmediatePropagation()
  }

  onClickEvent(event: Event): void {
    this.dialog.open(EventEditComponent, {
      data: {
        event: event,
      }
    })
  }

  private openEventEditDialog(startTime: dayjs.Dayjs, endTime: dayjs.Dayjs): void {
    dayjs.extend(duration)

    const data = {
      start: startTime,
      end: endTime,
      isAllDay: false,
    }

    this.dialog.open(EventCreateComponent, {
      panelClass: 'transition',
      data: data,
    }).afterClosed().subscribe( _ => {
      this._newEvent.next(null)
    })
  }

}
