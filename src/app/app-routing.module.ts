import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { AngularComponent }     from './angular.component'


const routes: Routes = [
  { path: 'angular', component: AngularComponent },
  { path: 'top', loadChildren: () => import('./pages/top/top.module').then(m => m.TopModule) },
  { path: 'test', loadChildren: () => import('./test/test.module').then(m => m.TestModule) },
]

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
