import {Injectable} from '@angular/core';
import {ShowQuery} from '../../types';
import {Apollo, gql} from 'apollo-angular';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShowService {

  constructor(private readonly  apollo: Apollo) {
  }

  show(id: string): Observable<ShowQuery> {
    return this.apollo.watchQuery<ShowQuery>({
      query: gql`
          query($id: ID!){
            show(id: $id) {
              name
              summary
              image {
                medium
              }
              episodes(id: $id) {
                name
                airdate
                airtime
                summary
              }
              network {
                name
                country {
                  name
                }
              }
              cast(id: $id) {
                name
              }
            }
          }
        `,
      variables: {
        id
      }
    }).valueChanges.pipe(
      map(({data}) => data)
    );
  }
}
