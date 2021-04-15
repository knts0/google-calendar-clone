import { Component, OnInit } from '@angular/core';
import * as dayjs            from 'dayjs';

import { Event }             from '../models/event';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss']
})
export class PageComponent implements OnInit {

  activeDate: dayjs.Dayjs = dayjs().startOf('day')

  events: Event[] = [
    {
      title: '歯医者',
      startTime: dayjs('2021-04-12 09:30'),
      endTime: dayjs('2021-04-12 10:30')
    },
    {
      title: 'ライブ',
      startTime: dayjs('2021-04-09 19:00'),
      endTime: dayjs('2021-04-09 19:30')
    },
  ]

  constructor() { }

  ngOnInit(): void {
  }

  onChangeActiveDate(date: dayjs.Dayjs) {
    this.activeDate = date.clone()
  }
}
