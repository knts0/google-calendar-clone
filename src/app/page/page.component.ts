import { Component, OnInit }  from '@angular/core';
import * as dayjs             from 'dayjs';
import { Select, Store }      from '@ngxs/store';
import { Emitter, Emittable } from '@ngxs-labs/emitter';

import { Event }             from '../models/event';
import { EventService } from '../services/event.service';
import { CalendarState } from './state/calendar.state';
import { Observable } from 'rxjs';

export type CalendarViewMode = 'month' | 'week'

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss']
})
export class PageComponent implements OnInit {

  @Select(CalendarState.activeDate) activeDate$: Observable<dayjs.Dayjs>;

  @Emitter(CalendarState.setActiveDate)
  private setActiveDateEmitter: Emittable<dayjs.Dayjs>

  today: dayjs.Dayjs = dayjs().startOf('day')

  calendarViewMode: CalendarViewMode = 'week'

  constructor(
    private eventService: EventService,
    private store: Store,
  ) { }

  ngOnInit(): void {
    this.eventService.test().subscribe(_ => console.log('test'))
  }

  onChangeActiveDate(date: dayjs.Dayjs) {
    this.setActiveDateEmitter.emit(date)
  }

  changeActiveDatePrev(): void {
    switch (this.calendarViewMode) {
      case 'week':
        this.setActiveDateEmitter.emit(
          this.store.selectSnapshot(CalendarState.activeDate).subtract(1, 'week')
        )
    }
  }

  changeActiveDateNext(): void {
    switch (this.calendarViewMode) {
      case 'week':
        this.setActiveDateEmitter.emit(
          this.store.selectSnapshot(CalendarState.activeDate).add(1, 'week')
        )
    }
  }

  changeActiveDateToToday(): void {
    this.setActiveDateEmitter.emit(
      dayjs().startOf('day')
    )
  }
}
