import {MatDialogRef} from '@angular/material'
import {Component} from '@angular/core'

import {UserService} from './user.service'

@Component({
  selector: 'access-info',
  templateUrl: './access-info.component.html',
  styleUrls: ['./access-info.component.scss'],
})
export class AccessInfoComponent {
  password: string
  tournamentId: string
  displayError: string
  loading: boolean

  constructor(
    private md: MatDialogRef<AccessInfoComponent>,
    private userService: UserService
  ) {}

  submit() {
    this.displayError = null
    this.loading = true
    this.userService.access(this.tournamentId, this.password).subscribe(
      (data) => this.md.close(true),
      (err) => {
        this.loading = false
        this.displayError =
          err.status === 403
            ? 'This password is incorrect'
            : 'Something wrong happned, try later'
      }
    )
  }

  close() {
    this.md.close()
  }
}
