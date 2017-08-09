import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AgoPipe } from './pipes/ago.pipe';
import { WarnAgoPipe } from './pipes/warn-ago.pipe';
import { ResultPipe } from './pipes/result.pipe';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        AgoPipe,
        WarnAgoPipe,
        ResultPipe
    ],
    exports: [
        CommonModule,
        AgoPipe,
        WarnAgoPipe,
        ResultPipe
    ]
})
export class SharedModule {}