import { 
    Component,
    OnInit,
    OnDestroy,
    ViewChild,
    TemplateRef,
    ChangeDetectorRef,
    Input,
    SimpleChanges,
    OnChanges,
    Output,
    EventEmitter
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { AngularFireDatabase } from 'angularfire2/database';
import { MatDialog, MatDialogRef } from '@angular/material';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/do';
import { handleReturn } from '../shared/handle-return';
import { Subscription } from 'rxjs/Subscription';

import { TournamentService, Zone, Table } from './../tournament/tournament.service';
import { AddResultDialogComponent } from './add-result.dialog.component';
import { TimeService } from '../time/time.service';

interface Filter {
    onlyPlaying: boolean;
    onlyExtraTime: boolean;
}

@Component({
    selector: "zone",
    styleUrls: [ 'zone.component.scss' ],
    templateUrl: 'zone.component.html' 
})
export class ZoneComponent implements OnInit, OnChanges, OnDestroy { 
    @Input() zoneId: string;
    @Output() onClose = new EventEmitter();

    private subscription: Subscription;

    zone$: Observable<Zone>;
    otherZones$: Observable<Zone[]>;
    tables$: Observable<Table[]>;
    filter$: BehaviorSubject<Filter> = new BehaviorSubject({
        onlyPlaying: false,
        onlyExtraTime: false
    });
    isOnOutstandingsStep$: Observable<boolean>;
    isLoading: boolean = true;
    otherNeedHelp$: Observable<boolean>;
    isTeam$: Observable<boolean>;

    @ViewChild('confirm') confirmTemplate: TemplateRef<any>;
    confirmation: MatDialogRef<any>;

    @ViewChild('assignJudges') assignJudgesTemplate: TemplateRef<any>;
    assignJudges: MatDialogRef<any>;
    assignData: any = {
        displayTableInput: true
    };

    @ViewChild('help') helpTemplate: TemplateRef<any>;

    constructor(
        private route: ActivatedRoute,
        private tournamentService: TournamentService,
        private md: MatDialog,
        private cd: ChangeDetectorRef,
        private dialog: MatDialog,
        private router: Router,
        private timeService: TimeService
    ) {}

    ngOnInit() {
        this.subscription = this.route.params
            .map(params => params.id)
            .subscribe(id => {
                if (!id) return;
                this.setZone(id);
                this.cd.detectChanges();
            })
        ;
        this.isOnOutstandingsStep$ = this.tournamentService.isOnOutstandingsStep();
        this.isTeam$ = this.tournamentService.getTournament().map(t => t.isTeam);
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.zoneId) {
            this.setZone(changes.zoneId.currentValue)
        }
    }

    setZone(zoneId: string) {
        this.zoneId = zoneId === 'all' ? '' : zoneId;
        this.zone$ = this.tournamentService.getZone(this.zoneId);
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
        this.otherZones$ = this.tournamentService.getZones().map(zones => zones.filter(z => z.key !== this.zoneId));
        this.otherNeedHelp$ = this.otherZones$.map(zones => zones.filter(z => z.needHelp).length > 0);
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

    assign(tableId?: number, $event?) {
        this.assignJudges = this.md.open(this.assignJudgesTemplate);
        this.assignData.displayTableInput = !tableId;
        if (tableId) this.assignData.table = tableId;
        if ($event) $event.stopPropagation();
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
        const tableId = this.assignData.table;
        this.assignData = {};
        form.reset();
        this.tournamentService.updateTable(tableId, { assignated: judge, status: 'covered' });
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
        dialogRef.componentInstance.setTableId(table.number);
        dialogRef.afterClosed().subscribe(({result = ""}) => {
            if (!result) return;
            this.tournamentService.updateTable(table.number, { 
                result,
                status: 'done',
                doneTime: table.doneTime  || new Date()
            })
        });
    }

    addResultToTable() {
        const dialogRef = this.md.open(AddResultDialogComponent, { width: "90%" });
        handleReturn(dialogRef);
        dialogRef.afterClosed().subscribe(({number = "", result = ""}) => {
            if (!result) return;
            this.tournamentService.updateTable(number, { 
                result,
                status: 'done',
                doneTime: new Date()
            })
        });
    }

    addTime() {
        this.timeService.openDialog();
    }

    seeHelp() {
        this.md.open(this.helpTemplate);
    }

    goToZone(key: string) {
        this.router.navigate(['/tournament', this.tournamentService.getKey(), 'zone', key])
    }

    ngOnDestroy() {
        if (this.subscription) this.subscription.unsubscribe();
    }
}