import {NgModule} from '@angular/core'
import {FormsModule} from '@angular/forms'
import {HttpModule} from '@angular/http'
import {
  MatButtonModule,
  MatDialogModule,
  MatIconModule,
  MatListModule,
  MatMenuModule,
  MatSnackBarModule,
  MatToolbarModule,
} from '@angular/material'
import {BrowserModule} from '@angular/platform-browser'
import {BrowserAnimationsModule} from '@angular/platform-browser/animations'
import {PreloadAllModules, RouterModule, Routes} from '@angular/router'
import {AngularFireModule} from 'angularfire2'
import {AngularFireAuthModule} from 'angularfire2/auth'
import {AngularFireDatabaseModule} from 'angularfire2/database'
import {environment} from '../environments/environment'
/* Components */
import {AppComponent} from './app.component'
import {DocumentationComponent} from './documentation.component'
import {ErrorComponent} from './error.component'
import {ErrorService} from './error.service'
import {SharedModule} from './modules/shared/shared.module'
/* Modules */
import {UserModule} from './modules/user/user.module'
/* Service */
import {NotificationService} from './notification.service'
import {TournamentListComponent} from './tournament-list.component'

const appRoutes: Routes = [
  {
    path: '',
    component: TournamentListComponent,
    pathMatch: 'full',
    data: {section: 'TournamentList'},
  },
  {
    path: 'tournament/:tournamentKey',
    loadChildren: './modules/tournament/tournament.module#TournamentModule',
    data: {section: 'Tournament'},
  },
  {
    path: 'administration',
    loadChildren:
      './modules/administration/administration.module#AdministrationModule',
    data: {section: 'Administration'},
  },
  {
    path: 'documentation',
    component: DocumentationComponent,
    data: {section: 'Documentation'},
  },
]

@NgModule({
  declarations: [
    AppComponent,
    TournamentListComponent,
    DocumentationComponent,
    ErrorComponent,
  ],
  imports: [
    /* Angular */
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(appRoutes, {preloadingStrategy: PreloadAllModules}),
    SharedModule,

    /* Angular Material */
    MatListModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatSnackBarModule,
    MatDialogModule,

    /* FireBase */
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,

    /* Custom */
    UserModule,
  ],
  providers: [NotificationService, ErrorService],
  bootstrap: [AppComponent],
  entryComponents: [ErrorComponent],
})
export class AppModule {}
