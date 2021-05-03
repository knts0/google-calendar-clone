import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map }        from 'rxjs/operators';
import { NewEvent } from '../models/new-event';

const TEST_URL = 'api/test'

const CREATE_EVENT_URL = 'api/event'

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
}
