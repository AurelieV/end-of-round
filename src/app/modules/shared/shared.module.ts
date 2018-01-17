import {CommonModule} from '@angular/common'
import {NgModule} from '@angular/core'

import {AgoPipe} from './pipes/ago.pipe'
import {ResultPipe} from './pipes/result.pipe'

import {LoaderComponent} from './components/loader.component'

@NgModule({
  imports: [CommonModule],
  declarations: [AgoPipe, ResultPipe, LoaderComponent],
  exports: [CommonModule, AgoPipe, ResultPipe, LoaderComponent],
})
export class SharedModule {}
