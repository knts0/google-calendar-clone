import { Output } from '@angular/core'
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit } from '@angular/core'
import { MatDialog }                from '@angular/material/dialog'
import * as dayjs                   from 'dayjs'
import * as duration                from 'dayjs/plugin/duration'
import { Observable } from 'rxjs'
import { takeUntil } from 'rxjs/operators'
import { UpdatedEvent } from 'src/app/models/updated-event'

import { Event }                from '../../../../models/event'
import { EventCreateComponent } from '../modal/event-create/event-create.component'
import { EventEditComponent }   from '../modal/event-edit/event-edit.component'
import { DayItem, EventDrag, EventItem, EventPreview, HEIGHT_PX_PER_HOUR, TemporalNewEvent, WeeklyCalendarPresenter } from './weekly-calendar.presenter'



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

  @Input() today: dayjs.Dayjs

  @Input()
  set events(events: Event[]) {
    this.presenter.initDays(events)
  }

  @Input()
  set updateEventSuccess(updateEventSuccess: UpdatedEvent) {
    this.presenter.onResetNewEvent()
  }

  @Output() eventUpdated = new EventEmitter<UpdatedEvent>();

  get days(): DayItem[] {
    return this.presenter.days
  }

  get eventItems(): EventItem[] {
    return this.presenter.eventItems
  }

  get isShowEventPreview(): boolean {
    return this.presenter.isShowEventPreview
  }

  get eventPreview$(): Observable<EventPreview> {
    return this.presenter.eventPreview$
  }

  get newEvent$(): Observable<TemporalNewEvent | null> {
    return this.presenter.newEvent$
  }

  get isShowEventDrag(): boolean {
    return this.presenter.isShowEventDrag
  }

  get eventDrag$(): Observable<EventDrag> {
    return this.presenter.eventDrag$
  }

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
      this.presenter.onSetNewEvent(data.startTime, data.endTime)

      if (data.originalEvent == null) {
        this.openEventEditDialog(data.startTime, data.endTime)
      } else {
        const updatedEvent = {
          id: data.originalEvent.id,
          title: data.originalEvent.title,
          startTime: data.startTime,
          endTime: data.endTime,
        }
        this.eventUpdated.emit(updatedEvent)
      }
    })

    this.presenter.eventDragComplete$.pipe(
      takeUntil(this.onDestroy$)
    ).subscribe(data => {
      const updatedEvent = {
        id: data.originalEvent.id,
        title: data.originalEvent.title,
        startTime: data.startTime,
        endTime: data.endTime,
      }
      this.eventUpdated.emit(updatedEvent)
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

  onMouseDown(event, day: dayjs.Dayjs, hour: number): void {
    this.presenter.onEventPreviewStart(day.hour(hour), day.hour(hour + 1))

    event.stopImmediatePropagation()
  }

  onMouseMove(event): void {
    this.presenter.onMouseMove(event.offsetY)
  }

  onMouseUp(): void {
    this.presenter.onMouseUp()
  }

  onMouseDownOnResizable(targetEvent: Event): void {
    this.presenter.onEventPreviewStart(
      targetEvent.startTime,
      targetEvent.endTime,
      targetEvent,
    )

    event.stopImmediatePropagation()
  }

  onMouseDownOnDraggable(targetEvent: Event): void {
    this.presenter.onEventDragStart(
      targetEvent,
    )

    event.stopImmediatePropagation()
  }

  onMouseMoveDrag(event): void {
    this.presenter.onMouseMoveDrag(event.offsetX, event.offsetY)
  }

  onMouseUpDrag(): void {
    this.presenter.onMouseUpDrag()
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
    }).afterClosed().pipe(
      takeUntil(this.onDestroy$)
    ).subscribe( _ => {
      this.presenter.onResetNewEvent()
    })
  }

}
