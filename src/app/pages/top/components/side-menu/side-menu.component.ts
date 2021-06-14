import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core'
import * as dayjs from 'dayjs'


@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SideMenuComponent implements OnInit {

  @Input() activeDate: dayjs.Dayjs

  @Output() onActiveDateChanged = new EventEmitter<dayjs.Dayjs>()
  @Output() onCreateEvent       = new EventEmitter<void>();

  constructor(
  ) { }

  ngOnInit(): void {
  }

  onClickCreateEventButton(): void {
    this.onCreateEvent.emit()
  }

  onChangeActiveDate(date: dayjs.Dayjs) {
    this.onActiveDateChanged.emit(date)
  }

}
