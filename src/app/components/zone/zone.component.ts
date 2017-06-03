import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Zone, Table } from '../../model';
import { TournamentService } from '../../services/tournament.service';


@Component({
    selector: "zone",
    styleUrls: [ 'zone.component.scss' ],
    templateUrl: 'zone.component.html' 
})
export class ZoneComponent implements OnInit {
    zone: Zone;
    tables: Table[];

    constructor(private route: ActivatedRoute, private tournamentService: TournamentService) {}

    ngOnInit() {
        this.route.params
            .map(params => params.id)
            .switchMap(id => this.tournamentService.getZone(id))
            .subscribe(zone => {
                this.zone = zone;
                this.tournamentService.getTables(zone).subscribe(tables => this.tables = tables);
            })
        ;
    }

    onTableClick(id: number) {
        this.tables = this.tables.map(table => {
            if (table.id !== id) {
                return table;
            }
            switch (table.status) {
                case null:
                    return Object.assign({}, table, { status: "not-finished" });
                case "not-finished":
                    return Object.assign({}, table, { status: "ok" });
                case "ok":
                    return Object.assign({}, table, { status: "need-info" });
                case "need-info":
                    return Object.assign({}, table, { status: "not-finished" });
            }
        });
    }
}