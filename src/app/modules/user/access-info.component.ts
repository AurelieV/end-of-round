import { MatDialogRef } from '@angular/material';
import { Component } from "@angular/core";

import { UserService } from './user.service';

@Component({
    selector: 'access-info',
    templateUrl: './access-info.component.html',
    styleUrls: [ './access-info.component.scss' ]
})
export class AccessInfoComponent {
    login: string;
    password: string;

    askLogin: boolean;
    askPassword: boolean;

    tournamentId: string;
    displayError: boolean;
    loading: boolean;

    constructor(private md: MatDialogRef<AccessInfoComponent>, private userService: UserService) {}

    submit() {
        this.displayError = false;
        this.loading = true;
        if (this.askLogin) {
            this.userService.login = this.login;
        }
        if (this.askPassword) {
            this.userService.access(this.tournamentId, this.password)
                .subscribe(
                    data => this.md.close(true),
                    err => {
                        this.loading = false;
                        this.displayError = true;
                    }
                )
        } else {
            this.loading = false;
            this.md.close(true);
        }
    }

    close() {
        this.md.close();
    }
}