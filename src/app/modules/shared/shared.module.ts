import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AgoPipe } from './pipes/ago.pipe';
import { WarnAgoPipe } from './pipes/warn-ago.pipe';
import { ResultPipe } from './pipes/result.pipe';

import { LoaderComponent } from './components/loader.component';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        AgoPipe,
        WarnAgoPipe,
        ResultPipe,
        LoaderComponent
    ],
    exports: [
        CommonModule,
        AgoPipe,
        WarnAgoPipe,
        ResultPipe,
        LoaderComponent
    ]
})
export class SharedModule {}