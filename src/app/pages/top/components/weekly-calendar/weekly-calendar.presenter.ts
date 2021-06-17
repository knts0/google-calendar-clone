import {
  Injectable,
  OnDestroy
} from '@angular/core'
import { FormBuilder } from '@angular/forms'
import * as dayjs      from 'dayjs'
import * as duration   from 'dayjs/plugin/duration'
import {
  BehaviorSubject,
  merge,
  Observable,
  Subject
} from 'rxjs'
import {
  filter,
  map,
  tap,
  withLatestFrom
} from 'rxjs/operators'

import { Event } from 'src/app/models/event'
import {
  DAYS_PER_WEEK,
  FIRST_DAY_OF_WEEK,
  getFirstDayOfWeek
} from 'src/app/util/date'
import {
  HEIGHT_PX_PER_HOUR,
  WIDTH_PX_PER_DAY
} from './shared/calc-event-style'

export type EventPreview ={
  originalEvent?: Event
  startTime:      dayjs.Dayjs
  endTime:        dayjs.Dayjs
}

export type EventDrag = {
  startTime:      dayjs.Dayjs
  endTime:        dayjs.Dayjs
  originalEvent?: Event
}

export type TemporalNewEvent = {
  startTime: dayjs.Dayjs
  endTime:   dayjs.Dayjs
}

export type DayItem = {
  day:        dayjs.Dayjs
  weekday:    string
}

export type AllDayEventRow = {
  eventItems: Event[]
}


@Injectable()
export class WeeklyCalendarPresenter implements OnDestroy {

  activeDate: dayjs.Dayjs

  days:            DayItem[] = []
  eventItems:      Event[]
  allDayEventRows: AllDayEventRow[]

  // event preview
  private eventPreviewStart       = new BehaviorSubject<{ startTime: dayjs.Dayjs, endTime: dayjs.Dayjs, originalEvent?: Event }>(null)
  private mouseMoveOnEventPreview = new BehaviorSubject<{ offsetY: number }>(null)
  isShowEventPreview: boolean = false
  private _eventPreview$: Observable<EventPreview>
  private _eventPreviewComplete   = new Subject<EventPreview>()

  // new event
  private newEvent = new Subject<TemporalNewEvent | null>()

  // event drag
  private eventDragStart = new BehaviorSubject<{ originalEvent: Event }>(null)
  private mouseMoveDrag  = new Subject<{ offsetX: number, offsetY: number }>()
  isShowEventDrag: boolean = false
  private _eventDrag$: Observable<EventDrag>
  private _eventDragComplete = new Subject<EventDrag>()

  constructor(private readonly fb: FormBuilder) {
    this._eventPreview$ = merge(
      this.eventPreviewStart.pipe(
        filter(v => v != null),
        tap(_ => this.isShowEventPreview = true),
        map(mouseDown => { return {
          originalEvent: mouseDown.originalEvent,
          startTime:     mouseDown.startTime,
          endTime:       mouseDown.endTime,
        }})
      ),
      this.mouseMoveOnEventPreview.pipe(
        filter(_ => this.isShowEventPreview),
        map(mouseMove => {
          const mouseDown = this.eventPreviewStart.value
          return {
            ...this.eventPreview(mouseDown.startTime, mouseDown.endTime, mouseMove.offsetY),
            originalEvent: mouseDown.originalEvent,
          }
        }),
      )
    )

    this._eventDrag$ = merge(
      this.eventDragStart.pipe(
        filter(v => v != null),
        tap(_ => this.isShowEventDrag = true),
        map(mouseDown => { return {
          startTime:     mouseDown.originalEvent.startTime,
          endTime:       mouseDown.originalEvent.endTime,
          originalEvent: mouseDown.originalEvent,
        }})
      ),
      this.mouseMoveDrag.pipe(
        filter(_ => this.isShowEventDrag),
        withLatestFrom(this.eventDragStart),
        map(([mouseMove, mouseDown]) => { return {
          ...this.eventDrag(mouseDown.originalEvent.startTime, mouseDown.originalEvent.endTime, mouseMove.offsetX, mouseMove.offsetY),
          originalEvent: mouseDown.originalEvent,
        }}),
      )
    )
  }

  ngOnDestroy(): void {
  }

  /** event preview */
  get eventPreview$(): Observable<EventPreview> {
    return this._eventPreview$
  }

  get eventPreviewComplete$(): Observable<EventPreview> {
    return this._eventPreviewComplete.asObservable()
  }
  /** */

  /** event drag  */
  get eventDrag$(): Observable<EventDrag> {
    return this._eventDrag$
  }

  get eventDragComplete$(): Observable<EventDrag> {
    return this._eventDragComplete.asObservable()
  }
  /** */

  get newEvent$(): Observable<TemporalNewEvent | null> {
    return this.newEvent.asObservable()
  }

  private eventPreview(startTimeWhenMouseDown: dayjs.Dayjs, endTimeWhenMouseDown: dayjs.Dayjs, newOffsetY: number): EventPreview {
    const startTimeWhenMouseDownOffsetY = startTimeWhenMouseDown.hour() * HEIGHT_PX_PER_HOUR

    // mouse move (up): only change start time
    if (startTimeWhenMouseDownOffsetY >= newOffsetY) {
      // new start time of event (round down mouse move position)
      const startTime = startTimeWhenMouseDown.hour(Math.floor(newOffsetY / HEIGHT_PX_PER_HOUR))
      const endTime   = startTimeWhenMouseDown.add(1, 'hour')
      return {
        startTime: startTime,
        endTime:   endTime,
      }

    // mouse move (down): only change end time
    } else {
      const startTime = startTimeWhenMouseDown
      // new end time of event (round up mouse move position)
      const endTime = endTimeWhenMouseDown.hour(Math.ceil(newOffsetY / HEIGHT_PX_PER_HOUR))
      return {
        startTime: startTime,
        endTime:   endTime,
      }
    }
  }

  private eventDrag(startTimeWhenMouseDown: dayjs.Dayjs, endTimeWhenMouseDown: dayjs.Dayjs, newOffsetX: number, newOffsetY: number): EventDrag {
    dayjs.extend(duration)
    const firstDayOfWeek = getFirstDayOfWeek(startTimeWhenMouseDown)
    const newDate        = firstDayOfWeek.add(Math.floor(newOffsetX / WIDTH_PX_PER_DAY), 'day')

    const startTime = newDate.hour(Math.floor(newOffsetY / HEIGHT_PX_PER_HOUR))
    const endTime   = startTime.add(dayjs.duration(endTimeWhenMouseDown.diff(startTimeWhenMouseDown)))
    return {
      startTime: startTime,
      endTime:   endTime,
    }
  }

  init(): void {
  }

  initDays(events: Event[]): void {
    this.eventItems = events.filter(e => !e.isAllDay)

    const firstDayOfWeek = getFirstDayOfWeek(this.activeDate)

    dayjs.extend(duration)
    const allDayEvents = events.filter(e => e.isAllDay)
    allDayEvents.sort((a, b) => dayjs.duration(a.startTime.diff(b.startTime)).asMinutes())

    this.allDayEventRows = []
    while (allDayEvents.length > 0) {
      let date = firstDayOfWeek.clone()
      const row: AllDayEventRow = { eventItems: [] }
      while (date.isBefore(firstDayOfWeek.add(1, 'week'))) {
        const eventIndex = allDayEvents.findIndex(e => e.startTime.isSame(date, 'day'))
        if (eventIndex != -1) {
          const event = allDayEvents[eventIndex]
          row.eventItems.push(event)

          date = event.endTime.startOf('day').add(1, 'day')
          allDayEvents.splice(eventIndex, 1)
        } else {
          date = date.add(1, 'day')
        }
      }
      this.allDayEventRows.push(row)
    }

    this.days = []

    const weekdays = [ '月', '火', '水', '木', '金', '土', '日' ]

    for (let dayOfWeek = 0; dayOfWeek < DAYS_PER_WEEK; dayOfWeek++) {
      const day = firstDayOfWeek.day(dayOfWeek + FIRST_DAY_OF_WEEK)
      this.days.push({
        day:     day,
        weekday: weekdays[dayOfWeek],
      })
    }
  }

  /** event preview  */
  onEventPreviewStart(startTime: dayjs.Dayjs, endTime: dayjs.Dayjs, originalEvent?: Event): void {
    this.eventPreviewStart.next({
      startTime:     startTime,
      endTime:       endTime,
      originalEvent: originalEvent,
    })
  }

  onMouseMoveOnEventPreview(offsetY: number): void {
    this.mouseMoveOnEventPreview.next({ offsetY: offsetY })
  }

  onEventPreviewEnd(eventPreview: EventPreview): void {
    if (this.isShowEventPreview) {
      this.isShowEventPreview = false
      this._eventPreviewComplete.next(eventPreview)
    }
  }
  /** */

  /** event drag  */
  onEventDragStart(originalEvent: Event): void {
    this.eventDragStart.next({
      originalEvent: originalEvent,
    })
  }

  onMouseMoveEventDrag(offsetX: number, offsetY: number): void {
    this.mouseMoveDrag.next({ offsetX: offsetX, offsetY: offsetY })
  }

  onEventDragEnd(eventDrag: EventDrag): void {
    if (this.isShowEventDrag) {
      this.isShowEventDrag = false
      this._eventDragComplete.next(eventDrag)
    }
  }
  /** */

  onSetNewEvent(startTime: dayjs.Dayjs, endTime: dayjs.Dayjs): void {
    this.newEvent.next({
      startTime: startTime,
      endTime:   endTime,
    })
  }

  onResetNewEvent(): void {
    this.newEvent.next(null)
  }

  changeActiveDate(date: dayjs.Dayjs) {
    this.activeDate = date
  }
}
