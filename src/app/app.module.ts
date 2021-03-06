import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent }     from './app.component';
import { AngularComponent } from './angular.component';
import { PageComponent } from './page/page.component';
import { HeaderComponent } from './page/header/header.component';

@NgModule({
  declarations: [
    AppComponent,
    AngularComponent,
    PageComponent,
    HeaderComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
