import { Pipe, PipeTransform } from '@angular/core';


@Pipe({ name: 'shorten' })
export class ShortenText implements PipeTransform {
  transform(text: string, maxLen: number): any {
    if (text.length <= maxLen) {
      return text;
    }
    return text.slice(0, maxLen) + '...';
  }
}
