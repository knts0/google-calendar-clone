import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import * as dayjs from 'dayjs';
import { AppModule } from 'src/app/app.module';

import { WeeklyCalendarComponent } from './weekly-calendar.component';

describe('WeeklyCalendarComponent', () => {
  let component: WeeklyCalendarComponent;
  let fixture: ComponentFixture<WeeklyCalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ AppModule ],
      declarations: [ WeeklyCalendarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WeeklyCalendarComponent);
    component = fixture.componentInstance;

    // input
    component.activeDate = dayjs('2021-04-25').startOf('day')

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // activeDateを含む1週間の日付を正しく生成できるか
  it('should calculate appropriate days in week', () => {
    fixture.detectChanges()


    const baseDate = dayjs('2021-04-19')
    expect(component.days.map(v => v.day)).toEqual([
      baseDate,
      baseDate.add(1, 'day'),
      baseDate.add(2, 'day'),
      baseDate.add(3, 'day'),
      baseDate.add(4, 'day'),
      baseDate.add(5, 'day'),
      baseDate.add(6, 'day'),
    ])
  })

  // イベントの作成
  it('should open event create dialog', fakeAsync(() => {
    // observe onClick method
    spyOn(component, 'onClickTimeFrame')

    // emit click event
    const cell = fixture.debugElement.query(By.css('.weekly-calendar-timeline__time-frame'))
    cell.triggerEventHandler('click', null)
    console.log(cell)

    // emulate waiting for async event
    tick()

    // detect change
    fixture.detectChanges()

    //
    expect(component.onClickTimeFrame).toHaveBeenCalled()
  }))
});
