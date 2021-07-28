import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-time-picker',
  templateUrl: './time-picker.component.html',
  styleUrls: ['./time-picker.component.scss']
})
export class TimePickerComponent implements OnInit {

  hours = Array.from(new Array(24).keys())

  constructor() { }

  ngOnInit(): void {
  }

  handleTransitionendCellContainer(event): void {

  }

}
