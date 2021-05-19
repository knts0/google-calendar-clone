import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

import { TopPageComponent } from './top.page'


const routes: Routes = [
  { path: '', component: TopPageComponent },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TopRoutingModule { }
