import { Pipe, PipeTransform } from '@angular/core';

import { Result } from '../model';

@Pipe({name: 'result' })
export class ResultPipe implements PipeTransform {

    transform(value: Result): string {
        if (!value) return "";
        let result = `${value.player1.score}-${value.draw}-${value.player2.score}`;
        if (value.player1.drop) {
            result += ' P1 drop';
        }
        if (value.player2.drop) {
            result += ' P2 drop';
        }

        return result;
    }
}
