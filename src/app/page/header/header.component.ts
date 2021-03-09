import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Input() activeDate: moment.Moment

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
