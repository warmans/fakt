import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import {NotificationService} from '../service/notification/notification.service';

@Injectable()
export class APIErrorInterceptor implements HttpInterceptor {

  constructor(private notifications: NotificationService) {
  }

  intercept(req: HttpRequest<any>,
            next: HttpHandler): Observable<HttpEvent<any>> {

    return next.handle(req).do(
      (evt: any) => {},
      (err: any) => {
        if (err instanceof HttpErrorResponse) {
          console.log(err);
          let msg = err.message || 'Unknown error';
          this.notifications.addNotification('alert-danger', msg);
          return Observable.throw(err);
        }
      }
    );
  }
}
