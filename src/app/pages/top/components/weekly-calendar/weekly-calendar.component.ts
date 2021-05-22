import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit } from '@angular/core'
import { MatDialog }                from '@angular/material/dialog'
import * as dayjs                   from 'dayjs'
import * as duration                from 'dayjs/plugin/duration'
import { merge, Observable, Subject } from 'rxjs'
import { filter, map, takeUntil, withLatestFrom } from 'rxjs/operators'
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

  _activeDate: dayjs.Dayjs

  hours = Array.from({ length: 24 }, (v, i) => i )
  weekdays = [ '月', '火', '水', '木', '金', '土', '日' ]
  days: DayItem[] = []

  _eventMouseDown = new Subject<{ startTime: dayjs.Dayjs, endTime: dayjs.Dayjs }>()
  _eventMouseMove = new Subject<{ offsetY: number }>()
  _eventMouseUp = new Subject<void>()

  _isShowNewEventPreview: boolean = false
  _newEventPreview$: Observable<EventPreview>

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

        // new start hour of event (round down mouse move position)
        map(([mouseMove, mouseDown]) => {
          // mouse move (up)
          if (mouseDown.startTime.hour() * HEIGHT_PX_PER_HOUR >= mouseMove.offsetY) {
            const startTime = mouseDown.startTime.hour(Math.floor(mouseMove.offsetY / HEIGHT_PX_PER_HOUR))
            const endTime = mouseDown.endTime
            return {
              startTime: startTime,
              endTime: endTime,
              style: this.calcNewEventPreviewStyle(startTime, endTime),
            }

          // mouse move (down)
          } else {
            const startTime = mouseDown.startTime
            const endTime = mouseDown.startTime.hour(Math.ceil(mouseMove.offsetY / HEIGHT_PX_PER_HOUR))
            return {
              startTime: startTime,
              endTime: endTime,
              style: this.calcNewEventPreviewStyle(startTime, endTime),
            }
          }
        }),
      )
    )

    this._eventMouseUp.pipe(
      takeUntil(this.onDestroy$),
      withLatestFrom(this._newEventPreview$)
    ).subscribe(([_, { startTime, endTime }]) => {
      this.openEventEditDialog(startTime, endTime)}
    )
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
