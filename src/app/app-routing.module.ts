import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AngularComponent }     from './angular.component';
import { PageComponent } from './page/page.component';


const routes: Routes = [
  { path: 'angular', component: AngularComponent },
  { path: 'top', component: PageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
