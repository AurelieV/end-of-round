import { Component } from '@angular/core';

import { TournamentData, ZoneData } from './administration.service';

@Component({
    selector: 'create-tournament',
    templateUrl: './create-tournament.component.html'
})
export class CreateTournamentComponent {
    create: boolean = true;
    previousName: string;
    zones: ZoneData[] = [];
    data: TournamentData = {
        start: 1,
        end: 100,
        name: "",
        information: ""
    }

    set current(value: { tournament: TournamentData, zones: ZoneData[] }) {
        this.create = false;
        this.data = Object.assign({}, value.tournament);
        this.previousName = value.tournament.name;
        this.zones = Array.from(value.zones);
    }

    addZone() {
        this.zones.push({ name: `Zone ${this.zones.length + 1}`, leader: "", message: "", start: 0, end: 0 })
    }

    deleteZone(index: number) {
        this.zones = this.zones.filter((zone, i) => i !== index);
    }

    constructor() {
        this.addZone();
    }
}