import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, Subject} from 'rxjs';

@Injectable()
export class LoadingService {

  public isLoading: Subject<boolean> = new BehaviorSubject(false);

  private observed: Observable<any>[] = [];

  constructor() {
  }

  observe(sub: Observable<any>) {
    if (this.observed.indexOf(sub) !== -1) {
      return;
    }
    // consider observable complete on the first event
    sub.subscribe(() => this.unobserve(sub), () => this.unobserve(sub));

    // allow multiple observables
    this.observed.push(sub);
    this.checkLoading();
  }

  unobserve(sub: Observable<any>) {
    let index = this.observed.indexOf(sub);
    this.observed.splice(index, 1);
    this.checkLoading();
  }

  checkLoading() {
    this.isLoading.next(this.observed.length > 0);
  }
}
