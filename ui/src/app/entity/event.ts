import { Venue } from './venue';
import { Performer } from './performer';

export class Event {
    id: string;
    date: string;
    description: string;
    type: string;
    venue: Venue;
    performer: Performer[];
    utag: string[];
    source: string;

    public getImageURL(size: string): string {
        if (this.performer !== undefined) {
            for (let p of this.performer) {
                if (p.images[size]) {
                    return p.images[size]
                }
            }
        }
        return '';
    }

    public getTitle(): string {
        return this.type + " at " + this.venue.name;
    }

    public getTags(max: number): string[] {
      let tags = [];
      if (this.performer !== undefined) {
        for (let p of this.performer) {
          for (let t of p.tag) {
            if (max > 0 && tags.length >= max) {
              return tags
            }
            tags.push(t)
          }
        }
      }
      return tags
    }

    static fromObjects(json: Array<Object>): Event[] {
        return json.map(function (ev): Event {
            return Event.fromObject(ev)
        });
    }

    static fromObject(ob: Object): Event {
        let e = new Event();
        for (let key in ob) {
            if (ob.hasOwnProperty(key)) {
                e[key] = ob[key];
            }
        }
        return e;
    }
}
