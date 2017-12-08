import { TablesService } from './../tables/tables.service';
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
    EventEmitter,
    NgZone,
    HostBinding
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
import { TimeService } from '../time/time.service';
import { ZoneService } from './zone.service';

interface Filter {
    onlyPlaying: boolean;
    onlyExtraTime: boolean;
}

@Component({
    selector: "zone",
    styleUrls: [ 'zone.component.scss' ],
    templateUrl: 'zone.component.html',
    providers: [
        ZoneService
    ]
})
export class ZoneComponent implements OnInit, OnChanges, OnDestroy { 
    @Input() zoneId: string;
    @Input() isInserted: boolean;
    @Output() onClose = new EventEmitter();
    @Output() onZoneChange = new EventEmitter();

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

    @ViewChild('help') helpTemplate: TemplateRef<any>;

    @HostBinding('class.inserted')
    get inserted() {
        return this.isInserted;
    }

    constructor(
        private route: ActivatedRoute,
        private tournamentService: TournamentService,
        private md: MatDialog,
        private cd: ChangeDetectorRef,
        private dialog: MatDialog,
        private router: Router,
        private timeService: TimeService,
        private zoneService: ZoneService,
        private zone: NgZone,
        private tablesService: TablesService
    ) {}

    ngOnInit() {
        this.subscription = this.route.params
            .map(params => params.id)
            .subscribe(id => {
                if (!id) return;
                this.zoneService.key = id;
                this.zoneId = id;
            })
        ;
        this.isOnOutstandingsStep$ = this.tournamentService.isOnOutstandingsStep();
        this.zone$ = this.zoneService.getZone();
        this.tables$ = Observable.combineLatest(
            this.zoneService.getTables(),
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
        this.tables$.take(1).subscribe(_ => this.isLoading = false);
        this.isTeam$ = this.tournamentService.isTeam();
        this.otherZones$ = this.zoneService.getOtherZones();
        this.otherNeedHelp$ = this.otherZones$.map(zones => zones.filter(z => z.needHelp).length > 0);
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.zoneId) {
            this.zoneService.key = changes.zoneId.currentValue;
        }
    }

    trackByFn(table: Table) {
        return table.number;
    }

    onTableClick(table: Table) {
        let update = {};
        if (table.isFeatured && this.zoneId !== 'feature') return;
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
        handleReturn(this.confirmation);
    }

    confirmAllGreen() {
        this.confirmation.close();
        this.tournamentService.getAllTablesByZone(this.zoneService.key)
            .map(tables => tables.filter(t => !t.status))
            .take(1)
            .subscribe(tables => {
                this.cd.detach();
                tables.forEach(table => {
                    this.tournamentService.updateTable(table.number, { status: "done", doneTime: new Date() })
                });
                this.cd.reattach();
        });
    }

    cancelAllGreen() {
        this.confirmation.close();
    }

    addResult(e: Event, table: Table) {
        if (e) e.stopPropagation();
        this.tablesService.addResult(table);
    }

    assign(e: Event, table: Table) {
        if (e) e.stopPropagation();
        this.tablesService.assign(table);
    }

    addTime() {
        this.timeService.openDialog();
    }

    seeHelp() {
        this.md.open(this.helpTemplate);
    }

    goToZone(key: string) {
        if (this.isInserted) {
            this.onZoneChange.emit(key)
        } else {
            this.router.navigate(['/tournament', this.tournamentService.key, 'zone', key]);
        }
    }

    ngOnDestroy() {
        if (this.subscription) this.subscription.unsubscribe();
    }
}