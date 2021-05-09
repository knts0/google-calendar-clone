import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TopContainerComponent } from './top.container';

describe('TopContainerComponent', () => {
  let component: TopContainerComponent;
  let fixture: ComponentFixture<TopContainerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TopContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

});
