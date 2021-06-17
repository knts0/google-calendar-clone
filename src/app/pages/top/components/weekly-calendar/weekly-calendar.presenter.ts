import {
  Injectable,
  OnDestroy
} from '@angular/core'
import { FormBuilder } from '@angular/forms'
import * as dayjs      from 'dayjs'
import * as duration   from 'dayjs/plugin/duration'
import {
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

export type TemporalNewEvent = {
  startTime: dayjs.Dayjs
  endTime:   dayjs.Dayjs
}

export type EventDrag = {
  startTime:      dayjs.Dayjs
  endTime:        dayjs.Dayjs
  originalEvent?: Event
}

export type DayItem = {
  day:        dayjs.Dayjs
  weekday:    string
}

export type EventItem = {
  event: Event
}

export type AllDayEventItem = {
  event: Event
}

export type AllDayEventRow = {
  eventItems: AllDayEventItem[]
}


@Injectable()
export class WeeklyCalendarPresenter implements OnDestroy {

  activeDate: dayjs.Dayjs

  days:            DayItem[] = []
  eventItems:      EventItem[]
  allDayEventRows: AllDayEventRow[]

  // event preview
  private eventPreviewStart = new Subject<{ startTime: dayjs.Dayjs, endTime: dayjs.Dayjs, originalEvent?: Event }>()
  private mouseMove = new Subject<{ offsetY: number }>()
  private mouseUp = new Subject<void>()
  isShowEventPreview: boolean = false
  private _eventPreview$: Observable<EventPreview>
  private _eventPreviewComplete$: Observable<{ startTime: dayjs.Dayjs, endTime: dayjs.Dayjs, originalEvent?: Event }>

  // new event
  private newEvent = new Subject<TemporalNewEvent | null>()

  // event drag
  private eventDragStart = new Subject<{ originalEvent: Event }>()
  private mouseMoveDrag = new Subject<{ offsetX: number, offsetY: number }>()
  private mouseUpDrag = new Subject<void>()
  isShowEventDrag: boolean = false
  private _eventDrag$: Observable<EventDrag>
  private _eventDragComplete$: Observable<{ startTime: dayjs.Dayjs, endTime: dayjs.Dayjs, originalEvent: Event }>

  constructor(private readonly fb: FormBuilder) {
    this._eventPreview$ = merge(
      this.eventPreviewStart.pipe(
        tap(_ => this.isShowEventPreview = true),
        map(mouseDown => { return {
          originalEvent: mouseDown.originalEvent,
          startTime: mouseDown.startTime,
          endTime: mouseDown.endTime,
        }})
      ),
      this.mouseMove.pipe(
        filter(_ => this.isShowEventPreview),
        withLatestFrom(this.eventPreviewStart),
        map(([mouseMove, mouseDown]) => { return {
          ...this.eventPreview(mouseDown.startTime, mouseDown.endTime, mouseMove.offsetY),
          originalEvent: mouseDown.originalEvent,
        }}),
      )
    )

    this._eventPreviewComplete$ = this.mouseUp.pipe(
      filter(_ => this.isShowEventPreview),
      withLatestFrom(this.eventPreviewStart, this.eventPreview$),
      tap(([_, eventMouseDown, eventPreview]) => {
        this.isShowEventPreview = false
      }),
      map(([_, eventMouseDown, eventPreview]) => {
        return { startTime: eventPreview.startTime, endTime: eventPreview.endTime, originalEvent: eventMouseDown.originalEvent }
      }),
    )

    this._eventDrag$ = merge(
      this.eventDragStart.pipe(
        tap(_ => this.isShowEventDrag = true),
        map(mouseDown => { return {
          startTime: mouseDown.originalEvent.startTime,
          endTime: mouseDown.originalEvent.endTime,
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

    this._eventDragComplete$ = this.mouseUpDrag.pipe(
      filter(_ => this.isShowEventDrag),
      withLatestFrom(this.eventDragStart, this.eventDrag$),
      tap(([_, eventMouseDown, eventDrag]) => {
        this.isShowEventDrag = false
      }),
      map(([_, eventMouseDown, eventDrag]) => {
        return { startTime: eventDrag.startTime, endTime: eventDrag.endTime, originalEvent: eventMouseDown.originalEvent }
      }),
    )
  }

  ngOnDestroy(): void {
  }

  get eventPreview$(): Observable<EventPreview> {
    return this._eventPreview$
  }

  get eventPreviewComplete$(): Observable<{ startTime: dayjs.Dayjs, endTime: dayjs.Dayjs, originalEvent?: Event }> {
    return this._eventPreviewComplete$
  }

  get newEvent$(): Observable<TemporalNewEvent | null> {
    return this.newEvent.asObservable()
  }

  get eventDrag$(): Observable<EventDrag> {
    return this._eventDrag$
  }

  get eventDragComplete$(): Observable<{ startTime: dayjs.Dayjs, endTime: dayjs.Dayjs, originalEvent: Event }> {
    return this._eventDragComplete$
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
    this.eventItems = events.filter(e => !e.isAllDay).map(e => {
      return {
        event: e,
      }
    })

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
          row.eventItems.push({
            event: event,
          })

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

  onEventPreviewStart(startTime: dayjs.Dayjs, endTime: dayjs.Dayjs, originalEvent?: Event): void {
    this.eventPreviewStart.next({
      startTime: startTime,
      endTime: endTime,
      originalEvent: originalEvent,
    })
  }

  onMouseMove(offsetY: number): void {
    this.mouseMove.next({ offsetY: offsetY })
  }

  onMouseUp(): void {
    this.mouseUp.next()
  }

  onEventDragStart(originalEvent: Event): void {
    this.eventDragStart.next({
      originalEvent: originalEvent,
    })
  }

  onMouseMoveDrag(offsetX: number, offsetY: number): void {
    this.mouseMoveDrag.next({ offsetX: offsetX, offsetY: offsetY })
  }

  onMouseUpDrag(): void {
    this.mouseUpDrag.next()
  }

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
