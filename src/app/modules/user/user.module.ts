import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatButtonModule, MatInputModule } from '@angular/material';
import { NgModule } from '@angular/core';

import { UserService } from './user.service';
import { HasLoginGuard } from './auth-gards.service';
import { ConnectionService } from './connection.service';
import { SetLoginComponent } from './set-login.component';

@NgModule({
    imports: [
        MatDialogModule,
        MatButtonModule,
        MatInputModule,
        FormsModule
    ],
    declarations: [
        SetLoginComponent
    ],
    entryComponents: [
        SetLoginComponent
    ],
    providers: [ ConnectionService, UserService, HasLoginGuard ]
})
export class UserModule {}