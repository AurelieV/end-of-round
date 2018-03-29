import {AuthentRedirectComponent} from './authent-redirect.component'
import {SharedModule} from './modules/shared/shared.module'
import {BrowserModule} from '@angular/platform-browser'
import {BrowserAnimationsModule} from '@angular/platform-browser/animations'
import {NgModule} from '@angular/core'
import {FormsModule} from '@angular/forms'
import {HttpModule} from '@angular/http'
import {RouterModule, Routes, PreloadAllModules} from '@angular/router'
import {
  MatListModule,
  MatToolbarModule,
  MatButtonModule,
  MatIconModule,
  MatMenuModule,
  MatSnackBarModule,
  MatDialogModule,
} from '@angular/material'
import {AngularFireModule} from 'angularfire2'
import {AngularFireDatabaseModule} from 'angularfire2/database'
import {AngularFireAuthModule} from 'angularfire2/auth'

import {environment} from '../environments/environment'

/* Components */
import {AppComponent} from './app.component'
import {TournamentListComponent} from './tournament-list.component'
import {DocumentationComponent} from './documentation.component'
import {LoginComponent} from './login.component'

/* Modules */
import {UserModule} from './modules/user/user.module'

/* Service */
import {NotificationService} from './notification.service'
import {ErrorService} from './error.service'
import {ErrorComponent} from './error.component'

const appRoutes: Routes = [
  {
    path: '',
    component: TournamentListComponent,
    pathMatch: 'full',
    data: {section: 'TournamentList'},
  },
  {
    path: 'login',
    component: LoginComponent,
    data: {section: 'Login'},
  },
  {
    path: 'authent-redirect',
    component: AuthentRedirectComponent,
    data: {section: 'Login'},
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
    LoginComponent,
    AuthentRedirectComponent,
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
