import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialogRef, MatDialog } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/take';
import 'rxjs/add/observable/combineLatest';
import { handleReturn } from '../shared/handle-return';

import { AddTablesDialogComponent } from './add-tables.dialog.component';
import { TimeDialogComponent } from './../tournament/time.dialog.component';
import { TournamentService, Zone, Table } from './../tournament/tournament.service';

@Component({
    selector: 'dashboard',
    styleUrls: [ 'dashboard.component.scss' ],
    templateUrl: 'dashboard.component.html'
})
export class DashboardComponent implements OnInit {
    name: 'DashboardComponent';
    
    zones$: Observable<Zone[]>;
    tables$: Observable<Table[]>;
    isOnOutstandingsStep$: Observable<boolean>;
    okTables$: Observable<Table[]>;
    remainingTables$: Observable<Table[]>;
    remainingTablesByZone$: Observable<any>;
    extraTimedTables$: Observable<Table[]>;
    isLoading: boolean = true;
    
    @ViewChild('confirmEnd') confirmEnd: TemplateRef<any>;
    confirmation: MatDialogRef<any>;

    @ViewChild('extraTimed') extraTimedTemplate: TemplateRef<any>;
    extraTimedDialog: MatDialogRef<any>;

    @ViewChild('remainingTables') remainingTablesTemplate: TemplateRef<any>;
    remainingTablesDialog: MatDialogRef<any>;

    constructor(
        private tournamentService: TournamentService,
        private router: Router,
        private md: MatDialog,
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
                        tables: tables.filter(t => +t.number >= zone.start && +t.number <= zone.end)
                    });
                });
                return result;
            })
        this.isOnOutstandingsStep$ = this.tournamentService.isOnOutstandingsStep();
        this.okTables$ = this.tournamentService.getOkTables();
        this.extraTimedTables$ = this.tables$
            .map(tables => tables.filter(t => t.time > 0 && t.status !== 'done').sort((a, b) => b.time - a.time));
    }

    goToZone(key: string) {
        this.router.navigate(['../../../zone', key], { relativeTo: this.route });
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
            if (val.useWalterParsing) {
                const parsed = window["Papa"].parse(val.tables, {
                    header: true
                });
                const tables = parsed.data.map(d => d["Table"]).join(" ");
                this.tournamentService.addOutstandings(tables, val.replaceExisting);
            } else {
                this.tournamentService.addOutstandings(val.tables, val.replaceExisting);
            }
        });
    }

    addFeatured() {
        const dialogRef = this.md.open(AddTablesDialogComponent);
        handleReturn(dialogRef);
        dialogRef.componentInstance.title = 'Add featured tables'
        dialogRef.afterClosed().subscribe(val => {
            if (!val) return;
            this.tournamentService.addFeatured(val.tables, val.replaceExisting);
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

    trackByFn(val: Zone) {
        return val.key;
    }

    addTime() {
        const dialogRef = this.md.open(TimeDialogComponent);
        handleReturn(dialogRef);
    }
}