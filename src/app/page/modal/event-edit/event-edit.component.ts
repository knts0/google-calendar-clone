import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA }           from '@angular/material/dialog';
import { FormControl, FormGroup }    from '@angular/forms';
import * as moment                   from 'moment';

export type EventEditDialogData = {
  date: moment.Moment,
  hour: number,
}

@Component({
  selector: 'app-event-edit',
  templateUrl: './event-edit.component.html',
  styleUrls: ['./event-edit.component.scss']
})
export class EventEditComponent implements OnInit {

  form: FormGroup

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: EventEditDialogData
  ) {
    this.form = new FormGroup({
      title: new FormControl(''),
    })
  }

  ngOnInit(): void {
  }

}
