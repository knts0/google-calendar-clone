import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

const CREATE_EVENT_URL = 'api/event'

@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(
    private http: HttpClient
  ) { }

  createEvent(event: Event): Observable<void> {
    return this.http.post<void>(CREATE_EVENT_URL, event)
  }
}
