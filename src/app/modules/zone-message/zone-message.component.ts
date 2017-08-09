import { MdDialog } from '@angular/material';
import { Subscription } from 'rxjs/Subscription';
import { Component, ViewChild, TemplateRef, OnChanges, Input, OnDestroy, HostBinding } from '@angular/core';
import 'rxjs/add/operator/skip';
import { Observable } from 'rxjs/Observable';

import { TournamentService, TournamentZone } from './../tournament/tournament.service';


@Component({
    selector: 'zone-message',
    templateUrl: './zone-message.component.html',
    styleUrls: [ './zone-message.component.scss' ]
})
export class ZoneMessageComponent implements OnChanges, OnDestroy {
    @Input() zone: TournamentZone;
    
    messages$: Observable<string>;

    isMessageOpen: boolean = false;

    @HostBinding("class.new")
    hasNewMessage: boolean | null;
    
    @ViewChild('message') messageTemplate: TemplateRef<any>;
    subscription: Subscription;
    newMessage: string;

    constructor(private md: MdDialog, private tournamentService: TournamentService) {}

    ngOnChanges() {
       if (!this.zone) return;
       this.messages$ = this.tournamentService.getMessages(this.zone.$key);
       if (this.subscription) this.subscription.unsubscribe();
       this.subscription = this.messages$.skip(1).subscribe(message => {
            if (!message) {
                this.hasNewMessage = false;
                return;
            }
            if (!this.isMessageOpen) {
                this.hasNewMessage = true;
            }
        });
    }

    seeMessage($event) {
        $event.stopPropagation();
        this.hasNewMessage = false;
        this.isMessageOpen = true;
        const dialogRef = this.md.open(this.messageTemplate);
        dialogRef.afterClosed().subscribe(_ => {
            this.isMessageOpen = false;
        });
    }

    addMessage() {
        this.tournamentService.sendMessage(this.zone.$key, this.newMessage);
        this.newMessage = "";
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}

