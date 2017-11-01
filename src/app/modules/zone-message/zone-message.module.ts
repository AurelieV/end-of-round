import { MatDialogModule, MatInputModule, MatButtonModule, MatIconModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';

/* Components */
import { ZoneMessageComponent } from './zone-message.component';

@NgModule({
    imports: [
        SharedModule,
        FormsModule,

        // Angular material
        MatDialogModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule
    ],
    declarations: [
        ZoneMessageComponent
    ],
    exports: [
        ZoneMessageComponent
    ]
})
export class ZoneMessageModule {}