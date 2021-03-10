import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent }     from './app.component';
import { AngularComponent } from './angular.component';
import { PageComponent } from './page/page.component';
import { HeaderComponent } from './page/header/header.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CalendarComponent } from './page/calendar/calendar.component';
import { SideMenuComponent } from './page/side-menu/side-menu.component';
import { WeeklyCalendarComponent } from './page/weekly-calendar/weekly-calendar.component';

@NgModule({
  declarations: [
    AppComponent,
    AngularComponent,
    PageComponent,
    HeaderComponent,
    SideMenuComponent,
    CalendarComponent,
    WeeklyCalendarComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
