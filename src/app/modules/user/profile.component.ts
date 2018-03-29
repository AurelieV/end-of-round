import {MatDialogRef} from '@angular/material'
import {Router} from '@angular/router'
import {Component, ViewChild, Optional} from '@angular/core'

import {UserService, User, UserInfo} from './user.service'
import {Observable} from 'rxjs/Observable'

@Component({
  selector: 'profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent {
  user$: Observable<User>
  userInfo$: Observable<UserInfo>
  isLoading: boolean = false

  constructor(
    private userService: UserService,
    private router: Router,
    @Optional() private md: MatDialogRef<ProfileComponent>
  ) {}

  ngOnInit() {
    this.user$ = this.userService.user
    this.userInfo$ = this.userService.userInfo
  }

  login() {
    this.isLoading = true
    this.userService.loginWithJudgeApps()
  }

  logout() {
    this.isLoading = true
    this.userService.logout()
    this.router.navigate(['/'])
    if (this.md) {
      this.md.close()
    }
  }
}
