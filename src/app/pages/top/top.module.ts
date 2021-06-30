import { CommonModule }                     from '@angular/common'
import { NgModule }                         from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

// material
import { MatBottomSheetModule }             from '@angular/material/bottom-sheet'
import { MatButtonModule }                  from '@angular/material/button'
import { MatCheckboxModule }                from '@angular/material/checkbox'
import { MatDatepickerModule }              from '@angular/material/datepicker'
import { MatDialogModule }                  from '@angular/material/dialog'
import { MatFormFieldModule }               from '@angular/material/form-field'
import { MatIconModule }                    from '@angular/material/icon'
import { MatInputModule }                   from '@angular/material/input'
import { MatSelectModule }                  from '@angular/material/select'
import { MatSnackBarModule }                from '@angular/material/snack-bar'
import { DragDropModule }                   from '@angular/cdk/drag-drop'
import { OverlayModule }                    from '@angular/cdk/overlay'

import { TopRoutingModule } from './top-routing.module'

import { TopPageComponent } from './top.page'

import { TopContainerComponent } from './containers/top/top.container'

import { HeaderComponent } from './components/header/header.component'
import { EventEditComponent } from './components/modal/event-edit/event-edit.component'
import { EventCreateComponent } from './components/modal/event-create/event-create.component'
import { SideMenuComponent } from './components/side-menu/side-menu.component'
import { SideMenuCalendarComponent } from './components/side-menu-calendar/side-menu-calendar.component'
import { WeeklyCalendarAllDayEventsComponent } from './components/weekly-calendar/weekly-calendar-all-day-events/weekly-calendar-all-day-events.component'
import { WeeklyCalendarHeaderComponent } from './components/weekly-calendar/weekly-calendar-header/weekly-calendar-header.component'
import { WeeklyCalendarComponent } from './components/weekly-calendar/weekly-calendar.component'
import { ConfirmDeleteComponent } from './components/confirm-delete/confirm-delete.component';
import { EventComponent } from './components/weekly-calendar/event/event.component';
import { EventPreviewComponent } from './components/weekly-calendar/event-preview/event-preview.component'
import { WeeklyCalendarPresenter } from './components/weekly-calendar/weekly-calendar.presenter';
import { CalcEventStylePipe } from './components/weekly-calendar/shared/calc-event-style.pipe';
import { CalcAllDayEventStylePipe } from './components/weekly-calendar/shared/calc-all-day-event-style.pipe';
import { MonthlyCalendarComponent } from './components/monthly-calendar/monthly-calendar.component'

@NgModule({
  declarations: [
    // page
    TopPageComponent,

    // containers
    TopContainerComponent,

    // components
    HeaderComponent,
    EventEditComponent,
    EventCreateComponent,
    SideMenuComponent,
    SideMenuCalendarComponent,
    WeeklyCalendarAllDayEventsComponent,
    WeeklyCalendarHeaderComponent,
    WeeklyCalendarComponent,
    ConfirmDeleteComponent,
    EventComponent,
    EventPreviewComponent,
    CalcEventStylePipe,
    CalcAllDayEventStylePipe,
    MonthlyCalendarComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    // material
    MatBottomSheetModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
    DragDropModule,
    OverlayModule,

    TopRoutingModule,
  ],
  providers: [
    WeeklyCalendarPresenter,
  ],
})
export class TopModule { }
