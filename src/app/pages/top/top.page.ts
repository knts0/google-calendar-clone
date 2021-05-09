import { ChangeDetectionStrategy } from '@angular/core';
import { Component, OnInit }  from '@angular/core';

@Component({
  selector: 'app-top-page',
  templateUrl: './top.page.html',
  styleUrls: ['./top.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopPageComponent implements OnInit {

  constructor(
  ) { }

  ngOnInit(): void {
  }
}
