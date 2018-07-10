export class Performer {
  id: string;
  name: string;
  info: string;
  genre: string;
  home: string;
  img: string;
  listen_url: string;
  tag: string[];
  images: {[key: string]: string};
  activity: string;


  static fromObjects(json: Array<Object>): Performer[] {
    return json.map(function (ev): Performer {
      return Performer.fromObject(ev)
    });
  }

  static fromObject(ob: Object): Performer {
    let e = new Performer();
    for (let key in ob) {
      if (ob.hasOwnProperty(key)) {
        e[key] = ob[key];
      }
    }
    return e;
  }

}
