import {Component, EventEmitter, Output, ViewChild} from '@angular/core'

import {UserService} from './user.service'
import {FormControl} from '@angular/forms'

@Component({
  selector: 'create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.scss'],
})
export class CreateAccountComponent {
  @Output() onCreation = new EventEmitter()

  @ViewChild('form') form: FormControl

  errorMessage: string
  loading: boolean = false

  email: string
  password: string
  pseudo: string

  constructor(private userService: UserService) {}

  createAccount() {
    this.errorMessage = ''
    this.loading = true
    this.userService
      .createAccount({
        email: this.email,
        pseudo: this.pseudo,
        password: this.password,
      })
      .then(() => {
        this.loading = false
        this.clear()
        this.onCreation.emit()
      })
      .catch((error) => {
        this.loading = false
        this.errorMessage = error.message
      })
  }

  clear() {
    this.loading = false
    this.email = this.password = this.pseudo = ''
    this.form.reset()
  }
}
