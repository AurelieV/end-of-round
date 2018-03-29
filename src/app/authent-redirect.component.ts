import {NotificationService} from './notification.service'
import {UserService} from './modules/user/user.service'
import {ActivatedRoute, Router} from '@angular/router'
import {Component, OnInit} from '@angular/core'

@Component({
  selector: 'authent-redirect',
  template: '<loader [isLoading]="isLoading"></loader>',
})
export class AuthentRedirectComponent implements OnInit {
  isLoading = true
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.route.queryParamMap.take(1).subscribe((params) => {
      if (!params.has('code')) {
        this.notificationService.notify('Incorrect authentification')
        return this.router.navigate(['/'])
      }
      this.userService.processJudgeAppsToken(params.get('code')).subscribe(
        () => {
          this.router.navigate(['/'])
        },
        () => {
          this.isLoading = false
          this.notificationService.notify(
            'Impossible to process authentification'
          )
          this.router.navigate(['/'])
        }
      )
    })
  }
}
