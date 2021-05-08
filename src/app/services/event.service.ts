import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map }        from 'rxjs/operators';
import { Event } from '../models/event';
import { NewEvent } from '../models/new-event';
import * as dayjs from 'dayjs';
import { EventResponse, EventResponseModule } from './event-response';

const TEST_URL = 'api/test'

const CREATE_EVENT_URL = 'api/event'

const GET_EVENT_IN_A_WEEK = 'api/event/week'

@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(
    private http: HttpClient
  ) { }

  test(): Observable<number> {
    return this.http.get<{ result: number }>(TEST_URL).pipe(
      map(v => v.result)
    )
  }

  createEvent(event: NewEvent): Observable<void> {
    return this.http.post<void>(CREATE_EVENT_URL, event)
  }


  getEventsInAWeek(weekStartDate: dayjs.Dayjs): Observable<Event[]> {
    return this.http.get<EventResponse>(
      GET_EVENT_IN_A_WEEK
      + '?weekStartDate='
      + weekStartDate.format('YYYY-MM-DD')
    ).pipe(
      map((res: EventResponse) => EventResponseModule.toModel(res))
    )
  }
}
