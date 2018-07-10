import {Component, Input, OnInit, EventEmitter, Output} from '@angular/core';
import {Event} from '../../../entity/event';

import {Observable} from 'rxjs';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss'],
})
export class EventListComponent implements OnInit {

  @Input()
  events: Observable<Event[]>;

  @Input()
  keyword: string;

  @Output()
  onPageChange = new EventEmitter<number>();

  @Input()
  enablePagination = false;

  @Input()
  curPage = 1;

  constructor() {
  }

  ngOnInit() {
  }

  nextPage() {
    this.curPage++;
    this.onPageChange.emit(this.curPage);
  }

  prevPage() {
    if (this.curPage === 1) {
      return
    }
    this.curPage--;
    this.onPageChange.emit(this.curPage);
  }
}
