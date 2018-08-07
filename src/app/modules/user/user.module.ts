import {NgModule} from '@angular/core'
import {FormsModule} from '@angular/forms'
import {HttpModule} from '@angular/http'
import {
  MatButtonModule,
  MatDialogModule,
  MatInputModule,
} from '@angular/material'
import {SharedModule} from '../shared/shared.module'
import {ConnectionService} from './connection.service'
import {UserService} from './user.service'

@NgModule({
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    FormsModule,
    SharedModule,
    HttpModule,
  ],
  providers: [ConnectionService, UserService],
})
export class UserModule {}
