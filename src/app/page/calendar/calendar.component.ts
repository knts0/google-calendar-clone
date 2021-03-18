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
    this._firstWeekOffset = (firstOfMonth.day() - FIRST_DAY_OF_WEEK + DAYS_PER_WEEK) % DAYS_PER_WEEK

    this._initRows()
  }

  @Output() onChangeActiveDate: EventEmitter<dayjs.Dayjs> = new EventEmitter()

  _activeDate: dayjs.Dayjs

  _today: dayjs.Dayjs

  _firstWeekOffset: number

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

    const totalCalendarCells = totalDaysOfMonth + this._firstWeekOffset
    const numOfRows =
      (totalCalendarCells % DAYS_PER_WEEK === 0)
        ? totalCalendarCells / DAYS_PER_WEEK
        : (totalCalendarCells /DAYS_PER_WEEK + 1)

    let dayOfMonth = 1

    this.rows = [[]]

    for (let rowIndex = 0; rowIndex < numOfRows; rowIndex++) {
      const dates_per_week: number[] = []
      for (let cellIndex = 0; cellIndex < DAYS_PER_WEEK; cellIndex++) {
        if (rowIndex === 0 && this._firstWeekOffset <= cellIndex || 0 < rowIndex && dayOfMonth < this.activeDate.daysInMonth()) {
          dates_per_week.push(dayOfMonth)
          dayOfMonth += 1
        }
      }
      this.rows.push(dates_per_week)
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
