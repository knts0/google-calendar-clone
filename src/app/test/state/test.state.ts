import { Injectable } from '@angular/core'
import { Selector, State } from '@ngxs/store'

export interface TestStateModel {
  aaa: string
}


@State<TestStateModel>({
  name: 'test',
  defaults: {
    aaa: 'aa'
  }
})
@Injectable()
export class TestState {

  @Selector()
  static getName(state: TestStateModel): string {
    return state.aaa
  }

}
