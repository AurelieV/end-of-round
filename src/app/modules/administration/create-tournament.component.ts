import { MatDialogRef, MatDialog } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import {  Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';
import { handleReturn } from '../shared/handle-return';

import { TournamentData, ZoneData, AdministrationService } from './administration.service';

@Component({
    selector: 'create-tournament',
    templateUrl: './create-tournament.component.html',
    styleUrls: ['./create-tournament.component.scss']
})
export class CreateTournamentComponent implements OnInit {
    create: boolean = true;
    previousName: string;
    zones: ZoneData[] = [];
    data: TournamentData = {
        start: 1,
        end: 100,
        name: "",
        information: ""
    }
    id: string;
    @ViewChild('confirm') confirmTemplate: TemplateRef<any>;
    confirmation: MatDialogRef<any>;

    constructor(
        private administrationService: AdministrationService,
        private router: Router,
        private route: ActivatedRoute,
        private dialog: MatDialog) {
        this.addZone();
    }

    ngOnInit() {
        this.route.paramMap.subscribe(params => {
            const id = params.get('id');
            if (id) { 
                this.administrationService.getTournament(id).take(1).subscribe(val => this.current = val);
                this.id = id;
            }
        })
    }

    set current(value: { tournament: TournamentData, zones: ZoneData[] }) {
        this.create = false;
        this.data = Object.assign({}, value.tournament);
        this.previousName = value.tournament.name;
        this.zones = Array.from(value.zones);
    }

    addZone() {
        this.zones.push({ name: `Zone ${this.zones.length + 1}`, leader: "", start: 0, end: 0, zoneLeaderPlace: "", needHelp: false })
    }

    deleteZone(index: number) {
        this.zones = this.zones.filter((zone, i) => i !== index);
    }

    cancel() {
        if (this.create) {
            this.router.navigate(['']);
        } else {
            this.router.navigate(['tournament', this.id, 'dashboard']);
        }
    }

    addOrEdit() {
        if (this.create) {
            this.administrationService.createTournament(this.data, this.zones)
                .then(tournamentId => {
                    this.router.navigate(['tournament', tournamentId, 'dashboard']);
                });
        } else {
            this.administrationService.editTournament(this.id, this.data, this.zones)
            this.router.navigate(['tournament', this.id, 'dashboard']);
        }
    }

    delete() {
        this.confirmation = this.dialog.open(this.confirmTemplate);
        handleReturn(this.confirmation);
    }

    cancelDelete() {
        this.confirmation.close();
    }

    confirmDelete() {
        this.administrationService.deleteTournament(this.id);
        this.confirmation.close();
        this.router.navigate(['']);
    }
}