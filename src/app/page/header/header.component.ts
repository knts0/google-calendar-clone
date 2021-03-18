import { Component, Input, OnInit } from '@angular/core';
import * as dayjs                   from 'dayjs'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Input() activeDate: dayjs.Dayjs

  constructor() { }

  ngOnInit(): void {
  }

  onClickTodayButton(): void {

  }

  onClickPrevButton(): void {

  }

  onClickNextButton(): void {

  }
}
