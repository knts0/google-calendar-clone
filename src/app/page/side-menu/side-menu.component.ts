import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as moment                                        from 'moment';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss']
})
export class SideMenuComponent implements OnInit {

  @Input() activeDate: moment.Moment

  @Output() onChangeActiveDateEvent: EventEmitter<moment.Moment> = new EventEmitter()

  constructor() { }

  ngOnInit(): void {
  }

  onChangeActiveDate(date: moment.Moment) {
    this.onChangeActiveDateEvent.emit(date)
  }
}
