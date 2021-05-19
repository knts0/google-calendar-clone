import { CommonModule }  from '@angular/common'
import { NgModule }      from '@angular/core'
import { NgxsModule }    from '@ngxs/store'

import { TestComponent } from './test/test.component'
import { TestState     } from './state/test.state'
import { TestRoutingModule } from './test-routing.module'

@NgModule({
  declarations: [
    TestComponent,
  ],
  imports: [
    CommonModule,

    TestRoutingModule,

    NgxsModule.forFeature([
      TestState
    ])
  ],
  providers: [],
})
export class TestModule { }
