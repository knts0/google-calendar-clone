import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core'
import { FormControl } from '@angular/forms'
import * as dayjs from 'dayjs'
import { CalendarViewMode } from '../../containers/top/top.container'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit {

  @Input() activeDate: dayjs.Dayjs

  @Output() onPrevClicked:  EventEmitter<void> = new EventEmitter()
  @Output() onNextClicked:  EventEmitter<void> = new EventEmitter()
  @Output() onTodayClicked: EventEmitter<void> = new EventEmitter()

  calendarViewModeOptions: { value: CalendarViewMode, label: string }[] = [
    { value: 'month', label: '月' },
    { value: 'week', label: '週' },
  ]
  calendarViewModeControl = new FormControl('month')

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
