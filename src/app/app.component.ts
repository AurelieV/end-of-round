import { Component, OnInit, TemplateRef, ViewChild, OnDestroy } from '@angular/core';
import { MdDialog } from '@angular/material';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { Subscription } from 'rxjs/Subscription';

import { Zone } from './model';

interface ZoneInformation {
  zone: Zone;
  needJudge: boolean;
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.scss' ]
})
export class AppComponent implements OnInit, OnDestroy {
  zones$: FirebaseListObservable<Zone[]>;
  @ViewChild('help') help: TemplateRef<any>;
  playingTableNumber: number;
  coveredTableNumber: number;
  extraTimedTableNumber: number;

  private subscriptions: Subscription[] = [];

  constructor(private md: MdDialog, private db: AngularFireDatabase) {}

  ngOnInit() {
    this.zones$ = this.db.list('/vegas/zones');
    this.subscriptions.push(this.db.object('/vegas/tables').subscribe(tables => {
        this.playingTableNumber = tables.filter(t => t.status === "playing").length;
        this.coveredTableNumber = tables.filter(t => t.status === "covered").length;
        this.extraTimedTableNumber = tables.filter(t => t.time > 0).length;
    }));
  }

  openHelp() {
    this.md.open(this.help);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }
}