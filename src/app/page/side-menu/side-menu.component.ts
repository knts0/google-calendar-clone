import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as dayjs                                         from 'dayjs';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss']
})
export class SideMenuComponent implements OnInit {

  @Input() activeDate: dayjs.Dayjs

  @Output() onChangeActiveDateEvent: EventEmitter<dayjs.Dayjs> = new EventEmitter()

  constructor() { }

  ngOnInit(): void {
  }

  onChangeActiveDate(date: dayjs.Dayjs) {
    this.onChangeActiveDateEvent.emit(date)
  }
}
