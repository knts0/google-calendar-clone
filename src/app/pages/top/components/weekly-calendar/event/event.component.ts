import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { Event } from 'src/app/models/event'

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss']
})
export class EventComponent implements OnInit {

  @Input() event: Event

  @Output() mouseDownOnResizable = new EventEmitter<Event>();

  constructor() { }

  ngOnInit(): void {
  }

  onMouseDownOnResizable(targetEvent: Event): void {
    this.mouseDownOnResizable.emit(targetEvent)
  }

}
