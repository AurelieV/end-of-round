import {Observable} from 'rxjs/Observable'
import {Component, Input, HostBinding} from '@angular/core'

@Component({
  selector: 'loader',
  template:
    '<div class="loader"></div><div class="loader-text">Fetching data ...</div>',
  styleUrls: ['./loader.component.scss'],
})
export class LoaderComponent {
  @Input() isLoading: boolean = true

  @HostBinding('class.hide')
  get hide() {
    return !this.isLoading
  }
}
