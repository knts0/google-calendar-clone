import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'

import { Observable } from 'rxjs'
import { map }        from 'rxjs/operators'
import { Event } from '../models/event'
import { EventLoadDto, toModel } from '../models/event'
import { EventCreateDto } from '../models/new-event'
import * as dayjs from 'dayjs'
import { EventUpdateDto } from '../models/updated-event'

const TEST_URL = 'api/test'

const CREATE_EVENT_URL = 'api/event'

const UPDATE_EVENT_URL = 'api/event'

const DELETE_EVENT_URL = 'api/event'

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

  createEvent(dto: EventCreateDto): Observable<void> {
    return this.http.post<void>(CREATE_EVENT_URL, dto)
  }

  updateEvent(dto: EventUpdateDto): Observable<void> {
    return this.http.put<void>(
      UPDATE_EVENT_URL + '/' + dto.id,
      dto
    )
  }

  deleteEvent(eventId: string): Observable<void> {
    return this.http.delete<void>(
      DELETE_EVENT_URL + '/' + eventId
    )
  }

  getEvents(startDate: dayjs.Dayjs, endDate: dayjs.Dayjs): Observable<Event[]> {
    return this.http.get<EventLoadDto>(
      GET_EVENTS
      + '?startDate='
      + startDate.format('YYYY-MM-DD')
      + '&endDate='
      + endDate.format('YYYY-MM-DD')
    ).pipe(
      map((res: EventLoadDto) => toModel(res))
    )
  }

}
