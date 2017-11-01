import { SharedModule } from './modules/shared/shared.module';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import { MatListModule, MatToolbarModule, MatButtonModule } from '@angular/material';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth'

import { environment } from '../environments/environment';

/* Components */
import { AppComponent } from './app.component';
import { TournamentListComponent } from './tournament-list.component';

/* Modules */
import { TournamentModule } from './modules/tournament/tournament.module';

/* Service */
import { ConnectionService } from './connection.service';
import { UserService } from './user.service';

const appRoutes: Routes = [
  { path: '', component: TournamentListComponent, pathMatch: 'full' },
  { path: 'tournament/:key', loadChildren: './modules/tournament/tournament.module#TournamentModule' },
  { path: 'administration', loadChildren: './modules/administration/administration.module#AdministrationModule' }
]

@NgModule({
  declarations: [
    AppComponent,
    TournamentListComponent
  ],
  imports: [
    /* Angular */
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(appRoutes),
    SharedModule,

    /* Angular Material */
    MatListModule,
    MatToolbarModule,
    MatButtonModule,

    /* FireBase */
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule
  ],
  providers: [ ConnectionService, UserService ],
  bootstrap: [ AppComponent ]
})
export class AppModule {}
