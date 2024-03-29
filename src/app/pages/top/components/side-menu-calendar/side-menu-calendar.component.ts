import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core'
import * as dayjs from 'dayjs'

import { DAYS_PER_WEEK, FIRST_DAY_OF_WEEK } from 'src/app/util/date'


@Component({
  selector: 'app-side-menu-calendar',
  templateUrl: './side-menu-calendar.component.html',
  styleUrls: ['./side-menu-calendar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class SideMenuCalendarComponent implements OnInit {

  @Input()
  get activeDate(): dayjs.Dayjs {
    return this._activeDate
  }
  set activeDate(date: dayjs.Dayjs) {
    this._today = dayjs()

    this._activeDate = date

    this._setActiveYearMonth(date.date(1))
  }

  @Output() onChangeActiveDate: EventEmitter<dayjs.Dayjs> = new EventEmitter()

  _activeDate: dayjs.Dayjs

  _activeYearMonth1stDate: dayjs.Dayjs
  _headerLabel: string

  _today: dayjs.Dayjs

  rows: Array<Array<dayjs.Dayjs | null>> = [[]]

  constructor() {
    this._activeDate = dayjs()
  }

  ngOnInit(): void {
    // create rows

  }

  _setActiveYearMonth(firstDayOfMonth: dayjs.Dayjs): void {
    this._activeYearMonth1stDate = firstDayOfMonth

    this._headerLabel = this._activeYearMonth1stDate.format('YYYY年M月')

    const totalDaysOfMonth = this._activeYearMonth1stDate.daysInMonth()

    let curDateOfMonth = 1

    this.rows = [[]]

    while (curDateOfMonth <= totalDaysOfMonth) {
      const week: Array<dayjs.Dayjs | null> = []

      for (let cellIndex = 0; cellIndex < DAYS_PER_WEEK; cellIndex++) {
        const cellDayOfWeek = (FIRST_DAY_OF_WEEK + cellIndex) % DAYS_PER_WEEK

        const curDayjsObj = this._activeYearMonth1stDate.date(curDateOfMonth)

        if (cellDayOfWeek === curDayjsObj.day() && curDateOfMonth <= totalDaysOfMonth) {
          week.push(curDayjsObj)
          curDateOfMonth += 1
        } else {
          week.push(null)
        }
      }

      this.rows.push(week)
    }
  }

  onClickPrevButton(): void {
    this._setActiveYearMonth(this._activeYearMonth1stDate.subtract(1, 'month'))
  }

  onClickNextButton(): void {
    this._setActiveYearMonth(this._activeYearMonth1stDate.add(1, 'month'))
  }

  onClickCell(item: dayjs.Dayjs) {
    this.onChangeActiveDate.emit(item)
  }

}
