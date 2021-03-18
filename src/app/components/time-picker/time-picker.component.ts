import { Component, Input, OnInit } from '@angular/core';
import * as dayjs                   from 'dayjs';

@Component({
  selector: 'app-time-picker',
  templateUrl: './time-picker.component.html',
  styleUrls: ['./time-picker.component.scss']
})
export class TimePickerComponent implements OnInit {

  @Input()
  set placeholder(date: dayjs.Dayjs) {
    this._placeholder = date
  }

  _placeholder: dayjs.Dayjs

  constructor() { }

  ngOnInit(): void {
  }

}
