import {
  Component,
  Input,
  OnInit
} from '@angular/core'
import * as dayjs from 'dayjs'
import { DayItem } from '../weekly-calendar.presenter'

@Component({
  selector: 'app-weekly-calendar-header',
  templateUrl: './weekly-calendar-header.component.html',
  styleUrls: ['./weekly-calendar-header.component.scss']
})
export class WeeklyCalendarHeaderComponent implements OnInit {

  @Input() days: DayItem[]

  today: dayjs.Dayjs = dayjs().startOf('day')

  constructor() { }

  ngOnInit(): void {
  }

}
