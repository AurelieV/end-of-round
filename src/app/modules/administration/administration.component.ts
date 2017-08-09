import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { MdDialog, MdDialogRef } from '@angular/material';

import { Tournament, AdministrationService } from './administration.service';
import { CreateTournamentComponent } from './create-tournament.component';

@Component({
    selector: 'administration',
    templateUrl: './administration.component.html',
    styleUrls: [ './administration.component.scss' ]
})
export class AdministrationComponent implements OnInit {
    tournaments$: Observable<Tournament[]>;
    selectedTournament: Tournament;
    @ViewChild('confirm') confirmTemplate: TemplateRef<any>;
    confirmation: MdDialogRef<any>;

    constructor(private administrationService: AdministrationService, private dialog: MdDialog, private router: Router) {}

    ngOnInit() {
        this.tournaments$ = this.administrationService.getTournaments();
    }

    createTournament() {
        const dialogRef = this.dialog.open(CreateTournamentComponent);
        dialogRef.afterClosed().subscribe(data => {
            if (!data) return;
            this.administrationService.createTournament(data.tournament, data.zones);
        });
    }

    delete($event: Event, tournament: Tournament) {
        $event.stopPropagation();
        this.selectedTournament = tournament;
        this.confirmation = this.dialog.open(this.confirmTemplate);
    }

    cancelDelete() {
        this.confirmation.close();
    }

    confirmDelete(key: string) {
        this.administrationService.deleteTournament(key);
        this.confirmation.close();
    }

    view($event: Event, key: string) {
        $event.stopPropagation();
        this.router.navigate(['tournament',  key, 'dashboard']);
    }

    edit($event: Event, key: string) {
        $event.stopPropagation();
        this.administrationService.getTournament(key).take(1).subscribe(data => {
            const dialogRef = this.dialog.open(CreateTournamentComponent);
            dialogRef.componentInstance.current = data;
            dialogRef.afterClosed().subscribe(data => {
                if (!data) return;
                this.administrationService.editTournament(key, data.tournament, data.zones);
            });
        })
    }
}