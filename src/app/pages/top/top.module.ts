import { CommonModule }                     from '@angular/common';
import { NgModule }                         from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// material
import { MatBottomSheetModule }             from '@angular/material/bottom-sheet';
import { MatButtonModule }                  from '@angular/material/button';
import { MatCheckboxModule }                from '@angular/material/checkbox';
import { MatMomentDateModule }              from '@angular/material-moment-adapter';
import { MatDatepickerModule }              from '@angular/material/datepicker';
import { MatDialogModule }                  from '@angular/material/dialog';
import { MatFormFieldModule }               from '@angular/material/form-field';
import { MatIconModule }                    from '@angular/material/icon';
import { MatInputModule }                   from '@angular/material/input';
import { MatSelectModule }                  from '@angular/material/select';
import { OverlayModule }                    from '@angular/cdk/overlay';

import { TopRoutingModule } from './top-routing.module';

import { TopPageComponent } from './top.page'

import { TopContainerComponent } from './containers/top/top.container';

import { HeaderComponent } from './views/header/header.component';
import { EventEditComponent } from './views/modal/event-edit/event-edit.component';
import { EventCreateComponent } from './views/modal/event-create/event-create.component';
import { SideMenuComponent } from './views/side-menu/side-menu.component';
import { CalendarComponent } from './views/side-menu/calendar/calendar.component';
import { WeeklyCalendarComponent } from './views/weekly-calendar/weekly-calendar.component';

@NgModule({
  declarations: [
    // page
    TopPageComponent,

    // containers
    TopContainerComponent,

    // views
    HeaderComponent,
    EventEditComponent,
    EventCreateComponent,
    SideMenuComponent,
    CalendarComponent,
    WeeklyCalendarComponent,
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
    MatMomentDateModule,
    MatSelectModule,
    OverlayModule,

    TopRoutingModule,
  ],
  providers: [],
})
export class TopModule { }
