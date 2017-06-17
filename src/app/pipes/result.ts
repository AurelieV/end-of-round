import { Pipe, PipeTransform } from '@angular/core';

import { Result } from '../model';

@Pipe({name: 'result' })
export class ResultPipe implements PipeTransform {

    transform(value: Result): string {
        if (!value) return "";
        let result = "";
        if (value.player1.drop) {
            result += 'X-';
        }
        result += `${value.player1.score}-${value.player2.score}`;
        if (value.draw > 0) {
            result += "-d"
        }
        if (value.player2.drop) {
            result += '-X';
        }

        return result;
    }
}
