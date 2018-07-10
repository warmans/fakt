import {Component, OnInit} from '@angular/core';
import {EventService} from '../../../service/event/event.service';
import {Event} from '../../../entity/event';
import {ActivatedRoute, Params} from '@angular/router';
import {LoadingService} from '../../../service/loading/loading.service';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss']
})
export class EventComponent implements OnInit {

  event: Event;

  similarEvents: Event[];

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService,
    public loadingService: LoadingService) {
  }

  ngOnInit() {
    this.route.params
      .switchMap((params: Params) => this.eventService.getEvents({ids: params['id']}))
      .subscribe(events => this.setEvent(events[0]));
  }

  setEvent(event: Event) {
    this.event = event;
    this.getSimilar(event);
  }

  setSimilar(events: Event[]) {
    this.similarEvents = events;
  }

  getSimilar(event: Event) {
    this.eventService.getSimilarEvents(event.id).subscribe(events => this.setSimilar(events));
  }

}
