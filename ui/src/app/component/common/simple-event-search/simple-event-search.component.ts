import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {EventService} from '../../../service/event/event.service';

@Component({
  selector: 'app-simple-event-search',
  templateUrl: './simple-event-search.component.html',
  styleUrls: ['./simple-event-search.component.scss']
})
export class SimpleEventSearchComponent implements OnInit {

  @Input()
  defaultQueryValue: {[key: string]: string} = {};

  @Output()
  onQueryUpdate = new EventEmitter<{[key: string]: string}>();

  @Output()
  onKeywordUpdate = new EventEmitter<string>();

  keywordDebouncer: Subject<any> = new Subject();

  keyword: string;

  query: {[key: string]: string} = {};

  tags: Observable<Object[]>;

  constructor(private eventService: EventService) {
  }

  ngOnInit() {

    for (let key in this.defaultQueryValue) {
      if (this.defaultQueryValue.hasOwnProperty(key)) {
        this.query[key] = this.defaultQueryValue[key];
      }
    }

    // set some defaults
    if (this.query['date_relative'] === undefined) {
      this.query['date_relative'] = '';
    }
    if (this.query['tag'] === undefined) {
      this.query['tag'] = '';
    }

    // setup keyword debounce
    this.keywordDebouncer.debounceTime(500).subscribe((val) => this.onKeywordUpdate.emit(val));

    // get available tags
    this.tags = this.eventService.getEventTags();
  }

  handleFormChange(event: any, query: {[key: string]: string}) {
    this.query = query;
    this.onQueryUpdate.emit(this.query);
  }


  handleKeywordChange(keyword: string) {
    this.keywordDebouncer.next(keyword);
  }

}
