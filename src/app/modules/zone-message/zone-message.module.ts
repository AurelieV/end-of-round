import { MdDialogModule, MdInputModule, MdButtonModule, MdIconModule } from '@angular/material';
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
        MdDialogModule,
        MdInputModule,
        MdButtonModule,
        MdIconModule
    ],
    declarations: [
        ZoneMessageComponent
    ],
    exports: [
        ZoneMessageComponent
    ]
})
export class ZoneMessageModule {}