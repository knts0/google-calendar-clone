import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as dayjs                                         from 'dayjs';

const DAYS_PER_WEEK = 7
const FIRST_DAY_OF_WEEK = 1

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})

export class CalendarComponent implements OnInit {

  @Input()
  get activeDate(): dayjs.Dayjs {
    return this._activeDate
  }
  set activeDate(date: dayjs.Dayjs) {
    this._today = dayjs()

    this._activeDate = date

    this._headerLabel = this._activeDate.format('YYYY年M月')

    const firstOfMonth = this._activeDate.date(1)

    this._initRows()
  }

  @Output() onChangeActiveDate: EventEmitter<dayjs.Dayjs> = new EventEmitter()

  _activeDate: dayjs.Dayjs

  _today: dayjs.Dayjs

  _headerLabel: string

  weekdays = [ '月', '火', '水', '木', '金', '土', '日' ]

  rows: number[][] = [[]]

  constructor() {
    this._activeDate = dayjs()
  }

  ngOnInit(): void {
    // create rows

  }

  _initRows(): void {
    const totalDaysOfMonth = this.activeDate.daysInMonth()

    let curDateOfMonth = 1

    this.rows = [[]]

    while (curDateOfMonth <= totalDaysOfMonth) {
      const week: Array<number | null> = []

      for (let cellIndex = 0; cellIndex < DAYS_PER_WEEK; cellIndex++) {
        const cellDayOfWeek = (FIRST_DAY_OF_WEEK + cellIndex) % DAYS_PER_WEEK

        const curDayOfWeek = this.activeDate.date(curDateOfMonth).day()

        if (cellDayOfWeek == curDayOfWeek && curDateOfMonth <= totalDaysOfMonth) {
          week.push(curDateOfMonth)
          curDateOfMonth += 1
        } else {
          week.push(null)
        }
      }

      this.rows.push(week)
    }
  }

  onClickPrevButton(): void {

  }

  onClickNextButton(): void {

  }

  onClickCell(item: number) {
    this.onChangeActiveDate.emit(this._activeDate.date(item))
  }

}
