import {ChangePseudoComponent} from './change-pseudo.component'
import {CreateAccountComponent} from './create-account.component'
import {FormsModule} from '@angular/forms'
import {
  MatDialogModule,
  MatButtonModule,
  MatInputModule,
} from '@angular/material'
import {NgModule} from '@angular/core'

import {UserService} from './user.service'
import {AuthenticatedGuard, SetLoginGuard} from './auth-gards.service'
import {ConnectionService} from './connection.service'
import {AccessInfoComponent} from './access-info.component'
import {SharedModule} from '../shared/shared.module'
import {HttpModule} from '@angular/http'
import {ProfileComponent} from './profile.component'
import {LoginComponent} from './login.component'

@NgModule({
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    FormsModule,
    SharedModule,
    HttpModule,
  ],
  declarations: [
    AccessInfoComponent,
    ProfileComponent,
    CreateAccountComponent,
    LoginComponent,
    ChangePseudoComponent,
  ],
  entryComponents: [AccessInfoComponent, ProfileComponent],
  providers: [
    ConnectionService,
    UserService,
    AuthenticatedGuard,
    SetLoginGuard,
  ],
})
export class UserModule {}
