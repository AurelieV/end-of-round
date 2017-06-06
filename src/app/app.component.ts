import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MdDialog } from '@angular/material';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

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
export class AppComponent implements OnInit {
  zones$: FirebaseListObservable<Zone[]>;
  @ViewChild('help') help: TemplateRef<any>;

  constructor(private md: MdDialog, private db: AngularFireDatabase) {}

  ngOnInit() {
    this.zones$ = this.db.list('/vegas/zones');
  }

  openHelp() {
    this.md.open(this.help);
  }
}