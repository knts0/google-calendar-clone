import {
  Component,
  Input,
  OnInit
} from '@angular/core'
import * as dayjs from 'dayjs'

@Component({
  selector: 'app-weekly-calendar-header',
  templateUrl: './weekly-calendar-header.component.html',
  styleUrls: ['./weekly-calendar-header.component.scss']
})
export class WeeklyCalendarHeaderComponent implements OnInit {

  @Input() days: dayjs.Dayjs[]

  today: dayjs.Dayjs = dayjs().startOf('day')

  constructor() { }

  ngOnInit(): void {
  }

}
