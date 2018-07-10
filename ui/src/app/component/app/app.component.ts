import {Component, OnInit} from '@angular/core';
import {NotificationService} from '../../service/notification/notification.service';
import {LoadingService} from '../../service/loading/loading.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  public showLoading = false;

  constructor(public notificationService: NotificationService, private loadingService: LoadingService) {
  }

  ngOnInit() {
    this.loadingService.isLoading.asObservable().subscribe((isLoading: boolean) => {
      this.showLoading = isLoading;
    });
  }
}
