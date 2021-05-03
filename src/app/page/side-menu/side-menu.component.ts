import { Component, Input, OnInit } from '@angular/core';
import * as dayjs                   from 'dayjs';

import { Store } from '@ngxs/store';
import { CalendarActions } from '../state/calendar.actions';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss']
})
export class SideMenuComponent implements OnInit {

  @Input() activeDate: dayjs.Dayjs

  constructor(
    private store: Store,
  ) { }

  ngOnInit(): void {
  }

  onChangeActiveDate(date: dayjs.Dayjs) {
    this.store.dispatch(new CalendarActions.SetActiveDateAction(date))
  }
}
