import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MdDialogRef, MdDialog } from '@angular/material';
import { Observable } from 'rxjs/Observable';

import { AddTablesDialogComponent } from './add-tables.dialog.component';
import { TournamentService, TournamentZone, Table } from './../tournament/tournament.service';

@Component({
    selector: 'dashboard',
    styleUrls: [ 'dashboard.component.scss' ],
    templateUrl: 'dashboard.component.html'
})
export class DashboardComponent implements OnInit {
    zones$: Observable<TournamentZone[]>;
    tables$: Observable<Table[]>;
    isOnOutstandingsStep$: Observable<boolean>;
    okTables$: Observable<Table[]>;
    extraTimedTables$: Observable<Table[]>;
    
    @ViewChild('confirmEnd') confirmEnd: TemplateRef<any>;
    confirmation: MdDialogRef<any>;

    @ViewChild('extraTimed') extraTimedTemplate: TemplateRef<any>;
    extraTimedDialog: MdDialogRef<any>;

    constructor(
        private tournamentService: TournamentService,
        private router: Router,
        private md: MdDialog,
        private route: ActivatedRoute
    ) {}

    ngOnInit() {
        this.zones$ = this.tournamentService.getZones();
        this.tables$ = this.tournamentService.getActiveTables();
        this.isOnOutstandingsStep$ = this.tournamentService.isOnOutstandingsStep();
        this.okTables$ = this.tournamentService.getOkTables();
        this.extraTimedTables$ = this.tables$
            .map(tables => tables.filter(t => t.time > 0 && t.status !== 'done').sort((a, b) => b.time - a.time));
    }

    goToZone($key: string) {
        this.router.navigate(['../../../zone', $key], { relativeTo: this.route });
    }

    endRound() {
        this.confirmation = this.md.open(this.confirmEnd);
    }

    addOutstandings() {
        const dialogRef = this.md.open(AddTablesDialogComponent);
        dialogRef.componentInstance.title = 'Add outstandings tables';
        dialogRef.afterClosed().subscribe(val => {
            if (!val) return;
            this.tournamentService.addOutstandings(val);
        });
    }

    addFeatured() {
        const dialogRef = this.md.open(AddTablesDialogComponent);
        dialogRef.componentInstance.title = 'Add featured tables'
        dialogRef.afterClosed().subscribe(val => {
            if (!val) return;
            this.tournamentService.addFeatured(val);
        });
    }

    cancelRestart() {
        this.confirmation.close();
    }

    restart() {
        this.tournamentService.restart();
        this.confirmation.close();
    }

    openExtraTimed() {
        this.extraTimedDialog = this.md.open(this.extraTimedTemplate);
    }

    closeExtraTimed() {
        this.extraTimedDialog.close();
    }

    trackByFn(val: TournamentZone) {
        return val.$key;
    }
}