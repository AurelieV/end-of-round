import { Component, OnInit, OnDestroy, ViewChild, TemplateRef, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { AngularFireDatabase } from 'angularfire2/database';
import { MatDialog, MatDialogRef } from '@angular/material';
import 'rxjs/add/operator/take';
import { handleReturn } from '../shared/handle-return';

import { TournamentService, Zone, Table } from './../tournament/tournament.service';
import { AddResultDialogComponent } from './add-result.dialog.component';

interface Filter {
    onlyPlaying: boolean;
    onlyExtraTime: boolean;
}

@Component({
    selector: "zone",
    styleUrls: [ 'zone.component.scss' ],
    templateUrl: 'zone.component.html' 
})
export class ZoneComponent implements OnInit {
    zone$: Observable<Zone>;
    tables$: Observable<Table[]>;
    filter$: BehaviorSubject<Filter> = new BehaviorSubject({
        onlyPlaying: false,
        onlyExtraTime: false
    });
    isOnOutstandingsStep$: Observable<boolean>;
    zoneId: string;
    isLoading: boolean = true;

    @ViewChild('confirm') confirmTemplate: TemplateRef<any>;
    confirmation: MatDialogRef<any>;

    @ViewChild('assignJudges') assignJudgesTemplate: TemplateRef<any>;
    assignJudges: MatDialogRef<any>;
    assignData: any = {};

    @ViewChild('help') helpTemplate: TemplateRef<any>;

    constructor(
        private route: ActivatedRoute,
        private tournamentService: TournamentService,
        private md: MatDialog,
        private cd: ChangeDetectorRef
    ) {}

    ngOnInit() {
        this.zone$ = this.route.params
            .map(params => params.id)
            .switchMap(id => {
                this.zoneId = id;
                return this.tournamentService.getZone(id)
            })
        ;
        this.tables$ = this.zone$.switchMap(zone => {
            return Observable.combineLatest(
                this.tournamentService.getActiveTablesByZone(zone),
                this.filter$,
                this.isOnOutstandingsStep$
            ).map(([tables, filters, isOnOutstandingsStep]) => {
                if (isOnOutstandingsStep) return tables;
                return tables.filter(t => {
                        if (filters.onlyExtraTime && !t.time) return false;
                        if (filters.onlyPlaying && t.status !== 'playing' && t.status !== 'covered') return false;

                        return true;
                });
            })
        });
        this.tables$.take(1).subscribe(_ => this.isLoading = false);
        this.isOnOutstandingsStep$ = this.tournamentService.isOnOutstandingsStep();
    }

    onTableClick(table: Table) {
        let update = {};
        if (table.status === "featured") return;
        switch (table.status) {
            case "":
                update = { status: "playing" };
                break;
            case "playing":
                update = { status: "covered" };
                break;
            case "covered":
                update = { status: "done", doneTime: new Date() };
                break;
            case "done":
                update = { status: "playing", doneTime: null };
                break;
        }
        this.tournamentService.updateTable(table.number, update);
    }

    callHelp(needHelp: boolean) {
       this.tournamentService.updateZone(this.zoneId, { needHelp });
    }

    toggleOnlyPlaying(val: boolean) {
        this.filter$.take(1).subscribe(f => this.filter$.next(Object.assign({}, f, { onlyPlaying: val })));
    }

    toggleOnlyExtraTime(val: boolean) {
        this.filter$.take(1).subscribe(f => this.filter$.next(Object.assign({}, f, { onlyExtraTime: val })));
    }

    allGreen() {
        this.confirmation = this.md.open(this.confirmTemplate);
        handleReturn(this.assignJudges);
    }

    assign() {
        this.assignJudges = this.md.open(this.assignJudgesTemplate);
        handleReturn(this.assignJudges);
    }

    confirmAllGreen() {
        this.confirmation.close();
        this.zone$.take(1).subscribe(zone => {
            this.tournamentService.getAllTablesByZone(zone)
                .map(tables => tables.filter(t => !t.status))
                .take(1)
                .subscribe(tables => {
                    this.cd.detach();
                    tables.forEach(table => {
                        this.tournamentService.updateTable(table.number, { status: "done", doneTime: new Date() })
                    });
                    this.cd.reattach();
                });
        });
    }

    confirmAssignJudges(form) {
        const judge = this.assignData.judge;
        const tableIds = this.assignData.tables.match(/(\d+)/g) || [];
        this.assignData = {};
        form.reset();
        tableIds.forEach(id => {
            this.tournamentService.updateTable(id, { assignated: judge })
        });
        this.assignJudges.close();
    }

    cancelAllGreen() {
        this.confirmation.close();
    }

    cancelAssignJudges() {
        this.assignJudges.close();
    }

    addResult(e: Event, table: any) {
        e.stopPropagation();
        const dialogRef = this.md.open(AddResultDialogComponent, { width: "90%" });
        handleReturn(dialogRef);
        if (table.result) {
            dialogRef.componentInstance.result = table.result;
        }
        dialogRef.afterClosed().subscribe(result => {
            if (!result) return;
            this.tournamentService.updateTable(table.number, { 
                result,
                status: 'done',
                doneTime: table.doneTime  || new Date()
            })
        });
    }

    seeHelp() {
        this.md.open(this.helpTemplate);
    }
}