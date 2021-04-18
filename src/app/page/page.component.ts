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

  constructor() { }

  ngOnInit(): void {
  }

  onChangeActiveDate(date: dayjs.Dayjs) {
    this.activeDate = date
  }
}
