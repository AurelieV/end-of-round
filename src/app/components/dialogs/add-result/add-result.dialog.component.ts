import { Component } from '@angular/core';

import { Result } from '../../../model';


@Component({
    templateUrl: './add-result.dialog.component.html',
    styleUrls: [ './add-result.dialog.component.scss' ]
})
export class AddResultDialogComponent {
    result: Result = {
        player1: {
            score: 0,
            drop: false
        },
        player2: {
            score: 0,
            drop: false
        },
        draw: 0
    };

    incrementScore(id: 0 | 1) {
        this.result[`player${id}`].score++;
    }

    decrementScore(id: 0 | 1) {
        this.result[`player${id}`].score--;
    }

    incrementDraw() {
        this.result.draw++;
    }

    decrementDraw() {
        this.result.draw--;
    }
}