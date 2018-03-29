import {MatDialog} from '@angular/material'
import {Observable} from 'rxjs/Observable'
import {Injectable} from '@angular/core'
import {
  CanActivate,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
  Router,
} from '@angular/router'

import {NotificationService} from '../../notification.service'
import {UserService} from './user.service'
import {AccessInfoComponent} from './access-info.component'

@Injectable()
export class AuthenticatedGuard implements CanActivate {
  constructor(
    private userService: UserService,
    private notificationService: NotificationService,
    private md: MatDialog,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let root = state.root
    let params: any = Object.assign({}, root.params)
    while (root.children.length > 0) {
      root = root.children[0]
      params = Object.assign(params, root.params)
    }
    return this.userService.user
      .take(1)
      .switchMap((user) => {
        if (!user) {
          this.router.navigate(['/login'])
          this.notificationService.notify('You must be connected')
          return Observable.of(null)
        }
        return this.userService.isAuthorized(params.tournamentKey)
      })
      .switchMap((hasAccess) => {
        if (hasAccess === null) {
          return Observable.of(false)
        }
        if (hasAccess) {
          return Observable.of(true)
        }
        const modalRef = this.md.open(AccessInfoComponent)
        modalRef.componentInstance.tournamentId = params.tournamentKey
        modalRef.afterClosed().subscribe((data) => {
          if (!data) {
            this.notificationService.notify('Access denied')
          }
        })
        return modalRef.afterClosed().map((data) => !!data)
      })
  }
}

@Injectable()
export class ConnectedGuard implements CanActivate {
  constructor(
    private userService: UserService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.userService.user.take(1).switchMap((user) => {
      if (!user) {
        this.router.navigate(['/login'])
        this.notificationService.notify('You must be connected')
        return Observable.of(false)
      }
      return Observable.of(true)
    })
  }
}
