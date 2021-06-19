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
import * as duration    from 'dayjs/plugin/duration'
import { Observable }   from 'rxjs'
import { takeUntil }    from 'rxjs/operators'
import { UpdatedEvent } from 'src/app/models/updated-event'

import { Event }                from '../../../../models/event'
import { EventCreateComponent } from '../modal/event-create/event-create.component'
import { EventEditComponent }   from '../modal/event-edit/event-edit.component'
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

  @Input()
  get activeDate(): dayjs.Dayjs {
    return this.presenter.activeDate
  }

  set activeDate(date: dayjs.Dayjs) {
    this.presenter.changeActiveDate(date)
  }

  @Input()
  set events(events: Event[]) {
    this.presenter.initDays(events)
  }

  // @Input()
  // set updateEventSuccess(updateEventSuccess: UpdatedEvent) {
  //   console.log('as')
  //   this.presenter.onResetNewEvent()
  // }

  @Output() eventUpdated = new EventEmitter<UpdatedEvent>();

  get days(): DayItem[] {
    return this.presenter.days
  }

  get eventItems(): Event[] {
    return this.presenter.eventItems
  }

  get allDayEventRows(): AllDayEventRow[] {
    return this.presenter.allDayEventRows
  }

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

  hours = Array.from({ length: 24 }, (v, i) => i )

  private readonly onDestroy$ = new EventEmitter();

  constructor(
    private dialog: MatDialog,
    private presenter: WeeklyCalendarPresenter,
  ) { }

  ngOnInit(): void {
    this.presenter.eventPreviewComplete$.pipe(
      takeUntil(this.onDestroy$)
    ).subscribe(data => {
      // this.presenter.onSetNewEvent(data.startTime, data.endTime)

      if (data.originalEvent == null) {
        this.openEventCreateDialog(data.startTime, data.endTime)
      } else {
        const updatedEvent = {
          id:        data.originalEvent.id,
          title:     data.originalEvent.title,
          startTime: data.startTime,
          endTime:   data.endTime,
          isAllDay:  data.originalEvent.isAllDay,
        }
        this.eventUpdated.emit(updatedEvent)
      }
    })

    this.presenter.eventDragComplete$.pipe(
      takeUntil(this.onDestroy$),
    ).subscribe(data => {
      if (data.startTime.isSame(data.originalEvent.startTime) && data.endTime.isSame(data.originalEvent.endTime)) {
        this.openEventEditDialog(data.originalEvent)
      } else {
        const updatedEvent = {
          id:        data.originalEvent.id,
          title:     data.originalEvent.title,
          startTime: data.startTime,
          endTime:   data.endTime,
          isAllDay:  data.originalEvent.isAllDay,
        }
        this.eventUpdated.emit(updatedEvent)
      }
    })
  }

  ngOnChanges(): void {
    this.presenter.init();
  }

  ngOnDestroy() {
    this.onDestroy$.emit();
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
    this.presenter.onEventPreviewEnd(eventPreview)
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
    this.presenter.onEventDragEnd(eventDrag)
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
