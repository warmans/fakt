import {Component, OnInit} from '@angular/core';
import {EventService} from '../../../service/event/event.service';
import {Event} from '../../../entity/event';

import {ActivatedRoute, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {LoadingService} from '../../../service/loading/loading.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

  query: { [key: string]: string } = {};

  eventKeyword: string;

  events: Observable<Event[]>;

  constructor(
    public route: ActivatedRoute,
    private router: Router,
    private eventService: EventService,
    public loadingService: LoadingService) {
  }

  ngOnInit() {
    this.query = this.route.snapshot.queryParams;
    this.refreshData()
  }

  setPage(page: number) {
    this.mergeQueryData({'page': String(page)}, false);
  }

  mergeQueryData(query: { [key: string]: string }, resetOffset: boolean) {
    let newQuery = {};
    for (let key in this.query) {
      if (this.query.hasOwnProperty(key)) {
        newQuery[key] = this.query[key];
      }
    }
    for (let key in query) {
      if (query.hasOwnProperty(key)) {
        newQuery[key] = query[key];
      }
    }

    this.query = newQuery;
    this.refreshData();
  }

  updateKeyword(keyword: string) {
    this.eventKeyword = keyword;
  }

  getCurrentPage(): number {
    if (this.query['page'] !== undefined) {
      return Number(this.query['page']);
    }
    return 1;
  }

  refreshData() {

    // update URI
    this.router.navigate([], {queryParams: this.query});

    // update data
    this.events = this.eventService.getEvents(this.query);
  }
}
