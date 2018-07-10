import {Injectable} from '@angular/core';
import {LoadingService} from "../loading/loading.service";
import {HttpClient, HttpParams} from "@angular/common/http";
import {NotificationService} from "../notification/notification.service";
import {Observable} from "rxjs";
import {Performer} from "../../entity/performer";
import {Event} from "../../entity/event";

import {map} from 'rxjs/operators'

@Injectable()
export class PerformerService {

  constructor(private http: HttpClient,
              private notifications: NotificationService,
              private loading: LoadingService,) {
  }

  getPerformers(query: { [key: string]: string }): Observable<Performer[]> {

    let params = new HttpParams();
    for (let key in query) {
      if (query.hasOwnProperty(key)) {
        params = params.set(key, query[key]);
      }
    }

    let sub = this.http
      .get('/api/v1/performer', {params: params})
      .pipe(
        map((r: any) => Performer.fromObjects(r.payload))
      );

    this.loading.observe(sub);
    return sub;
  }

  getPerformerEvents(performerID: string): Observable<Event[]> {
    let sub = this.http
      .get('/api/v1/performer/' + performerID + "/event")
      .pipe(
        map((r: any) => Event.fromObjects(r.payload))
      );

    this.loading.observe(sub);
    return sub;
  }
}
