import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MdDialog } from '@angular/material';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';

import { Zone, TablesInformation } from './model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.scss' ]
})
export class AppComponent implements OnInit {
  zones$: FirebaseListObservable<Zone[]>;
  tablesInformation$: Observable<TablesInformation>;
  @ViewChild('help') help: TemplateRef<any>;

  constructor(private md: MdDialog, private db: AngularFireDatabase) {}

  ngOnInit() {
    this.zones$ = this.db.list('/vegas/zones');
    const tables$ = this.db.list('/vegas/tables');
    const outstandings$ = this.db.object('/vegas/outstandings');
    this.tablesInformation$ = Observable.combineLatest(outstandings$, tables$)
        .map(([outstandings, tables]) => {
            if (!(outstandings as any).$value) return tables;
            const ids: string[] = (outstandings as any).$value.split(' ');

            return tables.filter(t => ids.indexOf((t as any).$key) > -1);
        })
        .map(tables => ({
          playing: tables.filter(t => t.status === "playing").length,
          covered: tables.filter(t => t.status === "covered").length,
          extraTimed: tables.filter(t => t.time > 0 && t.status !== 'done').length
        }))
      ;
  }

  openHelp() {
    this.md.open(this.help);
  }
}