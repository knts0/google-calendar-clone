import { Component, OnInit } from '@angular/core';
import * as moment           from 'moment';

import { Event }             from '../models/event';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss']
})
export class PageComponent implements OnInit {

  activeDate: moment.Moment = moment().startOf('day')

  events: Event[] = [
    {
      title: '歯医者',
      startTime: moment('2021-03-12 09:30'),
      endTime: moment('2021-03-12 10:30')
    },
    {
      title: 'ライブ',
      startTime: moment('2021-03-09 19:00'),
      endTime: moment('2021-03-09 19:30')
    },
  ]

  constructor() { }

  ngOnInit(): void {
  }

  onChangeActiveDate(date: moment.Moment) {
    this.activeDate = date.clone()
  }
}
