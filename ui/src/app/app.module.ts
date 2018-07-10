import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';

import {MomentModule} from 'angular2-moment';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {routing} from './app.routing';
import {AppComponent} from './component/app/app.component';
import {IndexComponent} from './component/page/index/index.component';
import {EventListComponent} from './component/common/event-list/event-list.component';
import {EventService} from './service/event/event.service';
import {ShortenText} from './pipe/shorten-text.pipe';
import {EventKeywordPipe} from './pipe/eventkeyword.pipe';
import {VenuesComponent} from './component/page/venues/venues.component';
import {VenueListComponent} from './component/common/venue-list/venue-list.component';
import {SafeURLPipe} from './pipe/safeurl.pipe';
import {NotificationService} from './service/notification/notification.service';
import {LoadingService} from './service/loading/loading.service';
import {EventComponent} from './component/page/event/event.component';
import {PerformerComponent} from './component/page/performer/performer.component';
import {PerformerService} from './service/performer/performer.service';
import {EventDetailComponent} from './component/common/event-detail/event-detail.component';
import {EventCompactListComponent} from './component/common/event-compact-list/event-compact-list.component';
import {SimpleEventSearchComponent} from './component/common/simple-event-search/simple-event-search.component';
import {APIErrorInterceptor} from './interceptor/api-error';
// Observable operators
import 'rxjs/Rx';

@NgModule({
  declarations: [
    AppComponent,
    IndexComponent,
    EventListComponent,
    ShortenText,
    EventKeywordPipe,
    SafeURLPipe,
    VenuesComponent,
    VenueListComponent,
    EventComponent,
    EventDetailComponent,
    EventCompactListComponent,
    PerformerComponent,
    SimpleEventSearchComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    MomentModule,
    routing,
    NgbModule.forRoot(),
  ],
  providers: [
    EventService,
    PerformerService,
    NotificationService,
    LoadingService,
    {provide: HTTP_INTERCEPTORS, useClass: APIErrorInterceptor, multi: true}

  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
