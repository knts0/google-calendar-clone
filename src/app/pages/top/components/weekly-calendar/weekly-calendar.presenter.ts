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
import { getFirstDayOfWeek } from 'src/app/util/date'
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

// export type TemporalNewEvent = {
//   startTime: dayjs.Dayjs
//   endTime:   dayjs.Dayjs
// }

export type DayItem = {
  day:        dayjs.Dayjs
  weekday:    string
}

export type AllDayEventRow = {
  eventItems: Event[]
}


@Injectable()
export class WeeklyCalendarPresenter implements OnDestroy {

  // event preview
  private eventPreviewStart       = new BehaviorSubject<{ startTime: dayjs.Dayjs, endTime: dayjs.Dayjs, originalEvent?: Event }>(null)
  private mouseMoveOnEventPreview = new BehaviorSubject<{ offsetY: number }>(null)
  isShowEventPreview: boolean = false
  private _eventPreview$: Observable<EventPreview>

  // new event
  // private newEvent = new Subject<TemporalNewEvent | null>()

  // event drag
  private eventDragStart = new BehaviorSubject<{ originalEvent: Event }>(null)
  private mouseMoveDrag  = new Subject<{ offsetX: number, offsetY: number }>()
  isShowEventDrag: boolean = false
  private _eventDrag$: Observable<EventDrag>

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
  /** */

  /** event drag  */
  get eventDrag$(): Observable<EventDrag> {
    return this._eventDrag$
  }
  /** */

  // get newEvent$(): Observable<TemporalNewEvent | null> {
  //   return this.newEvent.asObservable()
  // }

  private eventPreview(startTimeWhenMouseDown: dayjs.Dayjs, endTimeWhenMouseDown: dayjs.Dayjs, newOffsetY: number): EventPreview {
    const startTimeWhenMouseDownOffsetY = startTimeWhenMouseDown.hour() * HEIGHT_PX_PER_HOUR

    // mouse move (up): only change start time
    if (startTimeWhenMouseDownOffsetY >= newOffsetY) {
      // new start time of event (round down mouse move position)
      return {
        startTime: startTimeWhenMouseDown.hour(Math.floor(newOffsetY / HEIGHT_PX_PER_HOUR)),
        endTime:   startTimeWhenMouseDown.add(1, 'hour'),
      }

    // mouse move (down): only change end time
    } else {
      // new end time of event (round up mouse move position)
      return {
        startTime: startTimeWhenMouseDown,
        endTime:   endTimeWhenMouseDown.hour(Math.ceil(newOffsetY / HEIGHT_PX_PER_HOUR)),
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

  onEventPreviewEnd(): void {
    if (this.isShowEventPreview) {
      this.isShowEventPreview = false
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

  onEventDragEnd(): void {
    if (this.isShowEventDrag) {
      this.isShowEventDrag = false
    }
  }
  /** */

  // onSetNewEvent(startTime: dayjs.Dayjs, endTime: dayjs.Dayjs): void {
  //   this.newEvent.next({
  //     startTime: startTime,
  //     endTime:   endTime,
  //   })
  // }

  // onResetNewEvent(): void {
  //   this.newEvent.next(null)
  // }
}
