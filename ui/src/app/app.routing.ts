import {ModuleWithProviders} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {IndexComponent} from './component/page/index/index.component';
import {VenuesComponent} from './component/page/venues/venues.component';
import {EventComponent} from './component/page/event/event.component';
import {PerformerComponent} from './component/page/performer/performer.component';

export const appRoutes: Routes = [
  {
    path: '',
    redirectTo: '/browse',
    pathMatch: 'full'
  },
  {
    path: 'browse',
    component: IndexComponent,

  }, {
    path: 'venues',
    component: VenuesComponent,
  }, {
    path: 'event/:id',
    component: EventComponent,
  }, {
    path: 'performer/:id',
    component: PerformerComponent,
  }, {
    path: '**',
    redirectTo: '/browse',//todo: 404 page?
  }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
