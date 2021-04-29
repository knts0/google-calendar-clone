import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageComponent } from './page.component';


const routes: Routes = [
  { path: '', component: PageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class PageRoutingModule { }
