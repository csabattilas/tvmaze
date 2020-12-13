import {Injectable} from '@angular/core';
import {Apollo} from 'apollo-angular';
import gql from 'graphql-tag';
import {ScheduleQuery, Settings} from '../types';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';

@Injectable()
export class DashboardService {
  constructor(
    private readonly  apollo: Apollo,
  ) {
  }

  schedule(settings: Settings): Observable<ScheduleQuery> {
    return this.apollo.watchQuery<ScheduleQuery>({
      query: gql`
          query ScheduleQuery($settings: InputSettings!) {
            schedule(settings: $settings) {
              id
              name
              genre
              rating
              airdate
              airtime
              image {
                medium
              }
            }
          }
        `,
      variables: {
        settings
      }
    }).valueChanges.pipe(
      map(({data}) => data)
    );
  }
}
