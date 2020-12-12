import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {APOLLO_OPTIONS} from 'apollo-angular';
import {HttpLink, HttpLinkHandler} from 'apollo-angular/http';
import {InMemoryCache} from '@apollo/client/core';
import {DashboardService} from './dashboard/dashboard.service';
import {HttpClientModule} from '@angular/common/http';
import {DashboardModule} from './dashboard/dashboard.module';
import {SearchModule} from './search/search.module';
import {SharedModule} from './shared/shared.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    DashboardModule,
    SearchModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    SharedModule,
    BrowserAnimationsModule
  ],
  providers: [
    DashboardService,
    {
      provide: APOLLO_OPTIONS,
      useFactory(httpLink: HttpLink): {cache: InMemoryCache, link: HttpLinkHandler} {
        return {
          cache: new InMemoryCache(),
          link: httpLink.create({
            uri: 'http://localhost:4000/graphql',
          }),
        };
      },
      deps: [HttpLink],
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
