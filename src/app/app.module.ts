import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import { MdToolbarModule } from '@angular/material';

import { AppComponent } from './app.component';
import { AdminComponent } from './components/admin/admin.component';
import { TournamentService } from './services/tournament.service';
import { ZoneComponent } from './components/zone/zone.component';

const appRoutes: Routes = [
  { path: '', redirectTo: 'admin', pathMatch: 'full' },
  { path: 'admin', component: AdminComponent },
  { path: 'zone/:id', component: ZoneComponent }
]

@NgModule({
  declarations: [
    AppComponent,
    AdminComponent,
    ZoneComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    MdToolbarModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [
    TournamentService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
