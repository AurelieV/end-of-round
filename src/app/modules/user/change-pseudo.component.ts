import {Component, EventEmitter, Output, ViewChild} from '@angular/core'

import {UserService} from './user.service'
import {FormControl} from '@angular/forms'

@Component({
  selector: 'change-pseudo',
  templateUrl: './change-pseudo.component.html',
  styleUrls: ['./change-pseudo.component.scss'],
})
export class ChangePseudoComponent {
  @Output() onSuccess = new EventEmitter()

  @ViewChild('form') form: FormControl

  loading: boolean = false

  pseudo: string

  constructor(private userService: UserService) {}

  changePseudo() {
    this.loading = true
    this.userService.login = this.pseudo
    this.onSuccess.emit()
  }

  clear() {
    this.loading = false
    this.pseudo = ''
    this.form.reset()
  }
}
