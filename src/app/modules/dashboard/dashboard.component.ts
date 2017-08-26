import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MdDialogRef, MdDialog } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/take';
import 'rxjs/add/observable/combineLatest';
import { handleReturn } from '../shared/handle-return';

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
    remainingTables$: Observable<Table[]>;
    remainingTablesByZone$: Observable<any>;
    extraTimedTables$: Observable<Table[]>;
    isLoading: boolean = true;
    
    @ViewChild('confirmEnd') confirmEnd: TemplateRef<any>;
    confirmation: MdDialogRef<any>;

    @ViewChild('extraTimed') extraTimedTemplate: TemplateRef<any>;
    extraTimedDialog: MdDialogRef<any>;

    @ViewChild('remainingTables') remainingTablesTemplate: TemplateRef<any>;
    remainingTablesDialog: MdDialogRef<any>;

    constructor(
        private tournamentService: TournamentService,
        private router: Router,
        private md: MdDialog,
        private route: ActivatedRoute
    ) {}

    ngOnInit() {
        this.zones$ = this.tournamentService.getZones();
        this.zones$.take(1).subscribe(_ => this.isLoading = false);
        this.tables$ = this.tournamentService.getActiveTables();
        this.remainingTables$ = this.tables$.map(tables => tables.filter(t => t.status !== 'done'));
        this.remainingTablesByZone$ = Observable.combineLatest(this.remainingTables$, this.zones$)
            .map(([tables, zones]) => {
                const result: any[] = [];
                zones.forEach(zone => {
                    result.push({
                        name: zone.name,
                        tables: tables.filter(t => +t.$key >= zone.start && +t.$key <= zone.end)
                    });
                });
                return result;
            })
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
        handleReturn(dialogRef);
        dialogRef.componentInstance.title = 'Add outstandings tables';
        dialogRef.componentInstance.warning = '/!\\ Be aware that this will delete all others table from the current rond'
        dialogRef.afterClosed().subscribe(val => {
            if (!val) return;
            this.tournamentService.addOutstandings(val);
        });
    }

    addFeatured() {
        const dialogRef = this.md.open(AddTablesDialogComponent);
        handleReturn(dialogRef);
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
        handleReturn(this.extraTimedDialog);
    }

    closeExtraTimed() {
        this.extraTimedDialog.close();
    }

    openRemainingTables() {
        this.remainingTablesDialog = this.md.open(this.remainingTablesTemplate);
        handleReturn(this.remainingTablesDialog);
    }

    closeRemainingTables() {
        this.remainingTablesDialog.close();
    }

    trackByFn(val: TournamentZone) {
        return val.$key;
    }
}