import { SetLoginComponent } from './set-login.component';
import { MatDialog } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';

import { NotificationService } from '../../notification.service';
import { UserService } from './user.service';


@Injectable()
export class HasLoginGuard implements CanActivate {
    constructor(
        private userService: UserService,
        private notificationService: NotificationService,
        private md: MatDialog
    ) {}

    canActivate() {
        // Wait initialisation
        return this.userService.user.take(1).switchMap(user => {
            const login = this.userService.login;
            if (login) return Observable.of(true);
    
            const modalRef = this.md.open(SetLoginComponent);
            modalRef.afterClosed().subscribe(login => {
                if (login) {
                    this.userService.login = login;
                }
            })
            return modalRef.afterClosed();
        })
        
    }
}