import { Component, OnInit, Input } from '@angular/core';
import { Event } from '../../../entity/event';

@Component({
  selector: 'app-event-compact-list',
  templateUrl: './event-compact-list.component.html',
  styleUrls: ['./event-compact-list.component.scss']
})
export class EventCompactListComponent implements OnInit {

  @Input()
  events: Event[]

  @Input()
  listTitle = 'Similar Events'

  constructor() { }

  ngOnInit() {
  }

}
