import { CommonModule }                     from '@angular/common';
import { HttpClientModule }                 from '@angular/common/http';
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

import { PageRoutingModule } from './page-routing.module';

import { PageComponent } from './page.component';
import { HeaderComponent } from './header/header.component';
import { CalendarComponent } from './calendar/calendar.component';
import { SideMenuComponent } from './side-menu/side-menu.component';
import { WeeklyCalendarComponent } from './weekly-calendar/weekly-calendar.component';
import { EventEditComponent } from './modal/event-edit/event-edit.component';
import { EventCreateComponent } from './modal/event-create/event-create.component';

@NgModule({
  declarations: [
    PageComponent,
    HeaderComponent,
    SideMenuComponent,
    CalendarComponent,
    WeeklyCalendarComponent,
    EventEditComponent,
    EventCreateComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
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

    PageRoutingModule,
  ],
  providers: [],
})
export class PageModule { }
