import { MatDialog } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot } from '@angular/router';

import { NotificationService } from '../../notification.service';
import { UserService } from './user.service';
import { AccessInfoComponent } from './access-info.component';

@Injectable()
export class HasLoginGuard implements CanActivate {
    constructor(
        private userService: UserService,
        private notificationService: NotificationService,
        private md: MatDialog
    ) {}

    canActivate(route: ActivatedRouteSnapshot) {
        // Wait initialisation
        return this.userService.user.take(1)
            .switchMap(user => this.userService.isAuthorized(route.params.key))
            .switchMap(hasAccess => {
                const login = this.userService.login;
                if (hasAccess && login) {
                    return Observable.of(true);
                }
                const modalRef = this.md.open(AccessInfoComponent);
                modalRef.componentInstance.askLogin = !login;
                modalRef.componentInstance.askPassword = !hasAccess;
                modalRef.componentInstance.tournamentId = route.params.key;
                return modalRef.afterClosed().map(data => !!data);
        })
        
    }
}