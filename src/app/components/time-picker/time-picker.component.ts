import { Component, Input, OnInit } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-time-picker',
  templateUrl: './time-picker.component.html',
  styleUrls: ['./time-picker.component.scss']
})
export class TimePickerComponent implements OnInit {

  @Input()
  set placeholder(date: moment.Moment) {
    this._placeholder = date
  }

  _placeholder: moment.Moment

  constructor() { }

  ngOnInit(): void {
  }

}
