import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map }        from 'rxjs/operators';
import { Event } from '../models/event';
import { NewEvent } from '../models/new-event';
import * as dayjs from 'dayjs';
import { EventResponse, EventResponseModule } from './event-response';
import { UpdatedEvent } from '../models/updated-event';

const TEST_URL = 'api/test'

const CREATE_EVENT_URL = 'api/event'

const UPDATE_EVENT_URL = 'api/event'

const GET_EVENTS = 'api/event'

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

  updateEvent(event: UpdatedEvent): Observable<void> {
    return this.http.put<void>(
      UPDATE_EVENT_URL + '/' + event.id,
      event
    )
  }

  getEvents(startDate: dayjs.Dayjs, endDate: dayjs.Dayjs): Observable<Event[]> {
    return this.http.get<EventResponse>(
      GET_EVENTS
      + '?startDate='
      + startDate.format('YYYY-MM-DD')
      + '&endDate='
      + endDate.format('YYYY-MM-DD')
    ).pipe(
      map((res: EventResponse) => EventResponseModule.toModel(res))
    )
  }
}
