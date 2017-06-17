import { Component, Input, ViewChild } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';

import { Zone } from '../../model';

@Component({
    selector: 'zone-message',
    templateUrl: './zone-message.component.html',
    styleUrls: [ './zone-message.component.scss' ]
})
export class ZoneMessageComponent {
    @Input() zone: Zone;
    messages$: Observable<Zone>;
    message: string;

    constructor(private db: AngularFireDatabase) {}

    ngOnChanges() {
        if (!this.zone || !(this.zone as any).$key) return;
        this.messages$ = this.db.object('/vegas/zones/' + (this.zone as any).$key + '/message');
    }

    addMessage() {
        this.messages$.take(1).subscribe(m => {
            const newMessage = `${this.message}\n${(m as any).$value || ''}`;
            this.db.object('/vegas/zones/' + (this.zone as any).$key).update( { message: newMessage });
            this.message = "";
        })
    }

}