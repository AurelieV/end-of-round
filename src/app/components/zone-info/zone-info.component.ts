import { Component, Input, OnChanges, HostBinding, ViewChild, TemplateRef, OnDestroy } from '@angular/core';
import { MdDialogRef, MdDialog } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/skip';
import { Subscription } from 'rxjs/Subscription'; 
import { AngularFireDatabase } from 'angularfire2/database';

import { Table, TablesInformation, Zone } from '../../model';

@Component({
    selector: 'zone-info',
    templateUrl: './zone-info.component.html',
    styleUrls: [ './zone-info.component.scss' ]
})
export class ZoneInfoComponent implements OnChanges, OnDestroy {
    @Input() zone: any;
    @Input() tables: Table[];
    isMessageOpen: boolean | null = false;
    tablesInformation: TablesInformation;
    extraTimeTables: Table[] = [];
    newMessage: boolean | null;
    subscription: Subscription;
    @ViewChild('message') messageTemplate: TemplateRef<any>;

    @HostBinding("class.need-help") get needHelp() {
        return this.zone.needHelp;
    }

    constructor(private md: MdDialog, private db: AngularFireDatabase) {}

    ngOnInit() {
        this.subscription = this.db.object('/vegas/zones/' + (this.zone as any).$key + '/message')
            .skip(1)
            .map(t => t.$value)
            .distinctUntilChanged(x => x)
            .subscribe(message => {
                if (!message) {
                    this.newMessage = false;
                    return;
                }
                if (!this.isMessageOpen) {
                    this.newMessage = true;
                }
        });
    }

    ngOnChanges(changes) {
        const tables = (this.tables || []).filter(t => +(t as any).$key >= this.zone.start && +(t as any).$key <= this.zone.end);
        this.extraTimeTables = (tables || []).filter(t => t.time > 0 && t.status !== "done");
        this.tablesInformation = {
            playing: tables.filter(t => t.status === "playing").length,
            covered: tables.filter(t => t.status === "covered").length,
            extraTimed: this.extraTimeTables.length
        }
    }

    seeMessage($event) {
        $event.stopPropagation();
        this.newMessage = false;
        this.isMessageOpen = true;
        const dialogRef = this.md.open(this.messageTemplate);
        dialogRef.afterClosed().subscribe(_ => {
            this.isMessageOpen = false;
        });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}