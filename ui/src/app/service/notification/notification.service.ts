import {Injectable} from '@angular/core';

export class Notification {
  cls: string;
  message: string;
}

@Injectable()
export class NotificationService {

  notifications: Notification[];

  addNotification(cls: string, message: string) {
    let n = new Notification();
    n.cls = cls;
    n.message = message;
    if (this.notifications === undefined) {
      this.notifications = [];
    }
    this.notifications.push(n);
  }

  dismiss(i: number): void {
    this.notifications.splice(i, 1);
  }
}
