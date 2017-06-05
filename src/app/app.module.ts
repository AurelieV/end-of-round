import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import { MdToolbarModule, MdButtonModule, MdIconModule, MdDialogModule, MdInputModule } from '@angular/material';

import { AppComponent } from './app.component';
import { AdminComponent } from './components/admin/admin.component';
import { TournamentService } from './services/tournament.service';
import { ZoneComponent } from './components/zone/zone.component';
import { TimeComponent } from './components/time/time.component';

const appRoutes: Routes = [
  { path: '', redirectTo: 'admin', pathMatch: 'full' },
  { path: 'admin', component: AdminComponent },
  { path: 'zone/:id', component: ZoneComponent }
]

@NgModule({
  declarations: [
    AppComponent,
    AdminComponent,
    ZoneComponent,
    TimeComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    MdToolbarModule,
    MdButtonModule,
    MdIconModule,
    MdDialogModule,
    MdInputModule,
    RouterModule.forRoot(appRoutes)
  ],
  entryComponents: [
    TimeComponent
  ],
  providers: [
    TournamentService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
