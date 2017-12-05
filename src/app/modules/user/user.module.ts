import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatButtonModule, MatInputModule } from '@angular/material';
import { NgModule } from '@angular/core';

import { UserService } from './user.service';
import { HasLoginGuard } from './auth-gards.service';
import { ConnectionService } from './connection.service';
import { AccessInfoComponent } from './access-info.component';
import { SharedModule } from '../shared/shared.module';
import { HttpModule } from '@angular/http';

@NgModule({
    imports: [
        MatDialogModule,
        MatButtonModule,
        MatInputModule,
        FormsModule,
        SharedModule,
        HttpModule
    ],
    declarations: [
        AccessInfoComponent
    ],
    entryComponents: [
        AccessInfoComponent
    ],
    providers: [ ConnectionService, UserService, HasLoginGuard ]
})
export class UserModule {}