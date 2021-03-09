import { Component, OnInit } from '@angular/core';
import * as moment           from 'moment';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss']
})
export class PageComponent implements OnInit {

  activeDate: moment.Moment = moment()

  constructor() { }

  ngOnInit(): void {
  }

  onChangeActiveDate(date: moment.Moment) {
    this.activeDate = date.clone()
  }
}
