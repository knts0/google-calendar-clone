import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core'
import { EventEmitter, Output }     from '@angular/core'
import * as dayjs                   from 'dayjs'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit {

  @Input() activeDate: dayjs.Dayjs

  @Output() onPrevClicked: EventEmitter<void> = new EventEmitter()
  @Output() onNextClicked: EventEmitter<void> = new EventEmitter()
  @Output() onTodayClicked: EventEmitter<void> = new EventEmitter()

  constructor(
  ) { }

  ngOnInit(): void {
  }

  onClickTodayButton(): void {
    this.onTodayClicked.emit()
  }

  onClickPrevButton(): void {
    this.onPrevClicked.emit()
  }

  onClickNextButton(): void {
    this.onNextClicked.emit()
  }

}
