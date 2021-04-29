import { Component, OnInit } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { TestState } from '../state/test.state';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit {

  @Select(TestState.getName) aaa$!: Observable<string>

  constructor() { }

  ngOnInit(): void {
  }

}
