import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Event} from '../../entity/event';
import {Observable} from 'rxjs';
import {NotificationService} from '../notification/notification.service';
import {LoadingService} from '../loading/loading.service';

import {map} from 'rxjs/operators'

@Injectable()
export class EventService {

  constructor(private http: HttpClient,
              private notifications: NotificationService,
              private loading: LoadingService,) {
  }

  getEvents(query: { [key: string]: string }): Observable<Event[]> {

    let params = new HttpParams();
    for (let key in query) {
      if (query.hasOwnProperty(key)) {
        params = params.set(key, query[key]);
      }
    }

    let sub = this.http
      .get('/api/v1/event', {params: params})
      .pipe(
        map((r: any) => Event.fromObjects(r.payload))
      );
    this.loading.observe(sub);

    return sub;
  }

  getSimilarEvents(eventID: string): Observable<Event[]> {

    let params = new HttpParams();
    params = params.set('page_size', '5');

    let sub = this.http
      .get('/api/v1/event/' + eventID + '/similar', {params: params})
      .pipe(
        map((r: any) => Event.fromObjects(r.payload)),
      );

    this.loading.observe(sub);
    return sub;
  }

  getEventTags(): Observable<Object[]> {

    let params = new HttpParams();
    params = params.set('with_events', 'true');

    let sub = this.http
      .get('/api/v1/tag', {params: params})
      .pipe(
        map((r: any) => Event.fromObjects(r.payload))
      );

    this.loading.observe(sub);
    return sub;
  }
}
