import { Output } from '@angular/core'
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit } from '@angular/core'
import { MatDialog }                from '@angular/material/dialog'
import * as dayjs                   from 'dayjs'
import * as duration                from 'dayjs/plugin/duration'
import { merge, Observable, Subject } from 'rxjs'
import { filter, map, share, takeUntil, tap, withLatestFrom } from 'rxjs/operators'
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
  eventItems: EventItem[]
}

type ResizingEvent ={
  event: Event,
  startTime: dayjs.Dayjs
  endTime: dayjs.Dayjs
  style: {
    top:    string
    height: string
  }
}

type EventPreview ={
  startTime: dayjs.Dayjs
  endTime: dayjs.Dayjs
  style: {
    top:    string
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

  _eventMouseDown = new Subject<{ startTime: dayjs.Dayjs, endTime: dayjs.Dayjs }>()
  _eventMouseMove = new Subject<{ offsetY: number }>()
  _eventMouseUp = new Subject<void>()

  _resizingEvent$: Observable<ResizingEvent>
  _isResizingEvent: boolean = false
  _eventMouseDownOnEvent = new Subject<{ event: Event }>()
  _eventMouseOutOnEvent = new Subject<{ event: Event }>()

  _isShowNewEventPreview: boolean = false
  _newEventPreview$: Observable<EventPreview>

  private readonly onDestroy$ = new EventEmitter();

  constructor(
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this._eventMouseOutOnEvent.pipe(
      takeUntil(this.onDestroy$),
      withLatestFrom(this._eventMouseDownOnEvent),
    ).subscribe(_ => this._isResizingEvent = true)

    this._resizingEvent$ = this._eventMouseMove.pipe(
      filter(_ => this._isResizingEvent),
      withLatestFrom(this._eventMouseOutOnEvent),
      map(([mouseMove, mouseOut]) =>
        this.event(mouseOut.event, mouseMove.offsetY)
      ),
    )

    this._newEventPreview$ = merge(
      // mouse down event
      this._eventMouseDown.pipe(
        map(mouseDown => { return {
          startTime: mouseDown.startTime,
          endTime: mouseDown.endTime,
          style: this.calcNewEventPreviewStyle(mouseDown.startTime, mouseDown.endTime)
        }})
      ),
      this._eventMouseMove.pipe(
        filter(_ => this._isShowNewEventPreview),
        withLatestFrom(this._eventMouseDown),
        map(([mouseMove, mouseDown]) =>
          this.eventPreview(mouseDown.startTime, mouseDown.endTime, mouseMove.offsetY)
        ),
      )
    )

    this._eventMouseUp.pipe(
      filter(_ => this._isShowNewEventPreview),
      takeUntil(this.onDestroy$),
      withLatestFrom(this._newEventPreview$)
    ).subscribe(([_, { startTime, endTime }]) => {
      this.openEventEditDialog(startTime, endTime)}
    )

    this._eventMouseUp.pipe(
      filter(_ => this._isResizingEvent),
      takeUntil(this.onDestroy$),
      withLatestFrom(this._resizingEvent$)
    ).subscribe(([_, resizingEvent]) => {
      this._isResizingEvent = false

      const data: UpdatedEvent = {
        id: resizingEvent.event.id,
        title: resizingEvent.event.title,
        startTime: resizingEvent.startTime,
        endTime: resizingEvent.endTime,
      }
      this.eventUpdated.emit(data)
    })
  }

  private calcNewEventPreviewStyle(startTime: dayjs.Dayjs, endTime: dayjs.Dayjs): { top: string, height: string } {
    // calc preview event position
    const top    = startTime.hour() * HEIGHT_PX_PER_HOUR
    const bottom = endTime.hour() * HEIGHT_PX_PER_HOUR

    return {
      top:    `${top}px`,
      height: `${bottom - top}px`,
    }
  }

  private event(event: Event, newOffsetY: number): ResizingEvent {
    // mouse move (up&down): only change end time
    // new start time of event (round down mouse move position)
    const startTime = event.startTime
    const endTime = event.endTime.hour(Math.ceil(newOffsetY / HEIGHT_PX_PER_HOUR))
    return {
      event: event,
      startTime: startTime,
      endTime: endTime,
      style: this.calcNewEventPreviewStyle(startTime, endTime),
    }
  }

  private eventPreview(startTimeWhenMouseDown: dayjs.Dayjs, endTimeWhenMouseDown: dayjs.Dayjs, newOffsetY: number): EventPreview {
    const startTimeWhenMouseDownOffsetY = startTimeWhenMouseDown.hour() * HEIGHT_PX_PER_HOUR

    // mouse move (up): only change start time
    if (startTimeWhenMouseDownOffsetY >= newOffsetY) {
      // new start time of event (round down mouse move position)
      const startTime = startTimeWhenMouseDown.hour(Math.floor(newOffsetY / HEIGHT_PX_PER_HOUR))
      const endTime = endTimeWhenMouseDown
      return {
        startTime: startTime,
        endTime: endTime,
        style: this.calcNewEventPreviewStyle(startTime, endTime),
      }

    // mouse move (down): only change end time
    } else {
      const startTime = startTimeWhenMouseDown
      // new end time of event (round up mouse move position)
      const endTime = endTimeWhenMouseDown.hour(Math.ceil(newOffsetY / HEIGHT_PX_PER_HOUR))
      return {
        startTime: startTime,
        endTime: endTime,
        style: this.calcNewEventPreviewStyle(startTime, endTime),
      }
    }
  }

  ngOnDestroy() {
    this.onDestroy$.emit();
  }

  private _initDays(events: Event[]): void {
    const eventItems = events.map(e => {
      return {
        event: e,
        style: this.calcNewEventPreviewStyle(e.startTime, e.endTime),
      }
    })

    this.days = []

    const firstDayOfWeek = getFirstDayOfWeek(this._activeDate)

    for (let dayOfWeek = 0; dayOfWeek < DAYS_PER_WEEK; dayOfWeek++) {
      const day = firstDayOfWeek.day(dayOfWeek + FIRST_DAY_OF_WEEK)
      this.days.push({
        day:        day,
        weekday:    this.weekdays[dayOfWeek],
        eventItems: eventItems.filter(v => v.event.startTime.isSame(day, 'day') || v.event.endTime.isSame(day, 'day'))
      })
    }
  }

  getTopOfTimelineFrame(hour: number): number {
    return hour * HEIGHT_PX_PER_HOUR
  }

  // https://developer.mozilla.org/ja/docs/Web/API/Element/mouseup_event
  onMouseDown(event, dayItem: DayItem): void {
    // set start hour of event (round down mouse down position)
    const startHour = Math.floor(event.offsetY / HEIGHT_PX_PER_HOUR)

    this._eventMouseDown.next({
      startTime: dayItem.day.hour(startHour),
      endTime: dayItem.day.hour(startHour + 1),
    })

    event.stopImmediatePropagation()

    this._isShowNewEventPreview = true
  }

  onMouseMove(event): void {
    this._eventMouseMove.next({ offsetY: event.offsetY })
  }

  onMouseUp(): void {
    this._eventMouseUp.next()
  }

  onMouseDownOnEvent(event, eventItem: EventItem): void {
    this._eventMouseDownOnEvent.next({
      event: eventItem.event,
    })

    event.stopImmediatePropagation()
  }

  onMouseOutOnEvent(event, eventItem: EventItem): void {
    console.log('mouse out')
    this._eventMouseOutOnEvent.next({ event: eventItem.event })
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
      this._isShowNewEventPreview = false
    })
  }

}
