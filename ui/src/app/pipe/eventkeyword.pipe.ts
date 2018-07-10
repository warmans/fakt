import { Pipe, PipeTransform } from '@angular/core';
import { Event } from '../entity/event';

@Pipe({ name: 'eventkeyword', pure: false })
export class EventKeywordPipe implements PipeTransform {
    transform(events: Event[], keyword: string): Event[] {
        if (!events) {
            return [];
        }
        return (keyword) ? events.filter(event => new RegExp(keyword).test(event.description + event.type + event.venue.name)) : events;
    }
}
