import { Component, Input, OnInit } from '@angular/core';
import { EventEmitter, Output }     from '@angular/core';
import * as dayjs                   from 'dayjs'

import { Store } from '@ngxs/store';
import { CalendarActions } from '../state/calendar.actions';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Input() activeDate: dayjs.Dayjs

  @Output() onPrevClicked: EventEmitter<void> = new EventEmitter()
  @Output() onNextClicked: EventEmitter<void> = new EventEmitter()

  constructor(
    private store: Store,
  ) { }

  ngOnInit(): void {
  }

  onClickTodayButton(): void {
    this.store.dispatch(new CalendarActions.SetActiveDateAction(dayjs().startOf('day')))
  }

  onClickPrevButton(): void {
    this.onPrevClicked.emit()
  }

  onClickNextButton(): void {
    this.onNextClicked.emit()
  }
}
