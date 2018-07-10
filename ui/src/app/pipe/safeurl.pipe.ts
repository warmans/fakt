import { DomSanitizer } from '@angular/platform-browser';
import { PipeTransform, Pipe } from '@angular/core';

@Pipe({ name: 'safeurl' })
export class SafeURLPipe implements PipeTransform {
  
  constructor(private sanitizer: DomSanitizer) {}
  
  transform(url: any, ...args: any[]): any {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
