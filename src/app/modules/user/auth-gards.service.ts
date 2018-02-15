import {MatDialog} from '@angular/material'
import {Observable} from 'rxjs/Observable'
import {Injectable} from '@angular/core'
import {
  CanActivate,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
} from '@angular/router'

import {NotificationService} from '../../notification.service'
import {UserService} from './user.service'
import {AccessInfoComponent} from './access-info.component'

@Injectable()
export class AuthenticatedGuard implements CanActivate {
  constructor(
    private userService: UserService,
    private notificationService: NotificationService,
    private md: MatDialog
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
      .switchMap((user) => this.userService.isAuthorized(params.tournamentKey))
      .switchMap((hasAccess) => {
        const login = this.userService.login
        if (hasAccess && login) {
          return Observable.of(true)
        }
        const modalRef = this.md.open(AccessInfoComponent)
        modalRef.componentInstance.askLogin = !login
        modalRef.componentInstance.askPassword = !hasAccess
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
export class SetLoginGuard implements CanActivate {
  constructor(private userService: UserService, private md: MatDialog) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.userService.user.take(1).switchMap((user) => {
      const login = this.userService.login
      if (login) {
        return Observable.of(true)
      }
      const modalRef = this.md.open(AccessInfoComponent)
      modalRef.componentInstance.askLogin = true
      modalRef.componentInstance.askPassword = false
      return modalRef.afterClosed().map((t) => true)
    })
  }
}
