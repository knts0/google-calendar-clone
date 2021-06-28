import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core'
import { MatDialog }    from '@angular/material/dialog'
import * as dayjs       from 'dayjs'
import 'dayjs/locale/ja'
import * as duration    from 'dayjs/plugin/duration'
import { Observable }   from 'rxjs'
import { takeUntil }    from 'rxjs/operators'
import { UpdatedEvent } from 'src/app/models/updated-event'

import { Event }                from '../../../../models/event'
import { EventCreateComponent } from '../modal/event-create/event-create.component'
import { EventEditComponent }   from '../modal/event-edit/event-edit.component'
import {
  DAYS_PER_WEEK,
  FIRST_DAY_OF_WEEK,
  getFirstDayOfWeek
} from 'src/app/util/date'
import {
  HEIGHT_PX_PER_HOUR
} from './shared/calc-event-style'
import {
  AllDayEventRow,
  DayItem,
  EventDrag,
  EventPreview,
  // TemporalNewEvent,
  WeeklyCalendarPresenter
} from './weekly-calendar.presenter'


@Component({
  selector: 'app-weekly-calendar',
  templateUrl: './weekly-calendar.component.html',
  styleUrls: ['./weekly-calendar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WeeklyCalendarComponent implements OnInit {

  _activeDate: dayjs.Dayjs

  @Input()
  get activeDate() {
    return this._activeDate
  }
  set activeDate(date: dayjs.Dayjs) {
    this._activeDate = date.clone()

    const firstDayOfWeek = getFirstDayOfWeek(this._activeDate.clone().locale('ja'))
    this.days = []

    for (let dayOfWeek = 0; dayOfWeek < DAYS_PER_WEEK; dayOfWeek++) {
      this.days.push(firstDayOfWeek.day(dayOfWeek + FIRST_DAY_OF_WEEK))
    }
  }

  @Input()
  set events(events: Event[]) {
    this.initDays(events)
  }

  // @Input()
  // set updateEventSuccess(updateEventSuccess: UpdatedEvent) {
  //   console.log('as')
  //   this.presenter.onResetNewEvent()
  // }

  @Output() eventUpdated = new EventEmitter<UpdatedEvent>();

  /** event preview  */
  get isShowEventPreview(): boolean {
    return this.presenter.isShowEventPreview
  }

  get eventPreview$(): Observable<EventPreview> {
    return this.presenter.eventPreview$
  }
  /** */

  /** event drag */
  get isShowEventDrag(): boolean {
    return this.presenter.isShowEventDrag
  }

  get eventDrag$(): Observable<EventDrag> {
    return this.presenter.eventDrag$
  }
  /** */

  // get newEvent$(): Observable<TemporalNewEvent | null> {
  //   return this.presenter.newEvent$
  // }

  days:            dayjs.Dayjs[] = []
  eventItems:      Event[] = []
  allDayEventRows: AllDayEventRow[]

  hours = Array.from({ length: 24 }, (v, i) => i )

  private readonly onDestroy$ = new EventEmitter();

  constructor(
    private dialog: MatDialog,
    private presenter: WeeklyCalendarPresenter,
  ) { }

  ngOnInit(): void {
  }

  ngOnChanges(): void {
    this.presenter.init();
  }

  ngOnDestroy() {
    this.onDestroy$.emit();
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
  }

  getTopOfTimelineFrame(hour: number): number {
    return hour * HEIGHT_PX_PER_HOUR
  }

  /** event preview  */
  onEventPreviewStart(day: dayjs.Dayjs, hour: number): void {
    this.presenter.onEventPreviewStart(day.hour(hour), day.hour(hour + 1))
  }

  onMouseMoveOnEventPreview(event): void {
    this.presenter.onMouseMoveOnEventPreview(event.offsetY)
  }

  onEventPreviewEnd(eventPreview: EventPreview): void {
    this.presenter.onEventPreviewEnd()

    if (eventPreview.originalEvent == null) {
      this.openEventCreateDialog(eventPreview.startTime, eventPreview.endTime)
    } else {
      const updatedEvent = {
        id:        eventPreview.originalEvent.id,
        title:     eventPreview.originalEvent.title,
        startTime: eventPreview.startTime,
        endTime:   eventPreview.endTime,
        isAllDay:  eventPreview.originalEvent.isAllDay,
      }
      this.eventUpdated.emit(updatedEvent)
    }
  }
  /** */

  /** event resize  */
  onMouseDownOnResizable(targetEvent: Event): void {
    this.presenter.onEventPreviewStart(
      targetEvent.startTime,
      targetEvent.endTime,
      targetEvent,
    )
  }

  /** event drag  */
  onEventDragStart(targetEvent: Event): void {
    this.presenter.onEventDragStart(
      targetEvent,
    )
  }

  onMouseMoveDrag(event): void {
    this.presenter.onMouseMoveEventDrag(event.offsetX, event.offsetY)
  }

  onEventDragEnd(eventDrag: EventDrag): void {
    this.presenter.onEventDragEnd()

    if (
      eventDrag.startTime.isSame(eventDrag.originalEvent.startTime) &&
      eventDrag.endTime.isSame(eventDrag.originalEvent.endTime)
    ) {
      this.openEventEditDialog(eventDrag.originalEvent)
    } else {
      const updatedEvent = {
        id:        eventDrag.originalEvent.id,
        title:     eventDrag.originalEvent.title,
        startTime: eventDrag.startTime,
        endTime:   eventDrag.endTime,
        isAllDay:  eventDrag.originalEvent.isAllDay,
      }
      this.eventUpdated.emit(updatedEvent)
    }
  }
  /** */

  onClickEvent(event: Event): void {
    this.openEventEditDialog(event)
  }

  private openEventCreateDialog(startTime: dayjs.Dayjs, endTime: dayjs.Dayjs): void {
    dayjs.extend(duration)

    const data = {
      start: startTime,
      end: endTime,
      isAllDay: false,
    }

    this.dialog.open(EventCreateComponent, {
      data: data,
      panelClass: 'dialog-overlay',
    }).afterClosed().pipe(
      takeUntil(this.onDestroy$)
    ).subscribe( _ => {
      // this.presenter.onResetNewEvent()
    })
  }

  private openEventEditDialog(event: Event): void {
    this.dialog.open(EventEditComponent, {
      data: {
        event: event,
      },
      panelClass: 'dialog-overlay',
    })
  }
}
