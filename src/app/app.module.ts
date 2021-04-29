import { BrowserModule }           from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule }        from '@angular/common/http';
import { NgModule }                from '@angular/core';
import { NgxsModule }              from '@ngxs/store';
import { NgxsLoggerPluginModule }  from '@ngxs/logger-plugin';

import { AppComponent }     from './app.component';
import { AngularComponent } from './angular.component';

import { PageModule }       from './page/page.module';
import { TestModule }       from './test/test.module';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [
    AppComponent,
    AngularComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    NgxsModule.forRoot([]),
    NgxsLoggerPluginModule.forRoot(),

    AppRoutingModule,

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
