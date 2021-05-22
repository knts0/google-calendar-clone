import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit } from '@angular/core'
import { MatDialog }                from '@angular/material/dialog'
import * as dayjs                   from 'dayjs'
import * as duration                from 'dayjs/plugin/duration'
import { combineLatest, merge, Observable, Subject } from 'rxjs'
import { filter, map, share, takeUntil, tap, withLatestFrom } from 'rxjs/operators'
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

  _eventItems: EventItem[]

  hours = Array.from({ length: 24 }, (v, i) => i )
  weekdays = [ '月', '火', '水', '木', '金', '土', '日' ]
  days: DayItem[] = []

  _eventMouseDown = new Subject<{ startHour: number, endHour: number, dayItem: DayItem }>()
  _eventMouseMove = new Subject<{ offsetY: number }>()
  _eventMouseUp = new Subject<void>()

  _startHour$: Observable<number>
  _endHour$: Observable<number>

  _isShowNewEventPreview: boolean = false
  _newEventPreview$: Observable<
    {
      day: dayjs.Dayjs
      style: {
        top:    number
        height: number
      }
    }
  >

  private readonly onDestroy$ = new EventEmitter();

  constructor(
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this._startHour$ = merge(
      this._eventMouseDown.pipe(
        map(mouseDown => mouseDown.startHour)
      ),
      this._eventMouseMove.pipe(
        filter(_ => this._isShowNewEventPreview),

        withLatestFrom(this._eventMouseDown),

        // mouse move (up)
        filter(([mouseMove, mouseDown]) => mouseDown.startHour * HEIGHT_PX_PER_HOUR >= mouseMove.offsetY),

        // new start hour of event (round down mouse move position)
        map(([mouseMove, _]) => Math.floor(mouseMove.offsetY / HEIGHT_PX_PER_HOUR)),
      )
    )

    this._endHour$ = merge(
      this._eventMouseDown.pipe(
        map(mouseDown => mouseDown.endHour)
      ),
      this._eventMouseMove.pipe(
        filter(_ => this._isShowNewEventPreview),

        withLatestFrom(this._eventMouseDown),

        // mouse move (down)
        filter(([mouseMove, mouseDown]) => mouseDown.startHour * HEIGHT_PX_PER_HOUR < mouseMove.offsetY),

        // new end hour of event (round up mouse move position)
        map(([mouseMove, _]) => Math.ceil(mouseMove.offsetY / HEIGHT_PX_PER_HOUR)),
      )
    )

    this._newEventPreview$ = combineLatest([
      this._startHour$,
      this._endHour$,
    ]).pipe(
      withLatestFrom(this._eventMouseDown),
      map(([[startHour, endHour], mouseDown]) => {
        console.log('event preview')
        // calc preview event position
        const top    = startHour * HEIGHT_PX_PER_HOUR
        const bottom = endHour * HEIGHT_PX_PER_HOUR

        return {
          day: mouseDown.dayItem.day,
          style: {
            top:    top,
            height: bottom - top,
          }
        }
      }),
      share()
    )

    this._eventMouseUp.pipe(
      takeUntil(this.onDestroy$),
      withLatestFrom(this._newEventPreview$, this._startHour$, this._endHour$)
    ).subscribe(([_, eventPreview, startHour, endHour]) => {
      this.openEventEditDialog(eventPreview.day, startHour, endHour)}
    )
  }

  ngOnDestroy() {
    this.onDestroy$.emit();
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
    // set start hour of event (round down mouse down position)
    const startHour = Math.floor(event.offsetY / HEIGHT_PX_PER_HOUR)

    this._eventMouseDown.next({
      startHour: startHour,
      endHour: startHour + 1,
      dayItem: dayItem,
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
      this._isShowNewEventPreview = false
    })
  }

}
