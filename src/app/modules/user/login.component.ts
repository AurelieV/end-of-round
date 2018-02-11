import {Component, EventEmitter, Output, ViewChild} from '@angular/core'

import {UserService} from './user.service'
import {FormControl} from '@angular/forms'

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  @Output() onLoginSuccess = new EventEmitter()

  @ViewChild('form') form: FormControl

  errorMessage: string
  loading: boolean = false

  email: string
  password: string

  constructor(private userService: UserService) {}

  login() {
    this.loading = true
    this.errorMessage = ''
    this.userService
      .signIn(this.email, this.password)
      .then(() => {
        this.clear()
        this.onLoginSuccess.emit()
      })
      .catch((err) => {
        this.errorMessage = err.message
        this.loading = false
      })
  }

  clear() {
    this.loading = false
    this.email = this.password = ''
    this.form.reset()
  }
}
