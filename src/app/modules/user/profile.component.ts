import {MatDialogRef} from '@angular/material'
import {Component, ViewChild} from '@angular/core'

import {UserService, User} from './user.service'
import {Observable} from 'rxjs/Observable'
import {CreateAccountComponent} from './create-account.component'
import {LoginComponent} from './login.component'

@Component({
  selector: 'profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent {
  page: string = 'home'
  user$: Observable<User>
  title$: Observable<string>
  typeOfUser$: Observable<string>

  constructor(
    private md: MatDialogRef<ProfileComponent>,
    private userService: UserService
  ) {}

  @ViewChild('creation') creation: CreateAccountComponent
  @ViewChild('login') login: LoginComponent

  ngOnInit() {
    this.user$ = this.userService.user
    this.title$ = this.user$.map(
      (user) =>
        user
          ? user.displayName
            ? `You are currently logged as ${user.displayName}`
            : 'You are currently an anonymous user'
          : 'Profile settings'
    )
    this.typeOfUser$ = this.user$.map((user) => {
      if (!user) return 'not-connected'
      if (user.isAnonymous) return 'anonymous'
      return 'strong-connected'
    })
  }

  onAccountCreation() {
    this.md.close()
  }

  onLoginSuccess() {
    this.md.close()
  }

  onChangePseudoSuccess() {
    this.md.close()
  }

  goToCreation() {
    this.page = 'creation'
  }

  goToLogin() {
    this.page = 'login'
  }

  changePseudo() {
    this.page = 'pseudo'
  }

  cancel() {
    this.page = 'home'
    if (this.page !== 'home') {
      this[this.page].clear()
    }
  }

  logout() {
    this.userService.logout()
  }

  close() {
    this.md.close()
  }
}
