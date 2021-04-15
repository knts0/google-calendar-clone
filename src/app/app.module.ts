import { BrowserModule }                    from '@angular/platform-browser';
import { CommonModule }                     from '@angular/common';
import { HttpClientModule }                 from '@angular/common/http';
import { NgModule }                         from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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

import { AppRoutingModule } from './app-routing.module';
import { AppComponent }     from './app.component';
import { AngularComponent } from './angular.component';
import { PageComponent } from './page/page.component';
import { HeaderComponent } from './page/header/header.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CalendarComponent } from './page/calendar/calendar.component';
import { SideMenuComponent } from './page/side-menu/side-menu.component';
import { WeeklyCalendarComponent } from './page/weekly-calendar/weekly-calendar.component';
import { EventEditComponent } from './page/modal/event-edit/event-edit.component';
import { EventCreateComponent } from './page/modal/event-create/event-create.component';

@NgModule({
  declarations: [
    AppComponent,
    AngularComponent,
    PageComponent,
    HeaderComponent,
    SideMenuComponent,
    CalendarComponent,
    WeeklyCalendarComponent,
    EventEditComponent,
    EventCreateComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
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
    AppRoutingModule,
    BrowserAnimationsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
