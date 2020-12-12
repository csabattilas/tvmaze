import {Injectable} from '@angular/core';
import {Apollo, gql} from 'apollo-angular';
import {SearchQuery} from '../types';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(
    private readonly  apollo: Apollo,
  ) {
  }

  shows(q: string): Observable<SearchQuery> {
    return this.apollo.watchQuery<SearchQuery>({
      query: gql`
          query($q: String!){
            shows(q: $q) {
              id
              name
              image {
                medium
              }
            }
          }
        `,
      variables: {
        q
      }
    }).valueChanges.pipe(
      map(({data}) => data)
    );
  }
}
