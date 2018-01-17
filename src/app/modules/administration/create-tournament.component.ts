import {MatDialogRef, MatDialog} from '@angular/material'
import {Router, ActivatedRoute} from '@angular/router'
import {Component, OnInit, ViewChild, TemplateRef} from '@angular/core'
import {Observable} from 'rxjs/Observable'
import 'rxjs/add/observable/combineLatest'
import {handleReturn} from '../shared/handle-return'

import {
  TournamentData,
  ZoneData,
  AdministrationService,
} from './administration.service'

@Component({
  selector: 'create-tournament',
  templateUrl: './create-tournament.component.html',
  styleUrls: ['./create-tournament.component.scss'],
})
export class CreateTournamentComponent implements OnInit {
  create: boolean = true
  previousName: string
  zones: ZoneData[] = []
  data: TournamentData = {
    start: 1,
    end: 100,
    name: '',
    information: '',
    isTeam: false,
  }
  password: string
  id: string
  @ViewChild('confirm') confirmTemplate: TemplateRef<any>
  confirmation: MatDialogRef<any>

  constructor(
    private administrationService: AdministrationService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {
    this.addZone()
  }

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('tournamentKey')
      if (id) {
        this.administrationService
          .getTournament(id)
          .take(1)
          .subscribe((val) => (this.current = val))
        this.id = id
      }
    })
  }

  set current(value: {tournament: TournamentData; zones: ZoneData[]}) {
    this.create = false
    this.data = Object.assign({}, value.tournament)
    this.previousName = value.tournament.name
    this.zones = Array.from(value.zones)
  }

  addZone() {
    this.zones = (this.zones || []).concat({
      name: `Zone ${this.zones.length + 1}`,
      tables: [{start: 0, end: 100}],
    })
  }

  addSection(zoneIndex: number) {
    this.zones[zoneIndex].tables = (this.zones[zoneIndex].tables || []).concat({
      start: 0,
      end: 0,
    })
  }

  deleteZone(index: number) {
    this.zones = this.zones.splice(index, 1)
  }

  deleteSection(zoneIndex: number, sectionIndex: number) {
    this.zones[zoneIndex].tables = this.zones[zoneIndex].tables.splice(
      sectionIndex,
      1
    )
  }

  cancel() {
    if (this.create) {
      this.router.navigate([''])
    } else {
      this.router.navigate(['tournament', this.id, 'dashboard'])
    }
  }

  addOrEdit() {
    if (this.create) {
      this.administrationService
        .createTournament(this.data, this.zones, this.password)
        .then((tournamentId) => {
          this.router.navigate(['/'])
        })
    } else {
      this.administrationService.editTournament(this.id, this.data, this.zones)
      this.router.navigate(['tournament', this.id, 'dashboard'])
    }
  }

  delete() {
    this.confirmation = this.dialog.open(this.confirmTemplate)
    handleReturn(this.confirmation)
  }

  cancelDelete() {
    this.confirmation.close()
  }

  confirmDelete() {
    this.administrationService.deleteTournament(this.id)
    this.confirmation.close()
    this.router.navigate([''])
  }
}
