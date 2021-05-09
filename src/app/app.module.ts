import { BrowserModule }           from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule }        from '@angular/common/http';
import { NgModule }                from '@angular/core';
import { NgxsModule }              from '@ngxs/store';
import { NgxsEmitPluginModule }    from '@ngxs-labs/emitter';
import { NgxsLoggerPluginModule }  from '@ngxs/logger-plugin';

import { AppComponent }     from './app.component';
import { AngularComponent } from './angular.component';

import { AppRoutingModule } from './app-routing.module';
import { CalendarState } from './store/calendar/calendar.state';

@NgModule({
  declarations: [
    AppComponent,
    AngularComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    NgxsModule.forRoot([
      CalendarState,
    ]),
    NgxsEmitPluginModule.forRoot(),
    NgxsLoggerPluginModule.forRoot(),

    AppRoutingModule,

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
