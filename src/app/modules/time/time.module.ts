import { MatInputModule, MatRadioModule, MatButtonModule } from '@angular/material';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { FormsModule } from '@angular/forms';

/* Modules */
import { SharedModule } from './../shared/shared.module';

/* Component */
import { TimeDialogComponent } from './time.dialog.component';
import { DisplayTimeComponent } from './display-time.component'

/* Service */
import { TimeService } from './time.service';

@NgModule({
    imports: [
        MatInputModule,
        MatRadioModule,
        MatButtonModule,
        SharedModule,
        FormsModule
    ],
    declarations: [
        TimeDialogComponent,
        DisplayTimeComponent
    ],
    entryComponents: [
        TimeDialogComponent
    ],
    exports: [
        DisplayTimeComponent
    ]
})
export class TimeModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: TimeModule,
            providers: [ TimeService ] 
        }
    }
}