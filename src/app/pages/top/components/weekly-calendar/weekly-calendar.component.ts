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

type ResizingEvent ={
  event: Event,
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

  // new event preview
  _eventMouseDown = new Subject<{ startTime: dayjs.Dayjs, endTime: dayjs.Dayjs, originalEvent?: Event }>()
  _eventMouseMove = new Subject<{ offsetY: number }>()
  _eventMouseUp = new Subject<void>()
  _isShowNewEventPreview: boolean = false
  _newEventPreview$: Observable<EventPreview>

  _newEvent = new Subject<EventPreview | null>()

  private readonly onDestroy$ = new EventEmitter();

  constructor(
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
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
      withLatestFrom(this._eventMouseDown, this._newEventPreview$)
    ).subscribe(([_, eventMouseDown, newEventPreview]) => {
      this._newEvent.next({
        startTime: newEventPreview.startTime,
        endTime: newEventPreview.endTime,
        style: this.calcNewEventPreviewStyle(newEventPreview.startTime, newEventPreview.endTime),
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

  private calcNewEventPreviewStyle(startTime: dayjs.Dayjs, endTime: dayjs.Dayjs): { top: string, height: string, left: string, width: string } {
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
      })
    }
  }

  getTopOfTimelineFrame(hour: number): number {
    return hour * HEIGHT_PX_PER_HOUR
  }

  // https://developer.mozilla.org/ja/docs/Web/API/Element/mouseup_event
  onMouseDown(event, dayItem: DayItem, hour: number): void {
    // set start hour of event (round down mouse down position)

    this._eventMouseDown.next({
      startTime: dayItem.day.hour(hour),
      endTime: dayItem.day.hour(hour + 1),
    })

    event.stopImmediatePropagation()

    this._isShowNewEventPreview = true
  }

  onMouseMove(event): void {
    console.log(event.offsetY)
    this._eventMouseMove.next({ offsetY: event.offsetY })
  }

  onMouseUp(): void {
    this._eventMouseUp.next()
    this._isShowNewEventPreview = false
  }

  onMouseDownOnResizable(event, targetEvent: Event): void {
    this._eventMouseDown.next({
      startTime: targetEvent.startTime,
      endTime: targetEvent.endTime,
      originalEvent: targetEvent,
    })

    event.stopImmediatePropagation()

    this._isShowNewEventPreview = true
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
