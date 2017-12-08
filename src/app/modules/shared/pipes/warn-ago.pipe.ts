import { Pipe, ChangeDetectorRef, PipeTransform, OnDestroy, NgZone } from '@angular/core';
import * as moment from 'moment';

const limit = 2;

@Pipe({name: 'warnAgo', pure: false})
export class WarnAgoPipe implements PipeTransform, OnDestroy {
  private currentTimer: number | null;

  private lastTime: Number;
  private lastValue: Date | moment.Moment;
  private lastText: boolean;

  constructor(private cdRef: ChangeDetectorRef, private ngZone: NgZone) {}

  transform(value: Date | moment.Moment): boolean {
        if (this.hasChanged(value)) {
            this.lastTime = this.getTime(value);
            this.lastValue = value;
            this.removeTimer();
            this.createTimer();
            this.lastText = Math.abs(moment().diff(moment(value), 'minute')) > limit;
        } else {
            this.createTimer();
        }

        return this.lastText;
  }

  ngOnDestroy(): void {
    this.removeTimer();
  }


  private createTimer() {
        if (this.currentTimer) {
            return;
        }
        const momentInstance = moment(this.lastValue);
        this.currentTimer = this.ngZone.runOutsideAngular(() => {
            if (typeof window !== 'undefined') {
                return window.setTimeout(() => {
                    this.lastText = Math.abs(moment().diff(momentInstance, 'minute')) > limit;
                    this.currentTimer = null;
                    this.ngZone.run(() => this.cdRef.markForCheck());
                }, 30 * 1000);
            }
        });
  }


  private removeTimer() {
    if (this.currentTimer) {
      window.clearTimeout(this.currentTimer);
      this.currentTimer = null;
    }
  }

  private hasChanged(value: Date | moment.Moment) {
        return this.getTime(value) !== this.lastTime;
  }

  private getTime(value: Date | moment.Moment) {
        if (moment.isDate(value)) {
            return value.getTime();
        } else if (moment.isMoment(value)) {
            return value.valueOf();
        } else {
            return moment(value).valueOf();
        }
  }
}
