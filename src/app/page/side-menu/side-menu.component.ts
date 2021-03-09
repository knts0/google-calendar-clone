import { Component, Input, OnInit } from '@angular/core';
import * as moment                  from 'moment';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss']
})
export class SideMenuComponent implements OnInit {

  @Input() activeDate: moment.Moment

  constructor() { }

  ngOnInit(): void {
  }

}
